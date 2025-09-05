import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SiOpenai,
  SiCss3,
  SiFigma,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiPhp,
  SiReact,
  SiTailwindcss,
  SiWordpress,
  SiAstro,
  SiClaude,
} from 'react-icons/si';
import Threads from '../shared/Threads';

export type LogoItem = {
  node: React.ReactNode;
  title?: string;
  ariaLabel?: string;
};

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined);

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, dependencies);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, dependencies);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover]);
};

export const LogoLoop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = 'Partner logos',
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState<number>(0);
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover);

    const cssVariables = useMemo(
      () =>
        ({
          '--logoloop-gap': `${gap}px`,
          '--logoloop-logoHeight': `${logoHeight}px`,
          ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
        }) as React.CSSProperties,
      [gap, logoHeight, fadeOutColor]
    );

    const rootClasses = useMemo(
      () =>
        cx(
          'relative overflow-x-hidden group',
          '[--logoloop-gap:32px]',
          '[--logoloop-logoHeight:28px]',
          '[--logoloop-fadeColorAuto:#ffffff]',
          'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
          scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
          className
        ),
      [scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(
      (logoTitle?: string) => {
        if (pauseOnHover) setIsHovered(true);
        if (logoTitle) setHoveredLogo(logoTitle);
      },
      [pauseOnHover]
    );

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
      setHoveredLogo(null);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: React.Key) => {
        const isItemHovered = hoveredLogo === item.title;

        const content = (
          <div className="relative">
            <span
              className={cx(
                'inline-flex items-center text-white hover:text-orange-500 transition-colors duration-300',
                'motion-reduce:transition-none',
                scaleOnHover &&
                  'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120',
                isItemHovered && 'text-orange-500'
              )}
              aria-hidden={!!item.ariaLabel}
            >
              {item.node}
            </span>
            {isItemHovered && item.title && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap z-20 shadow-lg">
                {item.title}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
              </div>
            )}
          </div>
        );

        return (
          <li
            className={cx(
              'flex-none mr-[var(--logoloop-gap)] text-[length:var(--logoloop-logoHeight)] leading-[1]',
              scaleOnHover && 'overflow-visible group/item'
            )}
            key={key}
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
          >
            {content}
          </li>
        );
      },
      [scaleOnHover, hoveredLogo, handleMouseEnter, handleMouseLeave]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="flex items-center"
            key={`copy-${copyIndex}`}
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      (): React.CSSProperties => ({
        width: toCssLength(width) ?? '100%',
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style]
    );

    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
      >
        {fadeOut && (
          <>
            <div
              aria-hidden
              className={cx(
                'pointer-events-none absolute inset-y-0 left-0 z-[1]',
                'w-[clamp(24px,8%,120px)]',
                'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
              )}
            />
            <div
              aria-hidden
              className={cx(
                'pointer-events-none absolute inset-y-0 right-0 z-[1]',
                'w-[clamp(24px,8%,120px)]',
                'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
              )}
            />
          </>
        )}

        <div
          className={cx(
            'flex w-max will-change-transform select-none',
            'motion-reduce:transform-none'
          )}
          ref={trackRef}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

// Tech logos data
const techLogos: LogoItem[] = [
  {
    node: <SiOpenai className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'OpenAI',
  },
  {
    node: <SiCss3 className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'CSS',
  },
  {
    node: <SiFigma className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'Figma',
  },
  {
    node: <SiClaude className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'Claude',
  },
  {
    node: <SiHtml5 className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'HTML',
  },
  {
    node: <SiJavascript className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'JavaScript',
  },
  {
    node: <SiNextdotjs className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'Next.js',
  },
  {
    node: <SiPhp className="w-40 h-40 lg:w-42 lg:h-42" />,
    title: 'PHP',
  },
  {
    node: <SiReact className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'React.js',
  },
  {
    node: <SiTailwindcss className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'Tailwind CSS',
  },
  {
    node: <SiWordpress className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'WordPress',
  },
  {
    node: <SiAstro className="w-20 h-20 lg:w-26 lg:h-26" />,
    title: 'Astro',
  },
];

// Default export with pre-configured props
export default function TechStackLogoLoop() {
  return (
    <div className="w-full relative">
      <div className="pt-16 relative z-20">
        <div className="absolute left-0 top-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
        <div className="transform -rotate-3">
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={80}
            gap={256}
            pauseOnHover={true}
            scaleOnHover={false}
            fadeOut={false}
            ariaLabel="Technology stack logos"
            className="w-full"
          />
        </div>
      </div>

      <div className="w-full h-[400px] relative transform -rotate-3 -translate-y-[200px]">
        <Threads color={[1, 1, 1]} amplitude={1.5} distance={0} enableMouseInteraction={true} />
      </div>
    </div>
  );
}
