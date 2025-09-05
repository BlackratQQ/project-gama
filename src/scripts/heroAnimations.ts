// Performance-optimized Hero word-by-word animations with Intersection Observer

class HeroAnimationsManager {
  private observer: IntersectionObserver | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    // Čekáme na načtení DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      this.setupAnimations();
    }
  }

  private setupAnimations() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Kontrola prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showAllElements();
      return;
    }

    // Nejprve processujeme texty na slova
    this.processTextAnimations();

    // Pak vytvoříme Intersection Observer
    this.createObserver();

    console.log('Hero Animations: Word-by-word animations initialized');
  }

  private processTextAnimations() {
    // Najít všechny elementy s class="hero-text-animated"
    const textElements = document.querySelectorAll('.hero-text-animated');
    
    textElements.forEach((element) => {
      this.wrapWordsInSpans(element as HTMLElement);
    });
  }

  private wrapWordsInSpans(element: HTMLElement) {
    const text = element.textContent || '';
    const words = text.split(/\s+/).filter(word => word.trim()); // Pouze slova, bez mezer
    
    // Vyčisti obsah elementu
    element.innerHTML = '';
    
    words.forEach((word, index) => {
      // Vytvoř span pro slovo
      const span = document.createElement('span');
      span.className = 'hero-word';
      span.textContent = word;
      span.style.setProperty('--word-index', index.toString());
      element.appendChild(span);
    });
  }

  private createObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Pokud má word animace, animuj slova postupně
            const words = element.querySelectorAll('.hero-word');
            if (words.length > 0) {
              this.animateWords(words, element);
            } else {
              // Fallback pro elementy bez word animací
              element.classList.add('hero-animate-visible');
            }
            
            this.observer?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Najít všechny elementy k animování
    const textElements = document.querySelectorAll('.hero-text-animated');
    const regularElements = document.querySelectorAll('.hero-animate');
    
    // Sledovat text elementy
    textElements.forEach((element) => {
      this.observer?.observe(element);
    });
    
    // Sledovat regular elementy
    regularElements.forEach((element) => {
      this.observer?.observe(element);
    });

    console.log(`Hero Animations: Observing ${textElements.length + regularElements.length} elements`);
  }

  private animateWords(words: NodeListOf<Element>, container: HTMLElement) {
    // Získat base delay z container elementu nebo použít default
    const baseDelayAttr = container.getAttribute('data-base-delay');
    const baseDelay = baseDelayAttr ? parseInt(baseDelayAttr, 10) : 0;
    
    // Získat word delay z container elementu nebo použít default
    const wordDelayAttr = container.getAttribute('data-word-delay');  
    const wordDelay = wordDelayAttr ? parseInt(wordDelayAttr, 10) : 150;

    words.forEach((word, index) => {
      setTimeout(() => {
        (word as HTMLElement).classList.add('animate');
      }, baseDelay + (index * wordDelay));
    });
  }

  private showAllElements() {
    // Fallback pro reduced motion - zobraz všechny elementy ihned
    const textElements = document.querySelectorAll('.hero-text-animated .hero-word');
    const regularElements = document.querySelectorAll('.hero-animate');
    
    textElements.forEach((element) => {
      (element as HTMLElement).classList.add('animate');
    });
    
    regularElements.forEach((element) => {
      (element as HTMLElement).classList.add('hero-animate-visible');
    });
    
    console.log('Hero Animations: Reduced motion - showing all elements immediately');
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isInitialized = false;
  }
}

// Auto-initialize
let heroAnimationsInstance: HeroAnimationsManager | null = null;

if (typeof window !== 'undefined') {
  heroAnimationsInstance = new HeroAnimationsManager();
}

// Export pro případné manuální řízení
export { HeroAnimationsManager };