# Claude Code - Technická dokumentace Project Delta

## Přehled systému

Project Delta je full-stack webová aplikace postavená na Astro frameworku s React komponentami pro interaktivní prvky.

## Technologický stack

### Core

- **Astro 5.13.2** - Static Site Generator s SSR podporou
- **React 19.1.1** - UI komponenty a interaktivita
- **TypeScript** - Type safety
- **Node.js** - Runtime environment

### Styling

- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Animace a efekty

- **Motion 12.23.12** - Framer Motion pro React animace
- **GSAP 3.13.0** - Komplexní animace
- **Three.js 0.179.1** - 3D grafika a WebGL
- **OGL 1.0.11** - Lightweight WebGL library

### Backend a API

- **Resend 4.7.0** - Email služba
- **Crypto (Node.js)** - CSRF token generování

### Vývojové nástroje

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - Type checking

## Architektura

### Struktura složek

```
src/
├── components/          # Všechny UI komponenty
│   ├── navbar/         # Navigační komponenty (Astro)
│   ├── react/          # React komponenty
│   │   ├── hero/       # Hero sekce komponenty
│   │   ├── navbar/     # React navbar komponenty
│   │   ├── portfolio/  # Portfolio galerie
│   │   ├── services/   # Service efekty
│   │   ├── shared/     # Sdílené utility komponenty
│   │   ├── techStack/  # Tech stack animace
│   │   └── testimonials/ # Testimonial efekty
│   ├── form/           # Formulářové komponenty
│   ├── hero/           # Hero sekce (Astro)
│   ├── services/       # Service karty
│   ├── reasons/        # Důvody sekce
│   ├── references/     # Reference sekce
│   ├── techStack/      # Tech stack sekce
│   └── sluzby/         # Služby stránky komponenty
├── pages/              # Astro stránky a API routes
│   ├── api/           # API endpoints
│   └── sluzby/        # Služby podstránky
├── layouts/           # Layout komponenty
├── styles/            # Globální styly
└── emails/            # Email šablony (React)
```

## Bezpečnost

### Implementovaná opatření

#### 1. CSRF Protection

```typescript
// Form.astro
import crypto from 'crypto';
const csrfToken = crypto.randomBytes(32).toString('hex');

// API validace v send.ts
if (csrfToken.length !== 64) {
  return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
}
```

#### 2. Rate Limiting

```typescript
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX = 3; // Max 3 požadavky
```

#### 3. Input Validation

- Striktní validace všech formulářových polí
- Regex patterns pro email a telefon
- Length constraints
- Honeypot field pro boty

#### 4. Security Headers

```javascript
// astro.config.mjs
headers: {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': '...'
}
```

## Klíčové komponenty

### Astro komponenty

#### Navbar.astro

- **Účel**: Hlavní navigační lišta
- **Props**: žádné
- **Children**: Logo, Menu, NavbarContainer (React)
- **Styling**: Tailwind classes + custom CSS

#### Form.astro

- **Účel**: Zabezpečený kontaktní formulář
- **Security**: CSRF token, honeypot, validace
- **State**: Client-side React hooks
- **API**: POST /api/send

### React komponenty

#### BlurText.tsx

```typescript
interface BlurTextProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  animateOn?: 'load' | 'view';
}
```

#### GridDistortion.tsx

- **Účel**: WebGL distortion efekt pro obrázky
- **Dependencies**: Three.js
- **Performance**: GPU accelerated
- **Props**: imageSrc, loadingDuration, loadingStrength

#### NavbarContainer.tsx

- **Účel**: Wrapper pro React navbar komponenty
- **State**: Menu open/close, scroll position
- **Children**: MobileMenu, SplitModal, NavbarScrollEffects

## API Endpoints

### POST /api/send

- **Účel**: Zpracování kontaktního formuláře
- **Rate limit**: 3 req/15 min per IP
- **Validace**:
  - CSRF token
  - Input sanitization
  - Field validation
- **Response**: JSON s message nebo error
- **Email**: Odesílá 2 emaily (admin + potvrzení)

## State Management

### Patterns

1. **Astro Islands**: Izolované React komponenty
2. **Local State**: useState pro komponenty
3. **Props Drilling**: Pro jednoduchou komunikaci
4. **Event Handlers**: Pro interakci mezi komponentami

### Příklad

```typescript
// NavbarContainer.tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isSplitOpen, setIsSplitOpen] = useState(false);

// Předání do child komponent
<MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
```

## Performance optimizace

### 1. Code Splitting

- `client:idle` - Načte se při idle
- `client:only="react"` - Pouze na klientu
- `client:load` - Načte se ihned

### 2. Image Optimization

- WebP formát
- Lazy loading
- Responsive sizes

### 3. CSS Optimization

- Tailwind purge
- Critical CSS inline
- Minimal custom CSS

### 4. Bundle Optimization

- Tree shaking
- Minification
- Compression

## Animační systém

### Motion (Framer Motion)

- **BlurText**: Text reveal animace
- **FadeContent**: Fade in/out efekty
- **DecryptedText**: Text scramble efekt

### GSAP

- **MagicBento**: Komplexní grid animace
- **ServiceMagicEffects**: Hover efekty
- **Timeline**: Scroll-triggered animace

### Three.js/WebGL

- **GridDistortion**: Image distortion
- **LightRays**: 3D světelné paprsky
- **Threads**: Particle system

## Deployment

### Environment Variables

```env
RESEND_API_KEY=            # Email service
BRAVE_API_KEY=             # Search API (MCP)
SUPABASE_ACCESS_TOKEN=     # Database (MCP)
```

### Build Process

```bash
npm run build   # Produkční build
npm run preview # Preview produkce
```

### Hosting Requirements

- Node.js 18+
- 512MB RAM minimum
- SSL certifikát

## Testing

### Linting

```bash
npm run lint      # ESLint check
npm run lint:fix  # Auto fix
```

### Type Checking

```bash
npx tsc --noEmit  # TypeScript check
```

### Formatting

```bash
npm run format       # Prettier format
npm run format:check # Check formatting
```

## Známé problémy a omezení

1. **WebGL Performance**: Na slabších zařízeních mohou být 3D efekty pomalé
2. **Safari Compatibility**: Některé CSS animace vyžadují vendor prefixy
3. **Rate Limiting**: In-memory storage se resetuje při restartu
4. **CSRF Tokens**: Nejsou persistentní mezi sessions

## Debugging

### Užitečné příkazy

```bash
# Zobrazit všechny routes
npm run astro -- --help

# Debug mode
DEBUG=* npm run dev

# Analyzovat bundle
npm run build -- --analyze
```

### Časté chyby

1. **"Cannot find module"** - Spusťte `npm install`
2. **"CSRF token invalid"** - Obnovte stránku pro nový token
3. **"Rate limit exceeded"** - Počkejte 15 minut

## Rozšiřitelnost

### Přidání nové komponenty

1. Vytvořte soubor v příslušné složce
2. Implementujte TypeScript interface
3. Přidejte dokumentaci
4. Otestujte lint a TypeScript

### Přidání nové stránky

1. Vytvořte `.astro` soubor v `src/pages/`
2. Použijte Layout komponentu
3. Přidejte do navigace
4. Implementujte SEO meta tagy

## Maintenance

### Pravidelné úkoly

- Rotace API klíčů (měsíčně)
- Aktualizace dependencies (týdně)
- Security audit (měsíčně)
- Performance monitoring

### Monitoring

- Sledovat error logy
- Kontrolovat rate limit hits
- Analyzovat formulářové submits
- Měřit Core Web Vitals

---

_Technická dokumentace v1.0.0_
_Pro Claude Code a vývojáře_
