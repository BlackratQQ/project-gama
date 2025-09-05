import { lazy, Suspense, useEffect, useState } from 'react';
import SimpleLogo from './SimpleLogo';

const AnimatedLogo = lazy(() => import('./AnimatedLogo'));

export default function LazyAnimatedLogo() {
  const [shouldLoadAnimation, setShouldLoadAnimation] = useState(false);

  useEffect(() => {
    // Načte animaci až po úplném načtení stránky
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        setShouldLoadAnimation(true);
      });
    } else {
      setTimeout(() => {
        setShouldLoadAnimation(true);
      }, 1000);
    }
  }, []);

  if (!shouldLoadAnimation) {
    return <SimpleLogo />;
  }

  return (
    <Suspense fallback={<SimpleLogo />}>
      <AnimatedLogo />
    </Suspense>
  );
}