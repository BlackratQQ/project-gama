import React, { useEffect, useRef, useState } from 'react';

interface PortfolioItem {
  image: string;
  glowImage: string;
  alt: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick: (index: number, isHovered: boolean) => void;
}

export default function PortfolioGrid({ items, onItemClick }: PortfolioGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px',
      }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, [isVisible]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (index: number) => {
    onItemClick(index, hoveredIndex === index);
  };

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:justify-items-center"
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          className="portfolio-item relative aspect-square w-full max-w-md cursor-pointer overflow-hidden rounded-3xl p-4 hover:cursor-pointer border-0 bg-transparent"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
            filter: isVisible ? 'blur(0px)' : 'blur(10px)',
            transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.2}s`,
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick(index);
            }
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-full w-full">
                <div
                  className={`portfolio-image absolute inset-0 transition-all duration-300 ${hoveredIndex === index ? 'scale-105 opacity-0' : ''}`}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-contain transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
                <div
                  className={`portfolio-glow absolute inset-0 transition-all duration-300 ${hoveredIndex === index ? 'scale-105 opacity-100' : 'opacity-0'}`}
                >
                  <img
                    src={item.glowImage}
                    alt={`${item.alt} glow`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
