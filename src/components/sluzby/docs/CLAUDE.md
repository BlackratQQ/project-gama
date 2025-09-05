# Claude Code - Sluzby Components Technical Documentation

## Architecture

```
/components/sluzby/
├── automatizace-procesu/
│   ├── Hero.astro         # Automation hero section
│   ├── HowItWorks.astro   # Automation process explanation
│   └── Services.astro     # Automation services showcase
├── vyvoj-funkcniho-webu/
│   ├── Hero.astro         # Web development hero section
│   ├── HowItWorks.astro   # Web development process
│   └── Services.astro     # Web development services
├── cenik/
│   ├── hero.astro         # Pricing hero section
│   ├── price-list.astro   # Service pricing table
│   ├── how-works.astro    # Collaboration process
│   ├── code-to-sport.astro    # Code to sport section
│   └── school-to-code.astro   # School to code section
└── docs/
    ├── README.md
    └── CLAUDE.md          # This file
```

## Implementation

### Service-specific Hero Sections

Each service has specialized hero component:

- Custom animated headings with BlurText
- Service-specific background gradients
- Targeted call-to-action buttons
- SEO-optimized content structure

### HowItWorks Components

Process explanation sections:

- Step-by-step methodology breakdown
- Timeline visualization
- Interactive elements for user engagement
- Responsive design for mobile readability

### Services Components

Service showcase with:

- Bento grid layouts for service categories
- Magic effects integration
- Hover states and animations
- Link integration to contact forms

### Pricing Components

Advanced pricing tables:

- Interactive price cards
- Feature comparison matrices
- Dynamic pricing calculations
- CTA button integration

## Technical Features

- **Service-specific SEO**: Each service has optimized meta data
- **Specialized Animations**: Tailored animation timing per service
- **Magic Effects**: AutomatizaceServicesBentoEffects, PriceListBentoEffects
- **Responsive Tables**: Mobile-optimized pricing tables
- **Performance**: Lazy loading, optimized images

## Integration Points

- Links to main contact form
- Integration with portfolio/references
- Connection to main services overview
- SEO breadcrumb navigation

---

_Technical Documentation v1.0.0 - Sluzby Components_
