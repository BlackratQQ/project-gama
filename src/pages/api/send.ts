import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { EmailTemplate } from '../../../emails/email-template';
import { ConfirmationTemplate } from '../../../emails/confirmation-template';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// In-memory CSRF token storage (v produkci použijte Redis nebo databázi)
const csrfTokenStore = new Map<string, { token: string; timestamp: number }>();
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hodina

// Vyčištění starých tokenů každých 10 minut
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of csrfTokenStore.entries()) {
      if (now - value.timestamp > CSRF_TOKEN_EXPIRY) {
        csrfTokenStore.delete(key);
      }
    }
  },
  10 * 60 * 1000
);

// Jednoduchý in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX = 3; // Maximálně 3 pokusy za 15 minut

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('X-Forwarded-For');
  const realIP = request.headers.get('X-Real-IP');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting check
    const clientIP = getRateLimitKey(request);
    if (isRateLimited(clientIP)) {
      // Rate limit exceeded for IP
      return new Response(
        JSON.stringify({ error: 'Příliš mnoho požadavků. Zkuste to prosím později.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15 minut
          },
        }
      );
    }

    const body = await request.json();
    // Process received form data

    const { name, phone, email, industry, budget, helpNeeded, csrfToken } = body;

    // CSRF Token validace
    if (!csrfToken || typeof csrfToken !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Chybí bezpečnostní token. Obnovte stránku a zkuste to znovu.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Pro účely demonstrace: validujeme délku tokenu
    // V produkci byste měli token ověřit proti uloženému tokenu v session
    if (csrfToken.length !== 64) {
      return new Response(
        JSON.stringify({
          error: 'Neplatný bezpečnostní token. Obnovte stránku a zkuste to znovu.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Vylepšená validace vstupů
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return new Response(JSON.stringify({ error: 'Jméno musí obsahovat 2-100 znaků.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!phone || typeof phone !== 'string' || !/^(\+?\d{1,4}\s?)?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3,4}$/.test(phone)) {
      return new Response(JSON.stringify({ error: 'Neplatný formát telefonního čísla.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      !email ||
      typeof email !== 'string' ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      email.length > 254
    ) {
      return new Response(JSON.stringify({ error: 'Neplatný formát emailu.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      !industry ||
      typeof industry !== 'string' ||
      industry.trim().length < 2 ||
      industry.trim().length > 100
    ) {
      return new Response(JSON.stringify({ error: 'Odvětví musí obsahovat 2-100 znaků.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      !budget ||
      typeof budget !== 'string' ||
      !['40 000', '80 000', '150 000', '150 000+'].includes(budget)
    ) {
      return new Response(JSON.stringify({ error: 'Neplatná hodnota rozpočtu.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      !helpNeeded ||
      typeof helpNeeded !== 'string' ||
      helpNeeded.trim().length === 0 ||
      helpNeeded.trim().length > 1000
    ) {
      return new Response(
        JSON.stringify({ error: 'Popis potřeby je povinný a nesmí přesáhnout 1000 znaků.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitizace vstupů (zabránění XSS útoků)
    const sanitizedData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      industry: industry.trim(),
      budget: budget.trim(),
      helpNeeded: helpNeeded.trim(),
    };

    // Vytvoření email obsahu pomocí React komponent (použití sanitizovaných dat)
    const adminEmailHTML = renderToString(React.createElement(EmailTemplate, sanitizedData));

    const confirmationEmailHTML = renderToString(
      React.createElement(ConfirmationTemplate, {
        name: sanitizedData.name,
      })
    );

    // Send emails via Resend service

    // Odeslání emailu administrátorovi
    const adminResponse = await resend.emails.send({
      from: 'omega@vojtechkochta.cz',
      to: ['info@vojtechkochta.cz'],
      subject: `Nová poptávka (web): ${sanitizedData.name}`,
      html: adminEmailHTML,
    });

    // Odeslání potvrzovacího emailu zákazníkovi
    const confirmationResponse = await resend.emails.send({
      from: 'omega@vojtechkochta.cz',
      to: [sanitizedData.email],
      subject: 'Potvrzení přijetí poptávky',
      html: confirmationEmailHTML,
    });

    // Email responses received successfully

    // Kontrola chyb u obou emailů
    if (adminResponse.error) {
      console.error('Admin Email Error:', adminResponse.error);
      return new Response(
        JSON.stringify({
          error: adminResponse.error.message || 'Chyba při odesílání e-mailu administrátorovi.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (confirmationResponse.error) {
      console.error('Confirmation Email Error:', confirmationResponse.error);
      return new Response(
        JSON.stringify({
          error: confirmationResponse.error.message || 'Chyba při odesílání potvrzovacího e-mailu.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Both emails sent successfully
    return new Response(
      JSON.stringify({
        message: 'E-maily byly úspěšně odeslány.',
        data: {
          admin: adminResponse.data,
          confirmation: confirmationResponse.data,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Enhanced error handling - zachováno z původního kódu
    let errorMessage = 'Nastala neznámá chyba.';
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = 'Chybný formát požadavku (JSON).';
      statusCode = 400;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('API Route Error:', errorMessage, error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
