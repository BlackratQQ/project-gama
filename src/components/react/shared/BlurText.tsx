import { motion } from 'motion/react';
import type { FC } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  animateOn?: 'load' | 'view';
  onAnimationComplete?: () => void;
}

const BlurText: FC<BlurTextProps> = ({
  text,
  delay = 150,
  initialDelay = 0,
  animateBy = 'words',
  direction = 'top',
  className = '',
  animateOn = 'load',
  onAnimationComplete,
}) => {
  const segments = animateBy === 'words' ? text.split(' ') : text.split('');

  const getDirectionOffset = () => {
    switch (direction) {
      case 'top':
        return { y: -20, x: 0 };
      case 'bottom':
        return { y: 20, x: 0 };
      case 'left':
        return { x: -20, y: 0 };
      case 'right':
        return { x: 20, y: 0 };
      default:
        return { y: -20, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const animateProps =
    animateOn === 'view'
      ? {
          whileInView: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            x: 0,
          },
          viewport: { once: true, margin: '-50px' },
        }
      : {
          animate: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            x: 0,
          },
        };

  return (
    <div className={className}>
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            ...offset,
          }}
          {...animateProps}
          transition={{
            duration: 0.8,
            delay: initialDelay / 1000 + index * (delay / 1000),
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={index === segments.length - 1 ? onAnimationComplete : undefined}
          className={animateBy === 'words' ? 'inline-block' : 'inline'}
          style={{
            marginRight: animateBy === 'words' ? '0.25em' : '0',
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
