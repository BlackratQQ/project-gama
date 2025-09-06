# Claude Code - Form Components Technical Documentation

## Component Architecture

### File Structure

```
/components/form/
├── Contact.astro               # Main contact section wrapper
├── Form.astro                  # Contact form implementation
└── docs/
    ├── README.md              # User documentation
    └── CLAUDE.md              # This file
```

### Dependencies

```typescript
// External dependencies
import crypto from 'crypto'; // CSRF token generation
import BlurText from '../react/shared/BlurText.tsx';
import FadeContent from '../react/shared/FadeContent.tsx';
import Button from '../Button.astro';

// API integration
// - /api/send endpoint (Astro API route)
// - Resend API for email delivery
```

## Contact.astro

### Purpose

Main contact section providing layout, headings, and form container with gradient background.

### Implementation

```astro
---
import Form from './Form.astro';
import BlurText from '../react/shared/BlurText.tsx';
---

<div id="kontaktni-formular" class="bg-gradient">
  <div class="container mx-auto flex min-h-screen flex-col items-center justify-center px-3">
    <!-- Animated headings with BlurText -->
    <div class="mb-6">
      <h3 class="mb-8 text-center text-5xl font-bold text-white md:text-8xl xl:text-9xl">
        <noscript>OZVĚTE SE MI</noscript>
        <BlurText
          text="OZVĚTE SE MI"
          delay={300}
          initialDelay={0}
          animateBy="words"
          direction="top"
          animateOn="view"
          client:only="react"
        />
      </h3>

      <!-- Contact information with segmented BlurText animations -->
      <div class="text-center">
        <!-- Multiple BlurText components with staggered delays for smooth text reveal -->
      </div>
    </div>

    <!-- Form container -->
    <div class="container max-w-xl rounded-md shadow-lg">
      <Form />
    </div>
  </div>
</div>
```

### CSS Variables Configuration

```css
#kontaktni-formular {
  /* Gradient activation flags */
  --g1-active: 1;
  --g2-active: 1;
  --g3-active: 1;
  --g4-active: 0;
  --linear-active: 0;

  /* Radial gradient positioning and colors */
  --g1-x: 14%;
  --g1-y: 42%;
  --g1-color: #002853;
  --g1-size: 1%;
  --g1-fade: min(7%, 185px);

  --g2-x: 70%;
  --g2-y: 30%;
  --g2-color: #2b0053;
  --g2-size: 0%;
  --g2-fade: min(10%, 220px);

  --g3-x: 88%;
  --g3-y: 77%;
  --g3-color: #002853;
  --g3-size: 0%;
  --g3-fade: min(9%, 110px);
}
```

### Animation Timing Strategy

```typescript
// Staggered BlurText delays for smooth text reveal
const ANIMATION_TIMINGS = {
  mainHeading: { delay: 300, initialDelay: 0 },
  subHeading: { delay: 150, initialDelay: 400 },
  contactInfo: {
    part1: { delay: 100, initialDelay: 800 }, // "Pošlete mi zprávu..."
    email: { delay: 100, initialDelay: 1000 }, // "info@vojtechkochta.cz"
    part2: { delay: 100, initialDelay: 1200 }, // "nebo zavolejte..."
    phone: { delay: 100, initialDelay: 1400 }, // "+420 774 960 708"
    part3: { delay: 100, initialDelay: 1600 }, // "Obratem vás kontaktuji..."
  },
};
```

## Form.astro

### Purpose

Comprehensive contact form with security measures, validation, and animated form fields.

### Security Implementation

#### CSRF Token Generation

```typescript
import crypto from 'crypto';

// Generate cryptographically secure 64-character hex token
const csrfToken = crypto.randomBytes(32).toString('hex');
```

#### Honeypot Bot Protection

```html
<!-- Hidden field for bot detection -->
<div style="position: absolute; left: -9999px;">
  <label for="website">Website</label>
  <input type="text" name="website" id="website" tabindex="-1" autocomplete="off" />
</div>
```

### Form Field Structure

#### Field Implementation Pattern

```astro
<FadeContent
  blur={false}
  duration={800}
  delay={2200}
  direction="top"
  className="mb-8"
  client:only="react"
>
  <div>
    <label for="name" class="mb-1 block text-sm font-medium text-white">Celé jméno</label>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Jan Novák"
      aria-label="Celé jméno"
      aria-required="true"
      autocomplete="name"
      class="block w-full rounded-md border-transparent bg-white p-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
    <p id="name-error" class="mt-1 text-sm text-red-400 hidden"></p>
  </div>
</FadeContent>
```

#### Budget Selection System

```astro
---
const budgetOptions = ['40 000', '80 000', '150 000', '150 000+'];
---

<div class="grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-labelledby="budget-label">
  {
    budgetOptions.map((option) => (
      <div data-budget={option} class="budget-btn-container">
        <Button
          text={option}
          variant="ghost"
          class="budget-btn w-full"
          onClick={`selectBudget('${option}')`}
        />
      </div>
    ))
  }
</div>
<input type="hidden" id="budget" name="budget" required />
```

### JavaScript Implementation

#### Global Function Registration

```typescript
// TypeScript interface extension for window object
declare global {
  interface Window {
    selectBudget?: (budget: string) => void;
    submitForm?: () => Promise<void>;
  }
}

// Budget selection handler
(window as Window & { selectBudget?: (budget: string) => void }).selectBudget = function (
  budget: string
) {
  // Remove active class from all containers
  budgetContainers.forEach((container) => {
    const ghostContainer = container.querySelector('.ghost-button-container');
    if (ghostContainer) {
      ghostContainer.classList.remove('active');
    }
  });

  // Add active class to selected container
  const clickedContainer = Array.from(budgetContainers).find(
    (container) => container.getAttribute('data-budget') === budget
  );
  if (clickedContainer) {
    const ghostContainer = clickedContainer.querySelector('.ghost-button-container');
    if (ghostContainer) {
      ghostContainer.classList.add('active');
    }
  }

  budgetInput.value = budget;
  clearError('budget');
};
```

#### Form Validation System

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function validateForm(formData: FormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Field extraction
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const industry = formData.get('industry') as string;
  const budget = formData.get('budget') as string;
  const helpNeeded = formData.get('helpNeeded') as string;

  // Validation rules with regex patterns
  if (!name?.trim()) {
    errors.name = 'Jméno je povinné.';
  }

  if (!phone?.trim()) {
    errors.phone = 'Telefonní číslo je povinné.';
  } else {
    const phoneRegex = /^\+?\d{0,3}(\s?\d{3}){3,4}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = 'Neplatný formát telefonního čísla.';
    }
  }

  if (!email?.trim()) {
    errors.email = 'Email je povinný.';
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Neplatný formát emailu.';
    }
  }

  if (!industry?.trim()) {
    errors.industry = 'Odvětví je povinné.';
  }

  if (!budget) {
    errors.budget = 'Prosím, vyberte rozpočet.';
  }

  if (!helpNeeded?.trim()) {
    errors.helpNeeded = 'Popis je povinný.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

#### Error Handling System

```typescript
// Clear error function
function clearError(fieldName: string) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName) as HTMLInputElement;

  if (errorElement) {
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
  }

  if (inputElement) {
    inputElement.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
  }
}

// Show error function with visual feedback
function showError(fieldName: string, message: string) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName) as HTMLInputElement;

  if (errorElement) {
    errorElement.classList.remove('hidden');
    errorElement.textContent = message;
  }

  if (inputElement) {
    inputElement.classList.add('border-red-500', 'ring-1', 'ring-red-500');
  }
}

// Real-time error clearing on input
if (form) {
  form.addEventListener('input', function (e) {
    const target = e.target as HTMLInputElement;
    if (target.name) {
      clearError(target.name);
    }
    hideMessages();
  });
}
```

#### Loading State Management

```typescript
function setLoading(loading: boolean) {
  if (loading) {
    // Hide submit button, show loading spinner
    if (submitBtnContainer) {
      submitBtnContainer.style.display = 'none';
    }
    if (loadingState) {
      loadingState.classList.remove('hidden');
    }
  } else {
    // Restore submit button, hide loading spinner
    if (submitBtnContainer) {
      submitBtnContainer.style.display = 'block';
    }
    if (loadingState) {
      loadingState.classList.add('hidden');
    }
  }
}
```

#### Form Submission Handler

```typescript
async function handleSubmit() {
  hideMessages();

  if (!form) return;
  const formData = new FormData(form as HTMLFormElement);
  const validation = validateForm(formData);

  // Clear all previous errors
  ['name', 'phone', 'email', 'industry', 'budget', 'helpNeeded'].forEach(clearError);

  if (!validation.isValid) {
    // Display validation errors
    Object.entries(validation.errors).forEach(([field, message]) => {
      showError(field, message);
    });
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        industry: formData.get('industry'),
        budget: formData.get('budget'),
        helpNeeded: formData.get('helpNeeded'),
        csrfToken: formData.get('csrf_token'),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle server errors
      if (errorMessage) {
        errorMessage.textContent = result.error || 'Neznámá chyba serveru.';
        errorMessage.classList.remove('hidden');
      }
    } else {
      // Handle success
      if (successMessage) {
        successMessage.classList.remove('hidden');
      }

      // Reset form state
      if (form) {
        (form as HTMLFormElement).reset();
      }
      budgetInput.value = '';

      // Reset budget button states
      budgetContainers.forEach((container) => {
        const ghostContainer = container.querySelector('.ghost-button-container');
        if (ghostContainer) {
          ghostContainer.classList.remove('active');
        }
      });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    if (errorMessage) {
      errorMessage.textContent = 'Chyba připojení k serveru.';
      errorMessage.classList.remove('hidden');
    }
  } finally {
    setLoading(false);
  }
}
```

### Animation Timing Configuration

#### Staggered FadeContent Delays

```typescript
const FORM_ANIMATION_DELAYS = {
  title: 1800, // "Osobní informace"
  name: 2200, // Name field
  phone: 2400, // Phone field
  email: 2600, // Email field
  industry: 2800, // Industry field
  budget: 3000, // Budget selection
  helpNeeded: 3200, // Help needed textarea
  submit: 3400, // Submit button
};

// Each field uses FadeContent with:
// - blur: false (no blur effect)
// - duration: 800ms
// - direction: "top"
// - client:only="react"
```

### CSS Styling System

#### Budget Button Styling

```css
/* Local styles for budget buttons - smaller font */
.budget-btn-container :global(.ghost-button-container span) {
  font-size: 14px !important;
}

.budget-btn-container :global(.ghost-button-container button) {
  font-size: 14px !important;
}
```

#### Loading Spinner Implementation

```html
<!-- Animated loading spinner with SVG -->
<div id="loading-state" class="hidden mt-4">
  <div class="inline-flex items-center text-white">
    <svg
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Odesílání...
  </div>
</div>
```

## API Integration

### Request Payload Structure

```typescript
interface ContactFormPayload {
  name: string;
  phone: string;
  email: string;
  industry: string;
  budget: string;
  helpNeeded: string;
  csrfToken: string;
}
```

### Server-side Processing (referenced)

```typescript
// API endpoint: /api/send
// Expected flow:
// 1. CSRF token validation (64-character hex string)
// 2. Rate limiting check (3 requests per 15 minutes per IP)
// 3. Input sanitization and validation
// 4. Email composition and sending via Resend API
// 5. Response with success/error status
```

## Testing Considerations

### Unit Tests

```typescript
describe('Form Validation', () => {
  test('validates required fields', () => {
    const formData = new FormData();
    const result = validateForm(formData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('phone');
  });

  test('validates phone format', () => {
    const formData = new FormData();
    formData.set('phone', 'invalid-phone');

    const result = validateForm(formData);
    expect(result.errors.phone).toBe('Neplatný formát telefonního čísla.');
  });

  test('validates email format', () => {
    const formData = new FormData();
    formData.set('email', 'invalid-email');

    const result = validateForm(formData);
    expect(result.errors.email).toBe('Neplatný formát emailu.');
  });
});
```

### Integration Tests

```typescript
describe('Form Submission', () => {
  test('submits form with valid data', async () => {
    // Mock fetch API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const form = document.createElement('form');
    form.id = 'contact-form';

    // Add form fields with valid data
    // Simulate form submission
    // Assert success state
  });

  test('handles server errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

    // Simulate form submission
    // Assert error handling
  });
});
```

### E2E Tests

```typescript
// Playwright/Cypress tests
test('complete form submission flow', async ({ page }) => {
  await page.goto('/');
  await page.scrollTo('#kontaktni-formular');

  // Fill form fields
  await page.fill('#name', 'John Doe');
  await page.fill('#phone', '+420123456789');
  await page.fill('#email', 'john@example.com');
  await page.fill('#industry', 'Tech');
  await page.click('[data-budget="40 000"]');
  await page.fill('#helpNeeded', 'Need help with website');

  // Submit form
  await page.click('.submit-btn');

  // Wait for success message
  await page.waitForSelector('#success-message:not(.hidden)');

  // Assert form reset
  expect(await page.inputValue('#name')).toBe('');
});
```

## Security Considerations

### CSRF Protection Details

```typescript
// Token generation (server-side)
const csrfToken = crypto.randomBytes(32).toString('hex');

// Token validation (API endpoint)
const isValidToken = (token: string): boolean => {
  return typeof token === 'string' && token.length === 64 && /^[0-9a-f]{64}$/.test(token);
};
```

### Input Sanitization

```typescript
// Server-side sanitization (referenced)
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};
```

### Rate Limiting Implementation

```typescript
// Rate limiting logic (server-side reference)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3;

  const existing = rateLimitMap.get(ip);
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count++;
  return true;
};
```

## Error Handling Patterns

### Network Error Handling

```typescript
try {
  const response = await fetch('/api/send', requestConfig);
  // Handle response
} catch (error) {
  console.error('Network error:', error);
  showError('general', 'Chyba připojení k serveru.');
}
```

### Validation Error Display

```typescript
// Clear previous errors first
Object.keys(validation.errors).forEach(clearError);

// Show new validation errors
Object.entries(validation.errors).forEach(([field, message]) => {
  showError(field, message);
});
```

### Graceful Degradation

```html
<!-- No-JS fallback content -->
<noscript>
  <p>
    Pro odesílání formuláře je vyžadován JavaScript. Kontaktujte nás přímo na
    <a href="mailto:info@vojtechkochta.cz">info@vojtechkochta.cz</a>
  </p>
</noscript>
```

## Performance Optimizations

### Animation Performance

- **CSS transforms**: Use transform instead of position changes
- **will-change**: Applied to animated elements
- **GPU acceleration**: translate3d for hardware acceleration

### Form Optimization

- **Debounced validation**: Avoid excessive validation calls
- **Efficient DOM queries**: Cache element references
- **Memory cleanup**: Remove event listeners on component unmount

### Network Optimization

- **Request payload size**: Minimal JSON payload
- **Error response caching**: Avoid redundant error requests
- **Progressive enhancement**: Form works without JavaScript

---

_Technical Documentation v1.0.0_  
_Form Components - Comprehensive technical reference for Claude Code_
