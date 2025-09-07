import { useEffect } from 'react';
import type { FC } from 'react';

const SmoothScrollHandler: FC = () => {
  useEffect(() => {
    // Funkce pro smooth scroll s offsetem
    const scrollToElement = (targetId: string) => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Výška fixed navbaru (64px = h-16 v Tailwind)
        const navbarHeight = 64;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    };

    // Handler pro kliknutí na odkazy
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      
      // Kontrolujeme, jestli je to odkaz s hash
      if (target.tagName === 'A' && target.href) {
        try {
          const url = new URL(target.href);
          const currentUrl = new URL(window.location.href);
          
          // Pokud má odkaz hash fragment
          if (url.hash) {
            const targetId = url.hash.substring(1);
            
            // Nejdřív zkusíme najít element na aktuální stránce
            if (document.getElementById(targetId)) {
              // Element existuje na aktuální stránce - scroll k němu
              e.preventDefault();
              scrollToElement(targetId);
              return;
            }
            
            // Element neexistuje na aktuální stránce
            // Pokud odkaz míří na stejnou stránku, nekam nic nedělat (element prostě neexistuje)
            if (url.pathname === currentUrl.pathname) {
              // Element neexistuje na této stránce - necháme default behavior nebo neprovádíme nic
              return;
            }
            
            // Pokud odkaz míří na jinou stránku s hash - necháme browser navigovat
            // Hash routing bude zpracován při načtení cílové stránky
          }
        } catch (error) {
          // Pokud URL parsing selže, necháme default behavior
          console.warn('Error parsing URL in SmoothScrollHandler:', error);
        }
      }
    };

    // Handler pro hash routing při načtení stránky nebo změně hash
    const handleHashRouting = () => {
      const hash = window.location.hash;
      if (hash) {
        // Malé zpoždění pro zajištění, že je stránka načtená
        setTimeout(() => {
          const targetId = hash.substring(1);
          // Pokud element existuje na aktuální stránce, scroll k němu
          if (scrollToElement(targetId)) {
            // Element byl nalezen a scroll byl proveden
            return;
          }
          // Pokud element neexistuje na aktuální stránce a nejsme na hlavní stránce,
          // navigujeme na hlavní stránku (browser automaticky zachová hash)
          if (window.location.pathname !== '/') {
            window.location.href = `/${hash}`;
          }
        }, 100);
      }
    };

    // Event listeners
    document.addEventListener('click', handleSmoothScroll);
    window.addEventListener('hashchange', handleHashRouting);
    
    // Zpracování hash při prvním načtení stránky
    handleHashRouting();
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      window.removeEventListener('hashchange', handleHashRouting);
    };
  }, []);

  // Komponenta nevrací žádný JSX, pouze spravuje event listeners
  return null;
};

export default SmoothScrollHandler;