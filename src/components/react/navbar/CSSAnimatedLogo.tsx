import type { FC } from 'react';
import { useEffect, useState } from 'react';

const CSSAnimatedLogo: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10);

    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Plynulý přechod mezi 0 a 200px
      const progress = Math.min(scrollPosition / 200, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Výpočet velikosti a pozice na základě scroll progress a mobile/desktop
  const logoHeight = isMobile ? 40 : (80 - (scrollProgress * 40)); // Mobile: 40px always, Desktop: 80px -> 40px
  const logoMarginTop = isMobile ? 0 : (24 - (scrollProgress * 24)); // Mobile: 0px always, Desktop: 24px -> 0px

  return (
    <div className="logo-container">
      <a href="/" className="flex items-center">
        <img
          id="navbar-logo"
          src="/NewLogo.svg"
          alt="VK Logo"
          className={`w-auto hover:cursor-pointer logo-pulse logo-animate ${
            isLoaded ? 'logo-visible' : ''
          }`}
          style={{
            height: `${logoHeight}px`,
            marginTop: `${logoMarginTop}px`,
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'height, margin-top',
          }}
        />
      </a>
    </div>
  );
};

export default CSSAnimatedLogo;