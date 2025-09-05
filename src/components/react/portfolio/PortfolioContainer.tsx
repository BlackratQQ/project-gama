import React, { useState } from 'react';
import PortfolioGrid from './PortfolioGrid';
import PortfolioLightbox from './PortfolioLightbox';

interface PortfolioItem {
  image: string;
  glowImage: string;
  alt: string;
}

interface PortfolioContainerProps {
  items: PortfolioItem[];
}

export default function PortfolioContainer({ items }: PortfolioContainerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxAlt, setLightboxAlt] = useState('');

  const handleItemClick = (index: number, isHovered: boolean) => {
    const item = items[index];
    const imageSrc = isHovered ? item.glowImage : item.image;

    setLightboxImage(imageSrc);
    setLightboxAlt(item.alt);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <PortfolioGrid items={items} onItemClick={handleItemClick} />
      <PortfolioLightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImage}
        imageAlt={lightboxAlt}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
