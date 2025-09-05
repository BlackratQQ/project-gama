import React, { lazy, Suspense } from "react";

// Dynamické načtení GridDistortion pouze pro desktop
const GridDistortion = lazy(() => import("./shared/GridDistortion"));

interface HeroPortraitProps {
  className?: string;
}

// Pouze desktop verze s GridDistortion efektem
const HeroPortrait: React.FC<HeroPortraitProps> = ({ className = "" }) => {
  // Aspect ratio obrázku: 730/786 ≈ 0.929
  return (
    <div
      className={`absolute bottom-0 w-5/6 lg:w-full min-[1024px]:max-[1279px]:w-full mx-auto left-0 right-0 ${className}`}
      style={{ aspectRatio: "730/786" }}
    >
      <Suspense
        fallback={
          <img
            src="/Portrait.webp"
            alt="Hero portrait"
            className="w-full h-full object-contain"
            width={730}
            height={786}
            loading="lazy"
            decoding="async"
          />
        }
      >
        <GridDistortion
          imageSrc="/Portrait.webp"
          alt="Hero portrait"
          width={730}
          height={786}
          grid={20}
          mouse={0.08}
          strength={0.12}
          relaxation={0.92}
          loadingDuration={1000}
          loadingStrength={0.3}
          loadingSpeed={3}
          loadingPattern="wave"
          initialDelay={800}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
};

export default HeroPortrait;
