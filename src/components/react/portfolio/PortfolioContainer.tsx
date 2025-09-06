import React, { useState } from 'react';
import PortfolioGrid from './PortfolioGrid';
import PortfolioLightbox from './PortfolioLightbox';

interface PortfolioItem {
  image: string;
  imageAvif: string;
  glowImage: string;
  glowImageAvif: string;
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

  const handleItemClick = (index: number, isHovered: boolean) => {
    const item = items[index];
    const imageSrc = isHovered ? item.glowImage : item.image;
    const imageAvifSrc = isHovered ? item.glowImageAvif : item.imageAvif;

    setLightboxImage(imageSrc);
    setLightboxImageAvif(imageAvifSrc);
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
        imageAvif={lightboxImageAvif}
        imageAlt={lightboxAlt}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
