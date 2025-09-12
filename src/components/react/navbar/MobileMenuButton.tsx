import React from 'react';

export default function MobileMenuButton() {
  const handleOpenMenu = () => {
    if (typeof window !== 'undefined') {
      // Dispatch custom event to open mobile menu
      window.dispatchEvent(new CustomEvent('openMobileMenu'));
    }
  };

  return (
    <div className="mobile-menu-container lg:hidden">
      {/* Hamburger button */}
      <button
        className="mobile-menu-toggle p-2 text-white hover:text-orange-500"
        aria-label="Toggle menu"
        onClick={handleOpenMenu}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}