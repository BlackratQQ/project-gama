import { motion } from 'motion/react';
import type { FC, ReactNode } from 'react';

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  initialOpacity?: number;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const FadeContent: FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 600,
  easing = 'ease-out',
  initialOpacity = 0,
  delay = 0,
  direction = 'top',
  className = '',
}) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'top':
        return { y: -30, x: 0 };
      case 'bottom':
        return { y: 30, x: 0 };
      case 'left':
        return { x: -30, y: 0 };
      case 'right':
        return { x: 30, y: 0 };
      default:
        return { y: -30, x: 0 };
    }
  };

  const offset = getDirectionOffset();
  return (
    <motion.div
      initial={{
        opacity: initialOpacity,
        filter: blur ? 'blur(20px)' : 'blur(0px)',
        ...offset,
      }}
      whileInView={{
        opacity: 1,
        filter: blur ? 'blur(0px)' : 'blur(0px)',
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: easing === 'ease-out' ? [0.16, 1, 0.3, 1] : 'easeInOut',
        filter: {
          duration: (duration / 1000) * 1.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
