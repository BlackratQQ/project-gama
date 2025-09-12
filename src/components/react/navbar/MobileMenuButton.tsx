import React, { useState, useEffect } from 'react';

export default function MobileMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    if (typeof window !== 'undefined') {
      if (isMenuOpen) {
        // Close menu
        window.dispatchEvent(new CustomEvent('closeMobileMenu'));
      } else {
        // Open menu
        window.dispatchEvent(new CustomEvent('openMobileMenu'));
      }
      setIsMenuOpen(!isMenuOpen);
    }
  };

  // Listen for menu state changes from MobileMenu component
  useEffect(() => {
    const handleMenuOpened = () => {
      setIsMenuOpen(true);
    };

    const handleMenuClosed = () => {
      setIsMenuOpen(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mobileMenuOpened', handleMenuOpened);
      window.addEventListener('mobileMenuClosed', handleMenuClosed);

      return () => {
        window.removeEventListener('mobileMenuOpened', handleMenuOpened);
        window.removeEventListener('mobileMenuClosed', handleMenuClosed);
      };
    }
  }, []);

  return (
    <div className="mobile-menu-container lg:hidden">
      {/* Animated burger button */}
      <button
        className={`burger-icon border-0 bg-transparent p-0 ${isMenuOpen ? 'active' : ''}`}
        aria-label="Toggle menu"
        onClick={handleToggleMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </div>
  );
}