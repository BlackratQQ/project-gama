import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface AutomatizaceServicesBentoEffectsProps {
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const AutomatizaceServicesBentoEffects: React.FC<AutomatizaceServicesBentoEffectsProps> = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Efekt pro aplikaci animací na existující SSR karty
  useEffect(() => {
    if (shouldDisableAnimations) return;

    const cards = document.querySelectorAll('.automatizace-services-card');

    cards.forEach((card) => {
      const element = card as HTMLElement;

      // Přidání třídy pro border glow efekt
      if (enableBorderGlow) {
        element.classList.add('automatizace-services-card--border-glow');
      }

      // Particle efekty pro každou kartu
      if (enableStars) {
        const particlesRef: HTMLDivElement[] = [];
        const timeoutsRef: NodeJS.Timeout[] = [];
        const memoizedParticles: HTMLDivElement[] = [];
        let particlesInitialized = false;
        let isHovered = false;

        const initializeParticles = () => {
          if (particlesInitialized) return;

          const { width, height } = element.getBoundingClientRect();
          memoizedParticles.push(
            ...Array.from({ length: particleCount }, () =>
              createParticleElement(Math.random() * width, Math.random() * height, glowColor)
            )
          );
          particlesInitialized = true;
        };

        const clearAllParticles = () => {
          timeoutsRef.forEach(clearTimeout);
          timeoutsRef.length = 0;

          particlesRef.forEach((particle) => {
            gsap.to(particle, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'back.in(1.7)',
              onComplete: () => {
                particle.parentNode?.removeChild(particle);
              },
            });
          });
          particlesRef.length = 0;
        };

        const animateParticles = () => {
          if (!isHovered) return;

          if (!particlesInitialized) {
            initializeParticles();
          }

          memoizedParticles.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
              if (!isHovered) return;

              const clone = particle.cloneNode(true) as HTMLDivElement;
              element.appendChild(clone);
              particlesRef.push(clone);

              gsap.fromTo(
                clone,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
              );

              gsap.to(clone, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                rotation: Math.random() * 360,
                duration: 2 + Math.random() * 2,
                ease: 'none',
                repeat: -1,
                yoyo: true,
              });

              gsap.to(clone, {
                opacity: 0.3,
                duration: 1.5,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
              });
            }, index * 100);

            timeoutsRef.push(timeoutId);
          });
        };

        const handleMouseEnter = () => {
          isHovered = true;
          animateParticles();

          if (enableTilt) {
            gsap.to(element, {
              rotateX: 5,
              rotateY: 5,
              duration: 0.3,
              ease: 'power2.out',
              transformPerspective: 1000,
            });
          }
        };

        const handleMouseLeave = () => {
          isHovered = false;
          clearAllParticles();

          if (enableTilt) {
            gsap.to(element, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }

          if (enableMagnetism) {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!enableTilt && !enableMagnetism) return;

          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          if (enableTilt) {
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(element, {
              rotateX,
              rotateY,
              duration: 0.1,
              ease: 'power2.out',
              transformPerspective: 1000,
            });
          }

          if (enableMagnetism) {
            const magnetX = (x - centerX) * 0.05;
            const magnetY = (y - centerY) * 0.05;

            gsap.to(element, {
              x: magnetX,
              y: magnetY,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        };

        const handleClick = (e: MouseEvent) => {
          if (!clickEffect) return;

          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const maxDistance = Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
          );

          const ripple = document.createElement('div');
          ripple.style.cssText = `
            position: absolute;
            width: ${maxDistance * 2}px;
            height: ${maxDistance * 2}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
            left: ${x - maxDistance}px;
            top: ${y - maxDistance}px;
            pointer-events: none;
            z-index: 1000;
          `;

          element.appendChild(ripple);

          gsap.fromTo(
            ripple,
            {
              scale: 0,
              opacity: 1,
            },
            {
              scale: 1,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => ripple.remove(),
            }
          );
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('click', handleClick);
      }
    });

    // Globální spotlight efekt
    if (enableSpotlight) {
      const spotlight = document.createElement('div');
      spotlight.className = 'automatizace-services-global-spotlight';
      spotlight.style.cssText = `
        position: fixed;
        width: 800px;
        height: 800px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle,
          rgba(${glowColor}, 0.15) 0%,
          rgba(${glowColor}, 0.08) 15%,
          rgba(${glowColor}, 0.04) 25%,
          rgba(${glowColor}, 0.02) 40%,
          rgba(${glowColor}, 0.01) 65%,
          transparent 70%
        );
        z-index: 200;
        opacity: 0;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!spotlightRef.current) return;

        const section = document.querySelector('.automatizace-services-section');
        const rect = section?.getBoundingClientRect();
        const mouseInside =
          rect &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        isInsideSection.current = mouseInside || false;
        const cards = document.querySelectorAll('.automatizace-services-card');

        if (!mouseInside) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
          cards.forEach((card) => {
            (card as HTMLElement).style.setProperty('--glow-intensity', '0');
          });
          return;
        }

        const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
        let minDistance = Infinity;

        cards.forEach((card) => {
          const cardElement = card as HTMLElement;
          const cardRect = cardElement.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const distance =
            Math.hypot(e.clientX - centerX, e.clientY - centerY) -
            Math.max(cardRect.width, cardRect.height) / 2;
          const effectiveDistance = Math.max(0, distance);

          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          updateCardGlowProperties(
            cardElement,
            e.clientX,
            e.clientY,
            glowIntensity,
            spotlightRadius
          );
        });

        gsap.to(spotlightRef.current, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.8
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
              : 0;

        gsap.to(spotlightRef.current, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.2 : 0.5,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        isInsideSection.current = false;
        document.querySelectorAll('.automatizace-services-card').forEach((card) => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      };
    }
  }, [
    shouldDisableAnimations,
    enableStars,
    enableSpotlight,
    enableBorderGlow,
    spotlightRadius,
    particleCount,
    enableTilt,
    glowColor,
    clickEffect,
    enableMagnetism,
  ]);

  return (
    <>
      <style>
        {`
          .automatizace-services-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
          }
          
          .automatizace-services-card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .automatizace-services-card--border-glow:hover::after {
            opacity: 1;
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
        `}
      </style>
    </>
  );
};

export default AutomatizaceServicesBentoEffects;
