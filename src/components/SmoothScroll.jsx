import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

// Ensure GSAP ScrollTrigger plugin is registered
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Instantiate Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger & AOS
    const handleScroll = () => {
      ScrollTrigger.update();
      if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
        AOS.refresh();
      }
    };
    lenis.on('scroll', handleScroll);

    // Bind Lenis animation frame loop directly to GSAP's ticker
    const updateTicker = (time) => {
      // gsap ticker gives seconds, Lenis raf expects milliseconds
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // Turn off lag smoothing in GSAP to prevent jumps during intense scrub animations
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll support for in-page anchor links (e.g., #game, #cards, #waitlist)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 1.2,
            immediate: false,
          });
        }
      } catch {
        // Fallback gracefully if selector is invalid
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Refresh ScrollTrigger to ensure trigger bounds are accurately calculated
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, []);

  return children;
}

