# Claude Code - React Components Technical Documentation

## Component Architecture

### Directory Structure
```
/components/react/
├── docs/                           # Component documentation
│   ├── README.md                   # User documentation
│   └── CLAUDE.md                   # This file
├── hero/                           # Hero section components
│   └── CallToActionBtn.tsx         # CTA button with animations
├── navbar/                         # Navigation components
│   ├── AnimatedLogo.tsx            # Logo with motion animations
│   ├── MobileMenu.tsx              # Mobile hamburger menu
│   ├── NavbarContainer.tsx         # Main navbar container
│   ├── NavbarMenu.tsx              # Desktop menu component
│   ├── NavbarScrollEffects.tsx     # Scroll-based effects
│   └── SplitModal.tsx              # Fullscreen modal overlay
├── portfolio/                      # Portfolio display components
│   ├── PortfolioContainer.tsx      # Main portfolio container
│   ├── PortfolioGrid.tsx           # Grid layout with animations
│   └── PortfolioLightbox.tsx       # Image lightbox component
├── services/                       # Service-related components
│   └── ServiceMagicEffects.tsx     # Interactive service card effects
├── shared/                         # Reusable animation components
│   ├── AutomatizaceHowItWorksBentoEffects.tsx
│   ├── AutomatizaceServicesBentoEffects.tsx
│   ├── BlurText.tsx                # Animated blur text reveal
│   ├── DecryptedText.tsx           # Text decryption animation
│   ├── DotGrid.tsx                 # Animated dot grid background
│   ├── FadeContent.tsx             # Content fade-in animations
│   ├── GlitchText.tsx              # Glitch text effect
│   ├── GridDistortion.tsx          # WebGL image distortion
│   ├── HowItWorksBentoEffects.tsx  # Bento grid effects
│   ├── LightRays.tsx               # Light ray effects
│   ├── MagicBento.tsx              # Magic bento animations
│   ├── PriceListBentoEffects.tsx   # Price list effects
│   ├── ReasonBentoEffects.tsx      # Reason card effects
│   ├── ReferenceBentoEffects.tsx   # Reference effects
│   ├── ServicesBentoEffects.tsx    # Services bento effects
│   └── Threads.tsx                 # 3D thread animations
├── techStack/                      # Technology stack components
│   └── LogoLoop.tsx                # Infinite logo carousel
└── testimonials/                   # Testimonial components
    └── TestimonialMagicEffects.tsx # Testimonial effects
```

## Core Animation Components

### BlurText.tsx

**Purpose**: Animated text reveal with blur effect
**Dependencies**: `motion/react`

```typescript
interface BlurTextProps {
  text: string;
  delay?: number;                    // Delay between segments (ms)
  initialDelay?: number;             // Initial delay (ms)
  animateBy?: 'words' | 'characters'; // Animation granularity
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  animateOn?: 'load' | 'view';       // Trigger method
  onAnimationComplete?: () => void;
}
```

**Animation Details**:
- Initial state: `blur(10px)`, `opacity: 0`, directional offset
- Final state: `blur(0px)`, `opacity: 1`, no offset
- Duration: 800ms per segment
- Easing: `[0.16, 1, 0.3, 1]` (custom cubic-bezier)
- Intersection Observer for viewport triggering

**Implementation**:
```typescript
const segments = animateBy === 'words' ? text.split(' ') : text.split('');

const animateProps = animateOn === 'view' ? {
  whileInView: { filter: 'blur(0px)', opacity: 1, y: 0, x: 0 },
  viewport: { once: true, margin: '-50px' },
} : {
  animate: { filter: 'blur(0px)', opacity: 1, y: 0, x: 0 },
};
```

### FadeContent.tsx

**Purpose**: Content fade-in with directional motion and blur
**Dependencies**: `motion/react`

```typescript
interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;                    // Enable blur effect
  duration?: number;                 // Animation duration (ms)
  easing?: string;                   // Easing function
  initialOpacity?: number;           // Starting opacity
  delay?: number;                    // Animation delay (ms)
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
```

**Animation Logic**:
```typescript
const getDirectionOffset = () => {
  switch (direction) {
    case 'top': return { y: -30, x: 0 };
    case 'bottom': return { y: 30, x: 0 };
    case 'left': return { x: -30, y: 0 };
    case 'right': return { x: 30, y: 0 };
    default: return { y: -30, x: 0 };
  }
};
```

**Viewport Configuration**:
- Trigger: `whileInView` with `once: true`
- Margin: `-50px` (triggers before element is fully visible)
- Easing: Custom cubic-bezier or 'easeInOut'

### DecryptedText.tsx

**Purpose**: Text decryption animation with scrambling effect
**Dependencies**: `motion/react`, React hooks

```typescript
interface DecryptedTextProps extends HTMLMotionProps<'span'> {
  text: string;
  speed?: number;                    // Animation speed (ms)
  maxIterations?: number;            // Max scramble iterations
  sequential?: boolean;              // Sequential vs simultaneous reveal
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;    // Use only chars from original text
  characters?: string;               // Character set for scrambling
  animateOn?: 'view' | 'hover';      // Trigger method
  initialDelay?: number;             // Initial delay (ms)
}
```

**Algorithm Details**:
1. **Character Pool Management**:
   ```typescript
   const availableChars = useOriginalCharsOnly
     ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
     : characters.split('');
   ```

2. **Scrambling Logic**:
   ```typescript
   const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
     return originalText.split('').map((char, i) => {
       if (char === ' ') return ' ';
       if (currentRevealed.has(i)) return originalText[i];
       return availableChars[Math.floor(Math.random() * availableChars.length)];
     }).join('');
   };
   ```

3. **Reveal Direction Strategies**:
   - **Start**: Sequential from index 0
   - **End**: Sequential from last index
   - **Center**: Alternating from middle outward

### GridDistortion.tsx

**Purpose**: WebGL-powered image distortion with mouse interaction
**Dependencies**: `Three.js`, React hooks

```typescript
interface GridDistortionProps {
  grid?: number;                     // Grid resolution
  mouse?: number;                    // Mouse influence radius
  strength?: number;                 // Distortion strength
  relaxation?: number;               // Return to normal speed
  imageSrc: string;                  // Image source URL
  loadingDuration?: number;          // Loading animation duration
  loadingStrength?: number;          // Loading effect strength
  loadingPattern?: 'wave' | 'ripple' | 'chaos';
}
```

**WebGL Shaders**:
```glsl
// Vertex Shader
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
```

**Mouse Interaction Logic**:
```typescript
const calculateImageBounds = () => {
  // Object-contain behavior calculation
  const containerRect = container.getBoundingClientRect();
  const imageAspect = imageAspectRef.current;
  const containerAspect = containerRect.width / containerRect.height;
  
  if (containerAspect > imageAspect) {
    // Container wider - image full height, centered horizontally
    imageHeight = containerRect.height;
    imageWidth = imageHeight * imageAspect;
    imageX = (containerRect.width - imageWidth) / 2;
    imageY = 0;
  } else {
    // Container taller - image full width, positioned at bottom
    imageWidth = containerRect.width;
    imageHeight = imageWidth / imageAspect;
    imageX = 0;
    imageY = containerRect.height - imageHeight;
  }
};
```

**Loading Animation Patterns**:
```typescript
switch (loadingPattern) {
  case 'wave':
    effectStrength = Math.sin(loadingTime + distance * 10) * loadingStrength;
    break;
  case 'ripple':
    effectStrength = Math.sin(loadingTime - distance * 15) * loadingStrength * (1 - distance);
    break;
  case 'chaos':
    effectStrength = (Math.sin(loadingTime * 2 + i * 0.5) + Math.cos(loadingTime * 3 + j * 0.7)) * loadingStrength;
    break;
}
```

## Service Effects System

### ServiceMagicEffects.tsx

**Purpose**: Advanced interactive effects for service cards
**Dependencies**: `GSAP`, React hooks

```typescript
interface ServiceEffectsProps {
  enableStars?: boolean;             // Particle effects
  enableSpotlight?: boolean;         // Global spotlight
  enableBorderGlow?: boolean;        // Card border glow
  enableTilt?: boolean;              // 3D tilt effect
  enableMagnetism?: boolean;         // Magnetic mouse following
  clickEffect?: boolean;             // Click ripple effect
  spotlightRadius?: number;          // Spotlight size
  particleCount?: number;            // Number of particles
  glowColor?: string;                // Effect color (RGB values)
}
```

**Particle System Implementation**:
```typescript
const createParticleElement = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};
```

**GSAP Animation Pipeline**:
1. **Particle Creation**: Memoized particles for performance
2. **Entrance Animation**: Scale from 0 with back.out easing
3. **Motion Animation**: Random movement with yoyo repeat
4. **Opacity Pulsing**: Breathing effect
5. **Exit Animation**: Scale to 0 with back.in easing

**Spotlight System**:
```typescript
const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,         // Close interaction zone
  fadeDistance: radius * 0.75,     // Fade-out boundary
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};
```

## Portfolio System

### PortfolioGrid.tsx

**Purpose**: Responsive grid with hover state management
**Dependencies**: React hooks, Intersection Observer

```typescript
interface PortfolioItem {
  image: string;                     // Normal image URL
  glowImage: string;                 // Hover glow image URL
  alt: string;                       // Alt text
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick: (index: number, isHovered: boolean) => void;
}
```

**Intersection Observer Setup**:
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
    {
      threshold: 0.1,                // Trigger at 10% visibility
      rootMargin: '-50px 0px',       // Account for scroll position
    }
  );
}, [isVisible]);
```

**Staggered Animation Timing**:
```typescript
style={{
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
  filter: isVisible ? 'blur(0px)' : 'blur(10px)',
  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.2}s`,
}}
```

## Tech Stack Display

### LogoLoop.tsx

**Purpose**: Infinite horizontal logo carousel with smooth animation
**Dependencies**: React icons, ResizeObserver, requestAnimationFrame

```typescript
export interface LogoLoopProps {
  logos: LogoItem[];                 // Logo data array
  speed?: number;                    // Animation speed (px/s)
  direction?: 'left' | 'right';      // Scroll direction
  logoHeight?: number;               // Logo size
  gap?: number;                      // Spacing between logos
  pauseOnHover?: boolean;            // Pause on mouse hover
  fadeOut?: boolean;                 // Edge fade effect
  scaleOnHover?: boolean;            // Scale animation on hover
}
```

**Animation Loop Implementation**:
```typescript
const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean
) => {
  const animate = (timestamp: number) => {
    const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
    const target = pauseOnHover && isHovered ? 0 : targetVelocity;
    
    // Smooth velocity transition with exponential easing
    const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
    velocityRef.current += (target - velocityRef.current) * easingFactor;
    
    // Update position with modulo wrapping
    let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
    nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
    offsetRef.current = nextOffset;
    
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    rafRef.current = requestAnimationFrame(animate);
  };
};
```

**Copy Management System**:
```typescript
const updateDimensions = useCallback(() => {
  const containerWidth = containerRef.current?.clientWidth ?? 0;
  const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;
  
  if (sequenceWidth > 0) {
    setSeqWidth(Math.ceil(sequenceWidth));
    // Calculate copies needed to fill viewport + headroom
    const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
  }
}, []);
```

## Performance Optimizations

### Mobile Detection and Adaptive Performance

```typescript
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
```

### Animation Throttling and Cleanup

```typescript
// GSAP animation cleanup
const handleMouseLeave = () => {
  timeoutsRef.forEach(clearTimeout);
  timeoutsRef.length = 0;
  
  particlesRef.forEach((particle) => {
    gsap.to(particle, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'back.in(1.7)',
      onComplete: () => particle.parentNode?.removeChild(particle),
    });
  });
  particlesRef.length = 0;
};

// Effect cleanup in useEffect
return () => {
  if (interval) clearInterval(interval);
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  observer?.disconnect();
  element.removeEventListener('mousemove', handleMouseMove);
};
```

### Prefers-Reduced-Motion Support

```typescript
useEffect(() => {
  const prefersReduced = 
    typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
  if (prefersReduced) {
    track.style.transform = 'translate3d(0, 0, 0)';
    return;
  }
  
  // Normal animation logic
}, []);
```

## State Management Patterns

### Local Component State
```typescript
// Hover state management
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
const [isVisible, setIsVisible] = useState(false);

// Animation state management  
const [isHovering, setIsHovering] = useState<boolean>(false);
const [isScrambling, setIsScrambling] = useState<boolean>(false);
const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
```

### Ref-based State for Performance
```typescript
// Avoid re-renders for frequently updated values
const isHoveredRef = useRef(false);
const mouseStateRef = useRef({ x: 0, y: 0, vX: 0, vY: 0 });
const velocityRef = useRef(0);
const offsetRef = useRef(0);
```

## CSS-in-JS Integration

### Dynamic CSS Properties
```typescript
const cssVariables = useMemo(() => ({
  '--logoloop-gap': `${gap}px`,
  '--logoloop-logoHeight': `${logoHeight}px`,
  '--glow-color': glowColor,
  '--glow-intensity': glowIntensity.toString(),
}), [gap, logoHeight, glowColor, glowIntensity]);
```

### Conditional Styling
```typescript
const rootClasses = useMemo(() => cx(
  'relative overflow-x-hidden group',
  '[--logoloop-gap:32px]',
  '[--logoloop-logoHeight:28px]',
  scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
  className
), [scaleOnHover, className]);
```

## Testing Considerations

### Component Testing
```typescript
describe('BlurText', () => {
  it('renders with correct initial state', () => {
    render(<BlurText text="Test" animateOn="load" />);
    const element = screen.getByText('Test');
    expect(element).toHaveStyle({ opacity: '0', filter: 'blur(10px)' });
  });
  
  it('animates on intersection', () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
    
    render(<BlurText text="Test" animateOn="view" />);
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});
```

### Animation Testing
```typescript
describe('ServiceMagicEffects', () => {
  it('creates particle elements on hover', () => {
    render(<ServiceMagicEffects enableStars={true} />);
    
    const card = document.querySelector('.service-bento-card');
    fireEvent.mouseEnter(card);
    
    setTimeout(() => {
      const particles = document.querySelectorAll('.particle');
      expect(particles.length).toBeGreaterThan(0);
    }, 100);
  });
});
```

## Error Handling and Fallbacks

### Graceful Degradation
```typescript
// Three.js fallback
useEffect(() => {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // WebGL initialization
  } catch (error) {
    console.warn('WebGL not supported, falling back to static image');
    // Show static image instead
  }
}, []);

// Animation fallback
const animate = (timestamp: number) => {
  try {
    // Animation logic
  } catch (error) {
    console.error('Animation error:', error);
    // Stop animation loop
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }
};
```

### Memory Management
```typescript
// Proper cleanup to prevent memory leaks
useEffect(() => {
  // Setup code
  
  return () => {
    // Cleanup: Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    // Cleanup: Dispose Three.js resources
    renderer.dispose();
    geometry.dispose();
    material.dispose();
    texture?.dispose();
    // Cleanup: Cancel animations
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Cleanup: Clear timeouts
    timeouts.forEach(clearTimeout);
  };
}, []);
```

## Browser Support

### Minimum Requirements
- Chrome 90+ (Motion API, Intersection Observer)
- Firefox 88+ (CSS backdrop-filter support)  
- Safari 14+ (WebGL 2.0, Motion API)
- Edge 90+ (Full feature support)

### Feature Detection
```typescript
// WebGL support detection
const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

// Intersection Observer polyfill
const supportsIntersectionObserver = () => 'IntersectionObserver' in window;
```

---

*Technical Documentation v1.0.0*  
*React Components - Comprehensive technical reference for Claude Code*