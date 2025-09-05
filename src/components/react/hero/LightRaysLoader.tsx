import { lazy, Suspense } from 'react';

// Dynamic import pouze pro desktop/tablet - eliminuje bundle na mobilu
const LightRays = lazy(() => import('./LightRays'));

interface LightRaysLoaderProps {
  raysOrigin?: 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const LightRaysLoader: React.FC<LightRaysLoaderProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <LightRays {...props} />
    </Suspense>
  );
};

export default LightRaysLoader;