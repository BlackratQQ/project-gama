import { motion } from 'motion/react';
import type { Transition, Easing } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import type { FC } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  animateBy?: 'words' | 'characters' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  animateOn?: 'load' | 'view';
  onAnimationComplete?: () => void;
  // Nové pokročilé vlastnosti
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  stepDuration?: number;
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText: FC<BlurTextProps> = ({
  text,
  delay = 150,
  initialDelay = 0,
  animateBy = 'words',
  direction = 'top',
  className = '',
  animateOn = 'view',
  onAnimationComplete,
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  stepDuration = 0.35,
}) => {
  // Zpětná kompatibilita pro 'characters'
  const normalizedAnimateBy = animateBy === 'characters' ? 'letters' : animateBy;
  const elements = normalizedAnimateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(animateOn === 'load');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animateOn === 'load') {
      setInView(true);
      return;
    }

    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, animateOn]);

  const getDirectionOffset = () => {
    switch (direction) {
      case 'top':
        return { y: -50, x: 0 };
      case 'bottom':
        return { y: 50, x: 0 };
      case 'left':
        return { x: -50, y: 0 };
      case 'right':
        return { x: 50, y: 0 };
      default:
        return { y: -50, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const defaultFrom = useMemo(
    () => ({
      filter: 'blur(10px)',
      opacity: 0,
      ...offset,
    }),
    [offset]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : direction === 'bottom' ? -5 : 0,
        x: direction === 'left' ? 5 : direction === 'right' ? -5 : 0,
      },
      { 
        filter: 'blur(0px)', 
        opacity: 1, 
        y: 0, 
        x: 0 
      }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <div ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (initialDelay + index * delay) / 1000,
          ease: easing
        };

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            className={normalizedAnimateBy === 'words' ? 'inline-block' : 'inline'}
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity',
              marginRight: '0',
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {normalizedAnimateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </div>
  );
};

export default BlurText;
