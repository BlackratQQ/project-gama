import { useEffect, useRef } from 'react';

interface PortfolioItem {
  fullImage: string;
  fullImageAvif: string;
}

interface PortfolioPreloaderProps {
  items: PortfolioItem[];
}

export default function PortfolioPreloader({ items }: PortfolioPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadedImages = useRef(new Set<string>());

  useEffect(() => {
    if (!containerRef.current) return;

    const preloadImage = (src: string) => {
      if (preloadedImages.current.has(src)) return;
      
      const img = new Image();
      img.src = src;
      preloadedImages.current.add(src);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            items.forEach((item) => {
              preloadImage(item.fullImageAvif);
              preloadImage(item.fullImage);
            });
            
            observer.disconnect();
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '100px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return <div ref={containerRef} className="sr-only" aria-hidden="true" />;
}