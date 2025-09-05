import React from "react";
import GridDistortion from "./shared/GridDistortion";

interface HeroPortraitProps {
  variant: "mobile" | "tablet" | "desktop";
  className?: string;
}

const HeroPortrait: React.FC<HeroPortraitProps> = ({
  variant,
  className = "",
}) => {
  if (variant === "mobile") {
    // Mobilní verze bez GridDistortion efektu pro lepší výkon
    return (
      <img
        src="/Portrait-256w.webp"
        alt="Hero portrait"
        className={`w-64 h-auto object-contain opacity-60 ${className}`}
        width={256}
        height={276}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (variant === "tablet") {
    // Tablet verze - obyčejný obrázek bez GridDistortion efektu
    return (
      <img
        src="/Portrait-512w.webp"
        alt="Hero portrait"
        className={`absolute bottom-0 w-5/6 lg:w-full min-[1024px]:max-[1279px]:w-full h-auto object-contain mx-auto left-0 right-0 ${className}`}
        width={512}
        height={552}
        loading="lazy"
        decoding="async"
        srcSet="/Portrait-256w.webp 256w, /Portrait-512w.webp 512w, /Portrait.webp 730w"
        sizes="(max-width: 768px) 256px, (max-width: 1024px) 400px, (min-width: 1280px) 600px, 512px"
      />
    );
  }

  // Desktop verze s GridDistortion efektem (pouze lg+)
  // Aspect ratio obrázku: 730/786 ≈ 0.929
  return (
    <div
      className={`absolute bottom-0 w-5/6 lg:w-full min-[1024px]:max-[1279px]:w-full mx-auto left-0 right-0 ${className}`}
      style={{ aspectRatio: "730/786" }}
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
        loadingDuration={2000}
        loadingStrength={0.3}
        loadingSpeed={3}
        loadingPattern="wave"
        initialDelay={800}
        className="w-full h-full"
      />
    </div>
  );
};

export default HeroPortrait;
