import { motion } from 'motion/react';
import type { FC } from 'react';

const AnimatedLogo: FC = () => {
  return (
    <div className="logo-container">
      <a href="/" className="flex items-center">
        <motion.img
          id="navbar-logo"
          src="/NewLogo.svg"
          alt="VK Logo"
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
          }}
          animate={{
            filter: 'blur(0px)',
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-20 w-auto transition-all duration-300 mt-6 hover:cursor-pointer logo-pulse"
          style={{
            willChange: 'filter, opacity',
          }}
        />
      </a>
    </div>
  );
};

export default AnimatedLogo;
