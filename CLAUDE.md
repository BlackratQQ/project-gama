# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Standart Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. After each edit, npm run lint, npx tsc --noEmit and fix the errors. Run these commands in a loop until both are error-free.

9. More info about [Astro Rules](docs/astrorules) and [About Project](docs/about-project)

10. Komunikuj česky

11. Whenever we add a new directory or component, include an updated project tree and a one-line description for each component.

postupně v rámci toho, jak budeme předělávat jednotlivé bloky komponent.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting a typová kontrola - VŽDY spusť po každé editaci
npm run lint
npx tsc --noEmit

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Architecture Overview

Project Delta je moderní webová aplikace postavená na Astro frameworku s React komponentami pro interaktivní prvky.

### Tech Stack

- **Astro 5.13** - Hlavní framework, SSR/SSG
- **React 19** - Interaktivní komponenty
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Motion/GSAP/Three.js** - Animace a 3D efekty
- **Resend** - Email služba

### Struktura projektu

```
src/
├── components/       # UI komponenty
│   ├── react/       # React komponenty (interaktivní)
│   └── [ostatní]/   # Astro komponenty (statické)
├── pages/           # Stránky a API routes
│   ├── api/        # Backend endpoints
│   └── sluzby/     # Podstránky služeb
├── layouts/         # Layout šablony
└── styles/          # Globální styly
```

## Workflow pravidla

1. **Plánování**: Používej TodoWrite tool pro sledování úkolů
2. **Jednoduchost**: Každá změna by měla být co nejmenší a nejjednodušší
3. **Testování**: Po každé editaci spusť `npm run lint` a `npx tsc --noEmit`
4. **Komunikace**: Komunikuj česky
5. **Komponenty**: Při přidání nové komponenty aktualizuj projektový strom

## Důležité konvence

### Astro komponenty

- Statické komponenty používají `.astro` příponu
- Pro interaktivitu použij `client:*` direktivy:
  - `client:load` - načte se ihned
  - `client:idle` - načte se při idle
  - `client:only="react"` - pouze na klientu

### React komponenty

- Umístěny v `src/components/react/`
- TypeScript interfaces pro props
- Používají Motion/Framer Motion pro animace

### Styling

- Primárně Tailwind CSS utility classes
- Minimální custom CSS
- Hover efekty: vždy přidej `hover:cursor-pointer` na klikatelné prvky

### Bezpečnost

- CSRF tokeny pro formuláře
- Rate limiting na API
- Input validace a sanitizace
- Security headers v `astro.config.mjs`

## API Endpoints

### POST /api/send

- Zpracování kontaktního formuláře
- Rate limit: 3 požadavky/15 min/IP
- Vyžaduje CSRF token
- Odesílá 2 emaily (admin + potvrzení)

## MCP Servery

Projekt využívá MCP servery nakonfigurované v `.mcp.json`:

- **brave-search** - Web search
- **sequential-thinking** - Strukturované plánování
- **supabase** - Databáze
- **react-bits-mcp** - React komponenty

## Známé problémy

1. **ESLint**: Některé Astro soubory jsou dočasně ignorovány (viz `eslint.config.js`)
2. **WebGL Performance**: 3D efekty mohou být pomalé na slabších zařízeních
3. **CSRF Tokens**: Nejsou persistentní mezi sessions
4. **Rate Limiting**: In-memory storage, resetuje se při restartu

## Důležité poznámky

- NIKDY nevytvářej soubory, pokud to není nezbytné
- VŽDY preferuj editaci existujících souborů
- NEPOUŽÍVEJ emojis, pokud to uživatel explicitně nepožaduje
- NEPŘIDÁVEJ komentáře do kódu, pokud to není vyžádáno
- Dokumentace v `/docs/astrorules/` obsahuje detailní coding guidelines
