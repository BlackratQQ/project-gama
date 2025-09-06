# 🛠️ Technologický Stack - Project Delta

## Core Technologies

### 🚀 Astro (v5.13.2)

**Role**: Static Site Generator & Framework

**Proč Astro?**

- ⚡ Zero JavaScript by default
- 🏝️ Island architecture pro optimální performance
- 🔧 Framework agnostic (React, Vue, Svelte...)
- 📦 Automatické code splitting
- 🎯 Optimalizace pro Core Web Vitals

**Použití v projektu**:

- Generování statických stránek
- SSR pro dynamický obsah
- API routes
- Asset optimization

### ⚛️ React (v19.1.1)

**Role**: UI komponenty a interaktivita

**Implementace**:

- Interaktivní komponenty (navbar, formuláře, galerie)
- State management
- Event handling
- Animace s Motion

**Komponenty**:

```
35+ React komponent
├── UI Components (buttons, modals)
├── Animation Components (effects, transitions)
├── Layout Components (containers, grids)
└── Business Components (forms, galleries)
```

### 📘 TypeScript

**Role**: Type safety a developer experience

**Pokrytí**:

- ✅ Všechny React komponenty
- ✅ API routes
- ✅ Utility funkce
- ✅ Konfigurace

## Styling & Design

### 🎨 Tailwind CSS (v3.4.17)

**Role**: Utility-first CSS framework

**Konfigurace**:

```javascript
// tailwind.config.mjs
- Custom colors
- Extended animations
- Responsive breakpoints
- Dark mode support
```

**Výhody**:

- Rapid prototyping
- Konzistentní design system
- Automatické purging
- JIT compilation

### 📐 PostCSS

**Role**: CSS processing

**Plugins**:

- Autoprefixer
- CSS nesting
- Custom properties

## Animace & Efekty

### 🎬 Motion (Framer Motion) (v12.23.12)

**Role**: React animace

**Použití**:

- Text reveal efekty (BlurText)
- Fade in/out animace (FadeContent)
- Gesture handling
- Layout animations

**Příklad komponenty**:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### 🎭 GSAP (v3.13.0)

**Role**: Pokročilé animace

**Implementace**:

- ScrollTrigger animace
- Timeline sequencing
- Complex hover effects
- Morphing animations

**Komponenty**:

- MagicBento
- ServiceMagicEffects
- TestimonialMagicEffects

### 🎮 Three.js (v0.179.1)

**Role**: 3D grafika a WebGL

**Použití**:

- GridDistortion efekt
- 3D particle systems
- Shader animations
- Image distortion effects

**Performance**:

- GPU akcelerované
- Optimalizované shadery
- LOD (Level of Detail) systém

### 🌟 OGL (v1.0.11)

**Role**: Lightweight WebGL library

**Použití**:

- LightRays efekt
- Jednodušší 3D efekty
- Alternativa k Three.js pro menší komponenty

## Backend & Services

### 📧 Resend (v4.7.0)

**Role**: Email service

**Funkce**:

- Transactional emails
- React email templates
- Delivery tracking
- Error handling

**Implementace**:

```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'omega@vojtechkochta.cz',
  to: [email],
  subject: 'Subject',
  html: renderToString(<EmailTemplate {...data} />)
});
```

### 🔐 Node.js Crypto

**Role**: Security utilities

**Použití**:

- CSRF token generation
- Random string generation
- Hashing (budoucí použití)

## UI Libraries

### 🎯 React Icons (v5.5.0)

**Role**: Icon library

**Ikony**:

- FontAwesome
- Material Design
- Heroicons
- Custom SVG icons

### 🎠 Swiper (v11.2.10)

**Role**: Touch slider

**Použití**:

- Image carousels
- Testimonial sliders
- Portfolio galleries

**Features**:

- Touch/swipe support
- Responsive breakpoints
- Lazy loading
- Autoplay

### 🎨 Astro Icon (v1.1.5)

**Role**: Icon system pro Astro

**Výhody**:

- SVG optimization
- Sprite generation
- Type-safe icons

## Development Tools

### 🔍 ESLint (v9.34.0)

**Role**: Code linting

**Konfigurace**:

- TypeScript rules
- React rules
- Astro rules
- Prettier integration

### 💅 Prettier (v3.6.2)

**Role**: Code formatting

**Settings**:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### 🔧 TypeScript ESLint

**Role**: TypeScript linting

**Rules**:

- Strict type checking
- Unused variable detection
- Import sorting

## Package Management

### 📦 npm

**Role**: Package manager

**Scripts**:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "lint": "eslint . --ext .ts,.tsx,.astro",
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,astro,css,md}\""
}
```

## Browser Support

### Minimum Requirements

```
Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
```

### Progressive Enhancement

- Základní funkcionalita bez JS
- Plná funkcionalita s moderními prohlížeči
- Fallbacky pro starší prohlížeče

## Performance Metrics

### Bundle Sizes

```
Main Bundle: ~150KB (gzipped)
├── React: ~45KB
├── Three.js: ~50KB (lazy loaded)
├── GSAP: ~30KB (lazy loaded)
└── Other: ~25KB
```

### Loading Strategy

1. **Critical CSS**: Inline
2. **Fonts**: Preload
3. **Images**: Lazy load
4. **JavaScript**: Defer/Async
5. **3D Assets**: On-demand

## Dependencies Overview

### Production Dependencies (32 packages)

```
Core Framework:
- astro, react, react-dom
- @astrojs/node, @astrojs/react, @astrojs/tailwind

Animation:
- gsap, motion, three, ogl

UI/UX:
- tailwindcss, swiper, react-icons
- astro-icon, @iconify-json/fa6-solid

Backend:
- resend
```

### Dev Dependencies (13 packages)

```
Type Safety:
- typescript-eslint, @types/react, @types/react-dom

Linting & Formatting:
- eslint, prettier, eslint-plugin-astro
- eslint-plugin-jsx-a11y

Development:
- @eslint/js, eslint-config-prettier
```

## Version Management

### Update Strategy

- **Security patches**: Immediately
- **Minor updates**: Weekly
- **Major updates**: Monthly review

### Compatibility Matrix

| Package  | Version | Node | React | Astro |
| -------- | ------- | ---- | ----- | ----- |
| astro    | 5.13.2  | 18+  | 18+   | -     |
| react    | 19.1.1  | 18+  | -     | 4.0+  |
| tailwind | 3.4.17  | 14+  | -     | -     |
| three    | 0.179.1 | 14+  | 16+   | -     |

## Future Considerations

### Potential Additions

1. **State Management**: Zustand/Jotai
2. **Testing**: Vitest + Testing Library
3. **Database**: Supabase/Prisma
4. **CMS**: Strapi/Sanity
5. **Analytics**: Plausible/Umami

### Performance Optimizations

1. **Module Federation**: Pro micro-frontends
2. **Web Workers**: Pro heavy computations
3. **Service Worker**: Pro offline support
4. **Edge Functions**: Pro geo-distributed logic

---

_Tech Stack Documentation v1.0.0_
_Optimalizováno pro výkon a developer experience_
