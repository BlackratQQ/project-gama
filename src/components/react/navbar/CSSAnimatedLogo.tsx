import type { FC } from 'react';
import { useEffect, useState } from 'react';

const CSSAnimatedLogo: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="logo-container">
      <a href="/" className="flex items-center">
        <img
          id="navbar-logo"
          src="/NewLogo.svg"
          alt="VK Logo"
          className={`h-20 w-auto transition-all duration-300 mt-6 hover:cursor-pointer logo-pulse logo-animate ${
            isLoaded ? 'logo-visible' : ''
          }`}
          style={{
            willChange: 'filter, opacity',
          }}
        />
      </a>
    </div>
  );
};

export default CSSAnimatedLogo;