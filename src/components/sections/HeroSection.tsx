import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/products';
import './HeroSection.css';

const HERO_VIDEO_SRC = '/hero-video.webm';
const FOMO_ROTATE_MS = 7000;
const HERO_VOLUME = 0.72;

interface HeroSectionProps {
  onNavigateShopCategory?: (sectionTarget?: string) => void;
  onNavigateHome?: () => void;
  onSelectProductByHandle?: (handle: string) => void;
}

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
  const userWantsSoundRef = useRef(false);
  const heroVisibleRef = useRef(true);

  const [soundOn, setSoundOn] = useState(false);
  const [activeFomoIndex, setActiveFomoIndex] = useState(0);
  const [isFomoPaused, setIsFomoPaused] = useState(false);

  const activeFomoDrop = HERO_FOMO_DROPS[activeFomoIndex] ?? HERO_FOMO_DROPS[0];

  const syncVideoAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlayAudible = userWantsSoundRef.current && heroVisibleRef.current;
    video.volume = HERO_VOLUME;
    video.muted = !shouldPlayAudible;
  }, []);

  const startHeroPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = true;
    video.playsInline = true;
    syncVideoAudio();

    try {
      await video.play();
    } catch {
      // Browser autoplay policy requires muted playback without user gesture
      video.muted = true;
      try {
        await video.play();
      } catch {
        // Silently catch
      }
    }
  }, [syncVideoAudio]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = true;
    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = HERO_VOLUME;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    void startHeroPlayback();

    // Guard against video pausing at loop boundary
    const handleEnded = () => {
      video.currentTime = 0;
      void video.play().catch(() => {});
    };

    const retryOnReady = () => {
      syncVideoAudio();
      void video.play().catch(() => {});
    };

    const handleVisibility = () => {
      if (!document.hidden && heroVisibleRef.current) {
        void video.play().catch(() => {});
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', retryOnReady, { once: true });
    video.addEventListener('canplay', retryOnReady, { once: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', retryOnReady);
      video.removeEventListener('canplay', retryOnReady);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [startHeroPlayback, syncVideoAudio]);

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

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inHero = entry.isIntersecting && entry.intersectionRatio > 0.25;
        heroVisibleRef.current = inHero;

        if (!inHero) {
          video.pause();
          syncVideoAudio();
          return;
        }

        syncVideoAudio();
        void video.play().catch(() => {});
      },
      { threshold: [0, 0.25, 0.5] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [syncVideoAudio]);

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

    const next = !userWantsSoundRef.current;
    userWantsSoundRef.current = next;
    setSoundOn(next);
    syncVideoAudio();
    void video.play().catch(() => {});
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
      <div className="hero-video-stack" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video-layer is-active"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
        />
      </div>

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
            src="/updated_main_logo.webp"
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
              className={`hero-sound-btn${soundOn ? ' is-on' : ''}`}
              aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
              aria-pressed={soundOn}
            >
              {soundOn ? <Volume2 size={16} strokeWidth={1.75} /> : <VolumeX size={16} strokeWidth={1.75} />}
            </button>

            <p className="hero-dock-tagline">Faith. Identity. Purpose.</p>
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
