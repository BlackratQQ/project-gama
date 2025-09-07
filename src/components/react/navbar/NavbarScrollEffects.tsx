import { useEffect } from 'react';

export default function NavbarScrollEffects() {
  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024; // lg breakpoint

    const applyNavbarStyles = (isScrolled: boolean) => {
      const navbar = document.getElementById('navbar');
      const shouldBeScrolled = isScrolled || isMobile();

      // Navbar background effect only
      if (navbar) {
        if (shouldBeScrolled) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      }
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      applyNavbarStyles(scrolled > 200);
    };

    const handleResize = () => {
      const scrolled = window.scrollY;
      applyNavbarStyles(scrolled > 200);
    };

    // Initialize navbar styles on mount
    applyNavbarStyles(window.scrollY > 200);

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // This component doesn't render anything - it's just for side effects
  return null;
}
