// Performance-optimized LightRays manager s user interaction triggering

interface LightRaysConfig {
  raysOrigin: 'top-center';
  raysColor: string;
  raysSpeed: number;
  lightSpread: number;
  rayLength: number;
  followMouse: boolean;
  mouseInfluence: number;
  noiseAmount: number;
  distortion: number;
  className: string;
}

class LightRaysManager {
  private container: HTMLElement | null = null;
  private isLoaded = false;
  private hasUserInteracted = false;
  private config: LightRaysConfig;

  constructor(config: LightRaysConfig) {
    this.config = config;
    this.init();
  }

  private init() {
    // Pouze desktop/tablet detection
    if (!this.shouldLoadLightRays()) {
      console.log('LightRays: Not loading - failed shouldLoadLightRays check');
      return;
    }

    this.container = document.getElementById('lightrays-container');
    if (!this.container) {
      console.log('LightRays: Container not found');
      return;
    }

    console.log('LightRays: Setting up user interaction triggers');
    // User interaction triggering pro desktop performance
    this.setupUserInteractionTriggers();
  }

  private shouldLoadLightRays(): boolean {
    // Kontrola screen size - pouze desktop/tablet
    if (window.innerWidth < 768) {
      console.log('LightRays: Screen too small:', window.innerWidth);
      return false;
    }
    
    // Kontrola prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('LightRays: Reduced motion preference detected');
      return false;
    }
    
    // Kontrola WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.log('LightRays: WebGL not supported');
      return false;
    }
    
    console.log('LightRays: All checks passed, should load');
    return true;
  }

  private setupUserInteractionTriggers() {
    const triggers = [
      { event: 'mousemove', once: true },
      { event: 'scroll', once: true, passive: true },
      { event: 'touchstart', once: true, passive: true }
    ];

    const handleInteraction = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.loadLightRays();
      }
    };

    triggers.forEach(({ event, once, passive }) => {
      window.addEventListener(event, handleInteraction, { once, passive } as any);
    });

    // Fallback - auto-load po 3 sekundách pokud žádná interakce
    setTimeout(() => {
      if (!this.hasUserInteracted) {
        this.loadLightRays();
      }
    }, 3000);
  }

  private async loadLightRays() {
    if (this.isLoaded || !this.container) return;
    this.isLoaded = true;
    
    console.log('LightRays: Starting dynamic import...');

    try {
      // Dynamic import - bundle se načte pouze když je potřeba
      const { createElement } = await import('react');
      const { createRoot } = await import('react-dom/client');
      const { default: LightRaysLoader } = await import('../components/react/hero/LightRaysLoader');

      console.log('LightRays: Creating React root...');
      const root = createRoot(this.container);
      root.render(createElement(LightRaysLoader, this.config));
      console.log('LightRays: Component rendered!');
    } catch (error) {
      console.error('LightRays failed to load:', error);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('LightRays Manager initializing...');
  new LightRaysManager({
    raysOrigin: 'top-center',
    raysColor: '#ffffff',
    raysSpeed: 1.5,
    lightSpread: 1.4,
    rayLength: 3,
    followMouse: true,
    mouseInfluence: 0.1,
    noiseAmount: 0.1,
    distortion: 0.05,
    className: 'w-full h-full'
  });
});