import React, { useEffect } from 'react';

interface PortfolioLightboxProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

export default function PortfolioLightbox({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}: PortfolioLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in border-0"
      onClick={onClose}
      aria-label="Zavřít lightbox"
    >
      <div className="relative max-h-[90vh] max-w-[90vw] animate-scale-in">
        <div className="h-auto w-auto object-contain max-h-[90vh] max-w-[90vw]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-auto w-auto object-contain max-h-[90vh] max-w-[90vw]"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -right-4 -top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </button>
  );
}
