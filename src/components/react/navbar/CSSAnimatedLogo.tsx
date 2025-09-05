import type { FC } from 'react';
import { useEffect, useState } from 'react';

const CSSAnimatedLogo: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
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

  // Výpočet velikosti a pozice na základě scroll progress
  const logoHeight = 80 - (scrollProgress * 24); // 80px -> 56px
  const logoMarginTop = 24 - (scrollProgress * 8); // 24px -> 16px

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
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'height, margin-top, filter, opacity',
          }}
        />
      </a>
    </div>
  );
};

export default CSSAnimatedLogo;