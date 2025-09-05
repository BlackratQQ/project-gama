# Claude Code - Navbar Components Technical Documentation

## Component Architecture

### File Structure
```
/components/navbar/
├── Navbar.astro          # Main navbar container (SSR)
├── Logo.astro            # Logo wrapper (SSR)  
├── Menu.astro            # Desktop menu wrapper (SSR)
└── docs/
    ├── README.md         # User documentation
    └── CLAUDE.md         # This file
```

### Related React Components
```
/components/react/navbar/
├── AnimatedLogo.tsx      # Animated logo component
├── NavbarContainer.tsx   # React container for interactive elements
├── NavbarMenu.tsx        # Desktop menu implementation
├── MobileMenu.tsx        # Mobile hamburger menu
├── NavbarScrollEffects.tsx # Scroll-based styling
└── SplitModal.tsx        # Full-screen modal overlay
```

## Navbar.astro

### Purpose
Main navigation container providing layout structure and integrating Astro and React components.

### Implementation
```astro
---
import Logo from './Logo.astro';
import Menu from './Menu.astro';
import NavbarContainer from '../react/navbar/NavbarContainer';
---

<nav id="navbar" class="fixed top-0 z-30 w-full transition-all duration-300">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">
    <Logo />
    
    <!-- Desktop menu -->
    <div class="hidden lg:block">
      <Menu />
    </div>
    
    <!-- React components container -->
    <NavbarContainer client:idle />
  </div>
</nav>
```

### Technical Details
- **Positioning**: `fixed top-0` - Always at top of viewport
- **Z-index**: 30 - Above most content, below modals (z-50)
- **Height**: 64px (`h-16`)
- **Responsive**: Flex layout with `justify-between`
- **Hydration**: React components loaded with `client:idle`

### CSS Classes
```css
.navbar-scrolled {
  @apply backdrop-blur-md bg-black/50;
}
```

## Logo.astro

### Purpose
Simple wrapper for animated logo component, providing SSR structure.

### Implementation
```astro
---
import AnimatedLogo from '../react/navbar/AnimatedLogo';
---

<AnimatedLogo client:idle />
```

### CSS Animation
```css
.logo-pulse:hover {
  animation: pulse-scale 1.5s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## Menu.astro

### Purpose
Desktop menu wrapper with dropdown styling capabilities.

### Implementation
```astro
---
import NavbarMenu from '../react/navbar/NavbarMenu';
---

<NavbarMenu client:idle />
```

### CSS Styling
```css
.dropdown-menu {
  background:
    radial-gradient(circle at 20% 30%, #002853 0%, transparent 70%),
    radial-gradient(circle at 80% 70%, #2b0053 0%, transparent 60%), 
    rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
}
```

## React Components Integration

### AnimatedLogo.tsx

**Props**: None
**State**: None (purely presentational)

```typescript
interface AnimatedLogoProps {}

const AnimatedLogo: FC = () => {
  return (
    <div className="logo-container">
      <a href="/" className="flex items-center">
        <motion.img
          src="/NewLogo.svg"
          alt="VK Logo"
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.2, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          className="h-20 w-auto transition-all duration-300 mt-6 hover:cursor-pointer logo-pulse"
        />
      </a>
    </div>
  );
};
```

**Animation Details**:
- Initial blur: 10px → 0px
- Opacity: 0 → 1
- Duration: 1.2s
- Easing: Custom cubic-bezier
- Hover: CSS pulse animation

### NavbarContainer.tsx

**Purpose**: Container for all React navbar functionality

```typescript
interface NavbarContainerProps {}

const NavbarContainer: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);

  return (
    <>
      <NavbarScrollEffects />
      <MobileMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <SplitModal isOpen={isSplitOpen} onClose={() => setIsSplitOpen(false)} />
    </>
  );
};
```

**State Management**:
- `isMenuOpen`: Mobile menu visibility
- `isSplitOpen`: Split modal visibility

**Child Components**:
- NavbarScrollEffects (scroll-based styling)
- MobileMenu (mobile hamburger menu)
- SplitModal (fullscreen modal overlay)

## Responsive Behavior

### Breakpoints
```scss
// Desktop: lg: (1024px+)
.hidden.lg\:block { display: none; }
@media (min-width: 1024px) {
  .hidden.lg\:block { display: block; }
}

// Mobile: (< 1024px)
@media (max-width: 1023px) {
  .desktop-menu { display: none; }
  .mobile-menu { display: block; }
}
```

### Layout Behavior
- **Desktop** (`>= 1024px`): Logo left, Menu right
- **Mobile/Tablet** (`< 1024px`): Logo left, Hamburger right

## State Management

### Local Component State
```typescript
// NavbarContainer.tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isSplitOpen, setIsSplitOpen] = useState(false);

// MobileMenu.tsx
interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}
```

### Global State (via events)
```javascript
// Scroll position tracking
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar?.classList.add('navbar-scrolled');
  } else {
    navbar?.classList.remove('navbar-scrolled');
  }
});
```

## Performance Considerations

### Hydration Strategy
- **client:idle**: Components load after page becomes interactive
- **Benefits**: Faster initial page load, SEO-friendly
- **Trade-off**: Slight delay in interactivity

### CSS Optimization
```css
/* Use transform and opacity for animations (GPU-accelerated) */
.transition-all { transition: all 0.3s ease; }

/* Will-change for performance hints */
.logo { will-change: transform, filter; }
```

### Image Optimization
- Logo uses SVG format (scalable, small size)
- Optimized for retina displays
- Cached by browser

## Accessibility

### Keyboard Navigation
```typescript
// Tab order: Logo → Menu Items → Mobile Menu Button
<a href="/" tabIndex={0}>Logo</a>
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="#home" tabIndex={0}>Domů</a></li>
    <li><a href="#services" tabIndex={0}>Služby</a></li>
  </ul>
</nav>
```

### ARIA Attributes
```html
<!-- Mobile menu button -->
<button 
  aria-expanded="false"
  aria-controls="mobile-menu"
  aria-label="Toggle navigation menu"
>
  <span class="sr-only">Open main menu</span>
</button>

<!-- Mobile menu -->
<nav id="mobile-menu" role="navigation" aria-hidden="true">
```

### Screen Reader Support
- Semantic HTML (`<nav>`, `<ul>`, `<li>`)
- Alt text for logo image
- Screen reader only text for hamburger button
- Focus management for modal states

## Event Handling

### Click Events
```typescript
// Logo click
const handleLogoClick = (e: MouseEvent) => {
  window.location.href = '/';
};

// Menu toggle
const handleMenuToggle = () => {
  setIsMenuOpen(!isMenuOpen);
  document.body.classList.toggle('menu-open');
};

// Outside click (close menu)
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!menuRef.current?.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### Scroll Events
```typescript
// Throttled scroll handler for performance
const handleScroll = useMemo(() => 
  throttle(() => {
    const scrolled = window.scrollY > 50;
    setIsScrolled(scrolled);
  }, 16), []
); // 60fps throttling

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);
```

## CSS Classes Reference

### Layout Classes
```css
.navbar-container {
  @apply fixed top-0 z-30 w-full transition-all duration-300;
}

.navbar-inner {
  @apply container mx-auto flex h-16 items-center justify-between px-4;
}
```

### State Classes
```css
.navbar-scrolled {
  @apply backdrop-blur-md bg-black/50;
}

.navbar-transparent {
  @apply bg-transparent;
}

.menu-open {
  @apply overflow-hidden; /* Applied to body */
}
```

### Animation Classes
```css
.logo-pulse:hover {
  animation: pulse-scale 1.5s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

## Dependencies

### Direct Dependencies
- `motion/react` (Framer Motion for animations)
- React 19.1.1
- Astro 5.13.2

### Indirect Dependencies
- Tailwind CSS (utility classes)
- PostCSS (CSS processing)

### Asset Dependencies
- `/public/NewLogo.svg` - Logo image file
- Custom fonts (if any)

## Testing Considerations

### Unit Tests
```typescript
describe('AnimatedLogo', () => {
  it('renders logo with correct src', () => {
    render(<AnimatedLogo />);
    expect(screen.getByAltText('VK Logo')).toHaveAttribute('src', '/NewLogo.svg');
  });

  it('has correct animation properties', () => {
    render(<AnimatedLogo />);
    const logo = screen.getByAltText('VK Logo');
    // Test motion props and CSS classes
  });
});
```

### Integration Tests
```typescript
describe('Navbar Integration', () => {
  it('shows desktop menu on large screens', () => {
    // Mock viewport size
    // Test responsive behavior
  });

  it('shows mobile menu on small screens', () => {
    // Mock mobile viewport
    // Test hamburger menu functionality
  });
});
```

### E2E Tests
```typescript
// Playwright/Cypress tests
test('navbar navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="logo"]');
  await expect(page).toHaveURL('/');
  
  await page.click('[data-testid="mobile-menu-toggle"]');
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});
```

## Browser Support

### Minimum Requirements
- Chrome 90+ (Motion API)
- Firefox 88+ (CSS backdrop-filter)
- Safari 14+ (CSS backdrop-filter)
- Edge 90+

### Fallbacks
```css
/* Backdrop-filter fallback */
.navbar-scrolled {
  backdrop-filter: blur(12px);
  
  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(12px)) {
    background: rgba(0, 0, 0, 0.8);
  }
}
```

## Debug Information

### Console Logs (Development)
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Navbar mounted');
  console.log('Mobile menu state:', isMenuOpen);
  console.log('Scroll position:', scrollY);
}
```

### CSS Debug Classes
```css
/* Development debugging */
.debug-navbar {
  outline: 2px solid red;
}

.debug-logo {
  outline: 2px solid blue;
}
```

---

*Technical Documentation v1.0.0*  
*Component-specific documentation for Claude Code*