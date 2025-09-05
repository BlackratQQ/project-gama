# Claude Code - TechStack Components Technical Documentation

## Architecture

```
/components/techStack/
├── TechStack.astro        # Main tech stack section with gradient background
├── About.astro            # Animated technology description text
└── docs/
    ├── README.md
    └── CLAUDE.md          # This file

/components/react/techStack/
└── LogoLoop.tsx           # Infinite scrolling tech logos with WebGL effects

/components/react/shared/
├── BlurText.tsx           # Advanced blur animation component for headings
├── FadeContent.tsx        # Fade-in animation component for content blocks
├── ElementorIcon.tsx      # Custom SVG icon for Elementor Builder
└── Threads.tsx            # WebGL background effects using OGL
```

## Implementation

### TechStack.astro

- Container for technology showcase section
- Integration with LogoLoop React component from /react/techStack/
- Animated headings using BlurText
- Responsive layout system

### About.astro

- Detailed information about technology choices
- Philosophy and approach to technology selection
- Integration with broader site design system

## React Integration

### LogoLoop Component

Located in `/react/techStack/LogoLoop.tsx`:

```typescript
interface LogoLoopProps {
  logos: LogoItem[]; // Array of technology logos
  speed?: number; // Animation speed (120 px/s default)
  direction?: 'left' | 'right'; // Scroll direction
  pauseOnHover?: boolean; // Pause on mouse hover
  scaleOnHover?: boolean; // Scale effect on hover
}
```

**Features:**

- Infinite horizontal scrolling
- Smooth velocity transitions
- ResizeObserver for responsive behavior
- Copy management for seamless looping
- Performance optimizations (requestAnimationFrame)

### Technology Logos

Pre-configured logos include:

- **AI Tools**: OpenAI, Claude AI
- **Frameworks**: React, Next.js, Astro
- **Languages**: JavaScript, PHP
- **Styling**: Tailwind CSS, CSS3, HTML5
- **CMS & Design**: WordPress, Elementor Builder, Figma

## Technical Features

- **Infinite Scroll**: Seamless logo carousel using requestAnimationFrame
- **3D Background**: Threads component for visual depth
- **Performance**: Copy management, throttled animations
- **Responsive**: Mobile-first design with breakpoint optimization
- **Accessibility**: ARIA labels, keyboard navigation support

---

_Technical Documentation v1.0.0 - TechStack Components_
