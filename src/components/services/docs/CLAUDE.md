# Claude Code - Services Components Technical Documentation

## Component Architecture

### File Structure
```
/components/services/
├── Services.astro                 # Main services section
├── ServiceBentoGrid.astro         # Grid layout for cards
├── ServiceBentoCard.astro         # Individual service card
└── docs/
    ├── README.md                  # User documentation
    └── CLAUDE.md                  # This file
```

### Dependencies
```typescript
import ServiceMagicEffects from '../react/services/ServiceMagicEffects';
import BlurText from '../react/shared/BlurText.tsx';
import FadeContent from '../react/shared/FadeContent.tsx';
```

## Services.astro

### Purpose
Main services section container with animated heading and magic effects integration.

### Implementation
```astro
---
import ServiceBentoGrid from './ServiceBentoGrid.astro';
import ServiceMagicEffects from '../react/services/ServiceMagicEffects';
import BlurText from '../react/shared/BlurText.tsx';

interface Props {
  showLinearGradient?: boolean;
}

const { showLinearGradient = true } = Astro.props;
---

<div class="bg-gradient h-auto w-full py-12 text-white" data-show-linear={showLinearGradient}>
  <section class="container mx-auto mt-24 flex py-24 flex-col px-3 md:mt-0">
    <div class="flex w-full flex-col">
      <div class="mb-12 flex w-full">
        <div class="w-full xl:w-2/3">
          <h3 class="mb-8 text-center text-5xl font-bold text-white md:text-left md:text-8xl xl:text-9xl">
            <noscript>KÓDOVÁNÍ BEZ KOMPROMISŮ:</noscript>
            <div class="blur-text-wrapper">
              <BlurText
                text="KÓDOVÁNÍ BEZ"
                delay={100}
                initialDelay={0}
                animateBy="words"
                direction="top"
                animateOn="view"
                className="block"
                client:only="react"
              />
              <BlurText
                text="KOMPROMISŮ:"
                delay={100}
                initialDelay={800}
                animateBy="words"
                direction="top"
                animateOn="view"
                className="block strikethrough-lower"
                client:only="react"
              />
            </div>
          </h3>
        </div>
      </div>

      <ServiceBentoGrid />
    </div>
  </section>

  <!-- Magic Effects -->
  <ServiceMagicEffects client:only="react" />
</div>
```

### CSS Custom Properties
```css
.bg-gradient[data-show-linear="true"] {
  --linear-active: 1;
}

.bg-gradient[data-show-linear="false"] {
  --linear-active: 0;
}
```

## ServiceBentoGrid.astro

### Purpose
Grid layout component for service cards with responsive design and animations.

### Data Structure
```typescript
const serviceData = [
  {
    icon: 'fa-solid fa-laptop-code',
    title: 'Návrh & vývoj webu',
    description: 'Vytvořím přehledný web, který vás prezentuje a prodává vaše služby a produkt...',
    href: '/moje-sluzby/vyvoj-funkcniho-webu',
  },
  {
    icon: 'fa-solid fa-gears',
    title: 'Automatizace firemních procesů', 
    description: 'Převedu vaše manuální procesy do digitální podoby...',
    href: '/moje-sluzby/automatizace-procesu',
  }
];
```

### Implementation
```astro
<section class="service-bento-section" aria-label="Nabízené služby">
  <div class="flex justify-center">
    <div class="service-bento-grid" id="service-bento-grid" role="list">
      {serviceData.map((service, index) => (
        <div role="listitem" class="flex items-center justify-center">
          <FadeContent
            blur={true}
            duration={800}
            delay={1200 + index * 200}
            direction="top"
            className="w-full max-w-md"
            client:only="react"
          >
            <ServiceBentoCard {...service} />
          </FadeContent>
        </div>
      ))}
    </div>
  </div>
</section>
```

### CSS Grid System
```css
.service-bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

@media (min-width: 1024px) {
  .service-bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## ServiceBentoCard.astro

### Purpose
Individual service card component with icon, content, and hover effects.

### Props Interface
```typescript
interface ServiceCardProps {
  icon: string;                     // FontAwesome icon class
  title: string;                    // Card title
  description: string;              // Card description
  href: string;                     // Link URL
}
```

### Implementation
```astro
---
interface Props {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const { icon, title, description, href } = Astro.props;
---

<div class="service-bento-card group relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-black/30">
  <a href={href} class="block h-full w-full">
    <div class="flex h-full flex-col">
      <!-- Icon -->
      <div class="mb-6 text-4xl text-orange-500">
        <i class={icon}></i>
      </div>
      
      <!-- Title -->
      <h4 class="mb-4 text-xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300">
        {title}
      </h4>
      
      <!-- Description -->
      <p class="text-gray-300 leading-relaxed">
        {description}
      </p>
      
      <!-- Hover indicator -->
      <div class="mt-auto pt-6">
        <span class="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Zjistit více →
        </span>
      </div>
    </div>
  </a>
</div>
```

### Card Styling System
```css
.service-bento-card {
  /* Base styling */
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  
  /* Transitions */
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-bento-card:hover {
  transform: scale(1.05);
  background: rgba(0, 0, 0, 0.3);
}

/* Magic effects integration */
.service-bento-card.service-card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
      rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%,
      rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 30%,
      transparent 60%);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: subtract;
  pointer-events: none;
  z-index: 1;
}
```

## ServiceMagicEffects Integration

### Effect Configuration
```typescript
interface ServiceMagicEffectsProps {
  enableStars?: boolean;             // Particle effects
  enableSpotlight?: boolean;         // Global spotlight
  enableBorderGlow?: boolean;        // Card border glow
  enableTilt?: boolean;              // 3D tilt effect
  enableMagnetism?: boolean;         // Magnetic mouse following
  clickEffect?: boolean;             // Click ripple effect
  spotlightRadius?: number;          // Spotlight size (default: 300)
  particleCount?: number;            // Number of particles (default: 12)
  glowColor?: string;                // RGB color values
}
```

### CSS Variables System
```css
.service-bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --glow-color: 132, 0, 255;        // Purple RGB values
}
```

### Performance Optimizations
```typescript
// Mobile detection and performance adjustments
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Disable heavy effects on mobile
const shouldDisableAnimations = disableAnimations || isMobile;
```

## Animation Timeline

### Staggered Animation Sequence
```typescript
const SERVICES_ANIMATION_TIMELINE = {
  // Heading animations
  mainHeading: {
    delay: 0,                       // "KÓDOVÁNÍ BEZ"
    component: 'BlurText',
    animateOn: 'view'
  },
  subHeading: {
    delay: 800,                     // "KOMPROMISŮ:"
    component: 'BlurText', 
    animateOn: 'view'
  },
  
  // Card animations
  firstCard: {
    delay: 1200,                    // First service card
    component: 'FadeContent'
  },
  secondCard: {
    delay: 1400,                    // Second service card (200ms stagger)
    component: 'FadeContent'
  },
  
  // Magic effects
  magicEffects: {
    trigger: 'afterLoad',           // ServiceMagicEffects after component mount
    component: 'ServiceMagicEffects'
  }
};
```

## Testing Considerations

### Unit Tests
```typescript
describe('ServiceBentoCard', () => {
  test('renders with correct props', () => {
    const props = {
      icon: 'fa-solid fa-laptop-code',
      title: 'Test Service',
      description: 'Test description',
      href: '/test-link'
    };
    
    render(<ServiceBentoCard {...props} />);
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test-link');
  });
});
```

### Integration Tests
```typescript
describe('Services Section', () => {
  test('renders all service cards with animations', async () => {
    render(<Services />);
    
    // Check for animated heading
    expect(screen.getByText('KÓDOVÁNÍ BEZ')).toBeInTheDocument();
    expect(screen.getByText('KOMPROMISŮ:')).toBeInTheDocument();
    
    // Check for service cards
    expect(screen.getByText('Návrh & vývoj webu')).toBeInTheDocument();
    expect(screen.getByText('Automatizace firemních procesů')).toBeInTheDocument();
    
    // Check for magic effects
    expect(screen.getByTestId('service-magic-effects')).toBeInTheDocument();
  });
});
```

## Accessibility Features

### Semantic HTML
```html
<section class="service-bento-section" aria-label="Nabízené služby">
  <div class="service-bento-grid" role="list">
    <div role="listitem">
      <a href="/service-link" aria-describedby="service-description">
        <h4>Service Title</h4>
        <p id="service-description">Service description</p>
      </a>
    </div>
  </div>
</section>
```

### Keyboard Navigation
- **Tab order**: Logical navigation through cards
- **Enter/Space**: Activates service links
- **Focus indicators**: Visible focus states
- **Screen reader**: Proper ARIA labels and descriptions

---

*Technical Documentation v1.0.0*  
*Services Components - Technical reference for Claude Code*