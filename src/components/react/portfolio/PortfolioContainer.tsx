import React, { useState } from 'react';
import PortfolioGrid from './PortfolioGrid';
import PortfolioLightbox from './PortfolioLightbox';
import PortfolioPreloader from './PortfolioPreloader';

interface PortfolioItem {
  image: string;
  imageAvif: string;
  glowImage: string;
  glowImageAvif: string;
  fullImage: string;
  fullImageAvif: string;
  alt: string;
}

interface PortfolioContainerProps {
  items: PortfolioItem[];
}

export default function PortfolioContainer({ items }: PortfolioContainerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxImageAvif, setLightboxImageAvif] = useState('');
  const [lightboxAlt, setLightboxAlt] = useState('');

  const handleItemClick = (index: number, _isHovered: boolean) => {
    const item = items[index];
    
    setLightboxImage(item.fullImage);
    setLightboxImageAvif(item.fullImageAvif);
    setLightboxAlt(item.alt);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <PortfolioGrid items={items} onItemClick={handleItemClick} />
      <PortfolioPreloader items={items} />
      <PortfolioLightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImage}
        imageAvif={lightboxImageAvif}
        imageAlt={lightboxAlt}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
