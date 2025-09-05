import { FaChevronDown } from 'react-icons/fa6';
import { motion } from 'motion/react';
import BlurText from '../services/BlurText';
import type { FC } from 'react';

// Extend Window interface for openSplitModal
declare global {
  interface Window {
    openSplitModal?: () => void;
  }
}

interface MenuItem {
  label: string;
  href: string;
  dropdown?: Array<{ label: string; href: string }>;
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
  { label: 'Ceník & o mně', href: '/cenik-o-mne' },
  { label: 'Kontakt', href: '/#kontaktni-formular' },
];

const NavbarMenu: FC = () => {
  const handleServicesClick = () => {
    if (typeof window !== 'undefined' && window.openSplitModal) {
      window.openSplitModal();
    }
  };

  return (
    <ul className="flex items-center space-x-8">
      {menuItems.map((item, index) => (
        <li key={item.label} className={item.dropdown ? 'group relative' : ''}>
          {item.dropdown ? (
            <div className="relative">
              <button
                id="moje-sluzby-btn"
                className="flex items-center gap-1 text-white hover:text-orange-500 font-medium transition-colors duration-200"
                onClick={handleServicesClick}
              >
                <div className="flex items-center gap-1">
                  <BlurText
                    text={item.label}
                    delay={150}
                    initialDelay={index * 200}
                    animateBy="words"
                    direction="top"
                    className=""
                  />
                  <motion.div
                    initial={{
                      filter: 'blur(10px)',
                      opacity: 0,
                      y: -20,
                    }}
                    animate={{
                      filter: 'blur(0px)',
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: (index * 200 + 300) / 1000, // Animace ikony po textu
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    <FaChevronDown
                      size={12}
                      className="group-hover:rotate-180 transition-transform duration-200 ml-1"
                    />
                  </motion.div>
                </div>
              </button>

              {/* Dropdown menu */}
              <div className="dropdown-menu absolute top-full left-0 mt-2 w-64 backdrop-blur-md bg-black/80 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div>
                  {item.dropdown.map((dropdownItem) => (
                    <a
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      className="dropdown-item block px-6 py-3 text-white hover:bg-black/30 hover:text-orange-400 transition-all duration-200 border-b border-white/5 last:border-b-0 first:pt-6 last:pb-6"
                    >
                      <span className="font-medium">{dropdownItem.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <a
              href={item.href}
              className="text-white hover:text-orange-500 font-medium transition-colors duration-200"
            >
              <BlurText
                text={item.label}
                delay={150}
                initialDelay={index * 200}
                animateBy="words"
                direction="top"
                className=""
              />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavbarMenu;
