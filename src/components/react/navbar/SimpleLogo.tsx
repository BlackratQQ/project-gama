import type { FC } from 'react';

const SimpleLogo: FC = () => {
  return (
    <div className="logo-container">
      <a href="/" className="flex items-center">
        <img
          id="navbar-logo"
          src="/NewLogo.svg"
          alt="VK Logo"
          className="h-20 w-auto transition-all duration-300 mt-6 hover:cursor-pointer logo-pulse"
          style={{
            opacity: 1,
          }}
        />
      </a>
    </div>
  );
};

export default SimpleLogo;