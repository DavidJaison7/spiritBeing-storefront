import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/products';
import './HeroSection.css';

interface HeroSectionProps {
  onNavigateShopCategory?: (sectionTarget?: string) => void;
  onNavigateHome?: () => void;
  onSelectProductByHandle?: (handle: string) => void;
}

const FOMO_ROTATE_MS = 7000;

const HERO_FOMO_DROPS = INITIAL_PRODUCTS.filter((product) => product.inStock).map((product) => ({
  handle: product.handle,
  thumb: product.image,
  title: product.title,
}));

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateShopCategory,
  onNavigateHome,
  onSelectProductByHandle,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFomoIndex, setActiveFomoIndex] = useState(0);
  const [isFomoPaused, setIsFomoPaused] = useState(false);
  const userWantsSoundRef = useRef(false);

  const activeFomoDrop = HERO_FOMO_DROPS[activeFomoIndex] ?? HERO_FOMO_DROPS[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    userWantsSoundRef.current = false;
    video.muted = true;
    video.volume = 0;
    setIsMuted(true);
    video.play().catch(() => {});
  }, []);

  /* Logo parallax while scrolling through hero */
  useEffect(() => {
    const section = sectionRef.current;
    const logo = logoRef.current;
    if (!section || !logo) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      const y = progress * 72;
      const scale = 1 - progress * 0.07;
      const opacity = 1 - progress * 0.35;
      logo.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
      logo.style.opacity = `${opacity}`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Mute when leaving hero; only restore if user explicitly enabled sound */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inHero = entry.isIntersecting && entry.intersectionRatio > 0.25;

        const video = videoRef.current;
        if (!video) return;

        if (!inHero) {
          video.muted = true;
          setIsMuted(true);
          return;
        }

        if (userWantsSoundRef.current) {
          video.muted = false;
          video.volume = 0.72;
          video.play().catch(() => {});
          setIsMuted(false);
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Rotate FOMO card through in-stock drops every 7s */
  useEffect(() => {
    if (HERO_FOMO_DROPS.length <= 1 || isFomoPaused) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveFomoIndex((prev) => (prev + 1) % HERO_FOMO_DROPS.length);
    }, FOMO_ROTATE_MS);

    return () => window.clearInterval(intervalId);
  }, [isFomoPaused]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    const enableSound = !userWantsSoundRef.current;
    userWantsSoundRef.current = enableSound;

    if (enableSound) {
      video.muted = false;
      video.volume = 0.72;
      video.play().catch(() => {
        video.muted = true;
        userWantsSoundRef.current = false;
        setIsMuted(true);
      });
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const scrollToShop = () => {
    const nextSection = document.getElementById('collections-carousel-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(nextSection);
      }
    }
  };

  const openActiveFomoDrop = () => {
    if (activeFomoDrop && onSelectProductByHandle) {
      onSelectProductByHandle(activeFomoDrop.handle);
      return;
    }

    onNavigateShopCategory?.('tshirts');
  };

  return (
    <section ref={sectionRef} id="hero-section" className="hero-video-section">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        defaultMuted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero-bg-video.mp4" type="video/mp4" />
      </video>

      <div className="hero-vignette-top" aria-hidden="true" />
      <div className="hero-vignette-radial" aria-hidden="true" />

      <div ref={logoRef} className="hero-logo-wrap">
        <button
          type="button"
          className="hero-logo-btn"
          onClick={() => onNavigateHome?.()}
          aria-label="Go to home"
        >
          <img
            src="/updated_main_logo.png"
            alt="Spirit Being"
            className="hero-logo"
            draggable={false}
          />
        </button>
      </div>

      <div className="hero-dock">
        <div className="hero-dock-inner">
          <div className="hero-dock-left">
            <button
              type="button"
              onClick={toggleSound}
              className="hero-sound-btn"
              aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
              aria-pressed={!isMuted}
            >
              {isMuted ? <VolumeX size={16} strokeWidth={1.75} /> : <Volume2 size={16} strokeWidth={1.75} />}
            </button>

            <p className="hero-dock-tagline">
              <span className="hero-dock-ticks" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </span>
              Faith. Identity. Purpose.
            </p>
          </div>

          <button type="button" onClick={scrollToShop} className="hero-shop-cta">
            <span className="hero-shop-cta-label">Shop now</span>
            <span className="hero-shop-cta-chevron" aria-hidden="true">
              ︾
            </span>
          </button>

          <button
            type="button"
            onClick={openActiveFomoDrop}
            className="hero-fomo-card"
            aria-label={activeFomoDrop ? `View ${activeFomoDrop.title}` : 'View the newest Spirit Beings drop'}
            onMouseEnter={() => setIsFomoPaused(true)}
            onMouseLeave={() => setIsFomoPaused(false)}
            onFocus={() => setIsFomoPaused(true)}
            onBlur={() => setIsFomoPaused(false)}
          >
            {activeFomoDrop ? (
              <>
                <div className="hero-fomo-thumb">
                  <img
                    key={activeFomoDrop.handle}
                    src={activeFomoDrop.thumb}
                    alt=""
                    draggable={false}
                    className="hero-fomo-thumb-img"
                  />
                </div>
                <div className="hero-fomo-copy">
                  <p key={`${activeFomoDrop.handle}-title`} className="hero-fomo-title">
                    {activeFomoDrop.title}
                  </p>
                  <span className="hero-fomo-cta">
                    View drip
                    <span className="hero-fomo-cta-chevron" aria-hidden="true">
                      ︾
                    </span>
                  </span>
                </div>
              </>
            ) : null}
          </button>
        </div>
      </div>
    </section>
  );
};
