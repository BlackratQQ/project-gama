# Claude Code - Reasons Components Technical Documentation

## Architecture

```
/components/reasons/
├── Reasons.astro          # Main container with heading
├── BentoGrid.astro        # Grid layout system
├── BentoCard.astro        # Generic bento card
├── ReasonCard.astro       # Specialized reason card
└── docs/
    ├── README.md
    └── CLAUDE.md          # This file
```

## Implementation

### Reasons.astro

- Main section container with animated BlurText heading
- Integrates ReasonBentoEffects for interactive magic effects
- Responsive layout with container and padding system

### BentoGrid.astro

- CSS Grid implementation for bento layout
- Responsive breakpoints: 1 column mobile, 2-3 columns desktop
- Integration with magic effects via CSS classes

### BentoCard.astro

- Generic reusable bento card with hover effects
- Supports icons, titles, descriptions
- Border radius, backdrop blur, shadow system

### ReasonCard.astro

- Specialized card for reason-specific content
- Extended styling and animation support
- Integration with ReasonBentoEffects React component

## Technical Features

- **Magic Effects**: Particle systems, spotlight, border glow
- **Animations**: FadeContent, BlurText, hover transitions
- **Responsive**: Mobile-first CSS Grid system
- **Performance**: client:only hydration for React effects
- **A11y**: Semantic HTML, ARIA labels, keyboard navigation

---

_Technical Documentation v1.0.0 - Reasons Components_
