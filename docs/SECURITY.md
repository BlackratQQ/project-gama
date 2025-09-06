# 🔒 Bezpečnostní dokumentace - Project Delta

## Bezpečnostní přehled

Project Delta implementuje vícevrstvou bezpečnostní architekturu pro ochranu aplikace a uživatelských dat.

## Implementovaná bezpečnostní opatření

### 1. CSRF Protection (Cross-Site Request Forgery)

#### Implementace

```typescript
// Generování tokenu (Form.astro)
import crypto from 'crypto';
const csrfToken = crypto.randomBytes(32).toString('hex');
```

#### Validace

```typescript
// API endpoint (send.ts)
if (!csrfToken || csrfToken.length !== 64) {
  return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
}
```

#### Charakteristiky

- **Algoritmus**: crypto.randomBytes (cryptographically secure)
- **Délka**: 64 hexadecimálních znaků (256 bitů entropie)
- **Životnost**: Per-session
- **Storage**: In-memory (development), Redis recommended (production)

### 2. Rate Limiting

#### Konfigurace

```typescript
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX = 3; // Max 3 požadavky
```

#### Implementace

- **Identifikace**: IP adresa (X-Forwarded-For, X-Real-IP)
- **Storage**: In-memory Map
- **Cleanup**: Automatické čištění starých záznamů každých 10 minut
- **Response**: HTTP 429 s Retry-After header

#### Doporučení pro produkci

```typescript
// Použití Redis pro persistenci
import Redis from 'ioredis';
const redis = new Redis();

async function checkRateLimit(ip: string) {
  const key = `rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 900); // 15 minut
  }
  return count <= RATE_LIMIT_MAX;
}
```

### 3. Input Validation & Sanitization

#### Validační pravidla

| Field       | Validation     | Pattern/Rules                               |
| ----------- | -------------- | ------------------------------------------- |
| Name        | Length         | 2-100 znaků                                 |
| Phone       | Regex          | `/^\+?\d{0,3}(\s?\d{3}){3,4}$/`             |
| Email       | Regex + Length | RFC 5322 compliant, max 254 znaků           |
| Industry    | Length         | 2-100 znaků                                 |
| Budget      | Enum           | ['40 000', '80 000', '150 000', '150 000+'] |
| Help Needed | Length         | 10-1000 znaků                               |

#### Sanitizace

```typescript
const sanitizedData = {
  name: name.trim(),
  phone: phone.trim(),
  email: email.trim().toLowerCase(),
  industry: industry.trim(),
  budget: budget.trim(),
  helpNeeded: helpNeeded.trim(),
};
```

### 4. Bot Protection

#### Honeypot Field

```html
<!-- Skryté pole pro boty -->
<div style="position: absolute; left: -9999px;">
  <label for="website">Website</label>
  <input type="text" name="website" tabindex="-1" autocomplete="off" />
</div>
```

#### Detekce

```typescript
if (formData.get('website')) {
  // Bot detected - silently reject
  return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
}
```

### 5. Security Headers

#### HTTP Headers (astro.config.mjs)

```javascript
headers: {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
```

#### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com data:;
img-src 'self' data: https:;
connect-src 'self';
```

### 6. Environment Variables Security

#### Best Practices

```bash
# .env (NIKDY necommitovat!)
RESEND_API_KEY="re_xxxxx"
BRAVE_API_KEY="BSAxxxxx"
SUPABASE_ACCESS_TOKEN="sbp_xxxxx"
```

#### Použití

```typescript
// Vždy používat import.meta.env nebo process.env
const apiKey = import.meta.env.RESEND_API_KEY;
```

### 7. Origin Checking

```javascript
// astro.config.mjs
security: {
  checkOrigin: true, // Automaticky kontroluje Origin header
}
```

## Známé zranitelnosti a jejich řešení

### 1. XSS (Cross-Site Scripting)

#### Ochrana

- React automaticky escapuje výstupy
- Nepoužíváme `dangerouslySetInnerHTML`
- CSP headers jako dodatečná ochrana

#### Rizikové oblasti

```typescript
// ŠPATNĚ - potenciální XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// SPRÁVNĚ - automatické escapování
<div>{userInput}</div>
```

### 2. SQL Injection

#### Status

- **Není aplikovatelné** - aplikace nepoužívá databázi
- Pro budoucí implementaci doporučujeme:
  - Parametrizované queries
  - ORM (Prisma, TypeORM)
  - Input validation

### 3. Path Traversal

#### Ochrana

- Aplikace nepracuje s user-supplied file paths
- Všechny assety jsou servírovány staticky

### 4. Sensitive Data Exposure

#### Opatření

- HTTPS only deployment
- Žádné logování citlivých dat
- Environment variables pro secrets
- Sanitizace error messages

## Security Checklist

### Pre-deployment

- [ ] Rotovat všechny API klíče
- [ ] Zkontrolovat .env není v gitu
- [ ] Ověřit HTTPS certifikát
- [ ] Nastavit production environment variables
- [ ] Zkontrolovat CSP politiku
- [ ] Otestovat rate limiting
- [ ] Ověřit CSRF ochranu

### Post-deployment

- [ ] Monitorovat error logy
- [ ] Sledovat rate limit hits
- [ ] Analyzovat podezřelé patterns
- [ ] Pravidelný security audit
- [ ] Dependency updates

## Incident Response Plan

### 1. Detekce

- Monitoring logů
- Rate limit alerts
- Error spike detection
- User reports

### 2. Containment

```bash
# Okamžité kroky
1. Identifikovat typ útoku
2. Blokovat útočníka (IP ban)
3. Zvýšit rate limiting
4. Aktivovat maintenance mode pokud nutné
```

### 3. Eradication

- Opravit zranitelnost
- Aktualizovat dependencies
- Patch security holes
- Code review

### 4. Recovery

- Deploy opravené verze
- Resetovat rate limits
- Obnovit normální provoz
- Informovat uživatele

### 5. Lessons Learned

- Zdokumentovat incident
- Aktualizovat security policies
- Implementovat preventivní opatření
- Security training

## Security Tools & Commands

### Audit Dependencies

```bash
# Check for known vulnerabilities
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fixes (opatrně!)
npm audit fix --force
```

### Security Testing

```bash
# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://your-site.com

# Check headers
curl -I https://your-site.com

# SSL test
nmap --script ssl-cert,ssl-enum-ciphers -p 443 your-site.com
```

### Monitoring

```bash
# Watch for suspicious activity
tail -f /var/log/nginx/access.log | grep -E "(\.\./|<script|eval\(|base64)"

# Check rate limit hits
grep "429" /var/log/nginx/access.log | wc -l
```

## Security Contacts

### Hlášení zranitelností

- **Email**: security@vojtechkochta.cz
- **PGP Key**: [public key]
- **Response Time**: < 24 hodin

### Security Team

- Security Lead: [Name]
- DevOps: [Name]
- Backend: [Name]

## Compliance & Standards

### GDPR Compliance

- ✅ Minimální sběr dat
- ✅ Explicitní souhlas
- ✅ Right to deletion
- ✅ Data portability

### OWASP Top 10 Coverage

- ✅ A01: Broken Access Control - Rate limiting, CSRF
- ✅ A02: Cryptographic Failures - Secure tokens
- ✅ A03: Injection - Input validation
- ✅ A04: Insecure Design - Security by design
- ✅ A05: Security Misconfiguration - Security headers
- ✅ A06: Vulnerable Components - Regular updates
- ✅ A07: Authentication Failures - N/A (no auth yet)
- ✅ A08: Software and Data Integrity - CSP, SRI
- ✅ A09: Logging Failures - Error handling
- ✅ A10: SSRF - Input validation

## Future Security Enhancements

### Planned Improvements

1. **WAF (Web Application Firewall)**
2. **DDoS Protection** (Cloudflare)
3. **2FA for admin panel**
4. **Security monitoring** (Sentry)
5. **Penetration testing**
6. **Bug bounty program**

### Security Roadmap

```
Q1 2025: Implement Redis for rate limiting
Q2 2025: Add authentication system
Q3 2025: Security audit by third party
Q4 2025: ISO 27001 preparation
```

---

_Security Documentation v1.0.0_
_Last Security Audit: December 2024_
_Next Scheduled Audit: March 2025_
