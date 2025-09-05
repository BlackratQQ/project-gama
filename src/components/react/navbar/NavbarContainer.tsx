import React, { useState } from 'react';
import MobileMenu from './MobileMenu';
import SplitModal from './SplitModal';
import NavbarScrollEffects from './NavbarScrollEffects';

export default function NavbarContainer() {
  const [isSplitOpen, setIsSplitOpen] = useState(false);

  const handleSplitToggle = () => {
    setIsSplitOpen(true);
  };

  const handleSplitClose = () => {
    setIsSplitOpen(false);
  };

  // Create global function for "Moje služby" button
  React.useEffect(() => {
    // Make split toggle available globally for Menu.astro button
    (window as Window & { openSplitModal?: () => void }).openSplitModal = handleSplitToggle;

    return () => {
      // Cleanup
      delete (window as Window & { openSplitModal?: () => void }).openSplitModal;
    };
  }, []);

  return (
    <>
      {/* Mobile menu component */}
      <MobileMenu />

      {/* Split modal */}
      <SplitModal isOpen={isSplitOpen} onClose={handleSplitClose} />

      {/* Scroll effects */}
      <NavbarScrollEffects />
    </>
  );
}
