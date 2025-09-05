# Claude Code - References Components Technical Documentation

## Architecture

```
/components/references/
├── References.astro       # Main references section
├── BentoGrid.astro        # Portfolio grid layout
├── BentoCard.astro        # Project showcase card
├── ReasonCard.astro       # Reference testimonial card
└── docs/
    ├── README.md
    └── CLAUDE.md          # This file
```

## Implementation

### References.astro

- Main portfolio section with animated BlurText headings
- Integration with ReferenceBentoEffects for magic interactions
- Responsive container system with proper semantic markup

### BentoGrid.astro

- Advanced CSS Grid system for portfolio showcase
- Dynamic grid sizing based on content and screen size
- Hover state management and transition orchestration

### BentoCard.astro

- Individual project card with image, title, description
- Hover effects, scale transforms, opacity transitions
- Link integration for project detail pages

### ReasonCard.astro

- Client testimonial and reference card
- Quote formatting, client information display
- Integration with portfolio magic effects system

## Technical Features

- **Portfolio System**: Dynamic project showcase with filtering
- **Magic Effects**: ReferenceBentoEffects React component
- **Image Optimization**: WebP support, lazy loading
- **Responsive Grid**: CSS Grid with mobile-first breakpoints
- **Performance**: Progressive loading, client:only hydration

---

_Technical Documentation v1.0.0 - References Components_
