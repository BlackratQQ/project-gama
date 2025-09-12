import React, { useState, useEffect } from 'react';

interface MenuItem {
  label: string;
  href: string;
  dropdown?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: 'Hlavní stránka', href: '/' },
  {
    label: 'Moje služby',
    href: '/#moje-sluzby',
    dropdown: [
      { label: 'Vývoj funkčního webu', href: '/sluzby/vyvoj-funkcniho-webu' },
      { label: 'Automatizace procesů', href: '/sluzby/automatizace-procesu' },
    ],
  },
  { label: 'Reference', href: '/#reference' },
  { label: 'Ceník & o mně', href: '/cenik' },
  { label: 'Kontakt', href: '/#kontaktni-formular' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <div className="mobile-menu-container lg:hidden">
      {/* Hamburger button */}
      <button
        className="mobile-menu-toggle p-2 text-white hover:text-orange-500"
        aria-label="Toggle menu"
        onClick={openMenu}
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

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div className={`fixed right-0 top-0 h-screen w-[40%] bg-black/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Close button */}
          <button
            className="mobile-menu-close absolute right-4 top-4 p-2 text-white hover:text-orange-500"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Menu items */}
          <nav className="flex items-center justify-center h-full">
            <ul className="space-y-8 text-center">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="mobile-menu-link block text-xl font-medium text-white hover:text-orange-500 transition-colors duration-200"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}