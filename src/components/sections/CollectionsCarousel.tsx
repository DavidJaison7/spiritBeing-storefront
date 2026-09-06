import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Product } from '../../types';
import './CollectionsCarousel.css';

interface SlideData {
  num: string;
  title: string;
  desc: string;
  verse: string;
  price: string;
  bgImg: string;
  modelImg: string;
  fillColor: string;
}

const SLIDES: SlideData[] = [
  {
    num: "01 — 06",
    title: "The Spirit\nGives Life",
    desc: "The letter kills. The Spirit raises what was dead.",
    verse: "2 Corinthians 3:6",
    price: "₹899.00",
    bgImg: "/carousel-bg-1.jpeg",
    modelImg: "/carousel-pngs/image 1886.png",
    fillColor: '#0B3DFF',
  },
  {
    num: "02 — 06",
    title: "Spirit\nBeing",
    desc: "Faith, identity, and kingdom purpose defined.",
    verse: "Romans 8:16",
    price: "₹899.00",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 1998.png",
    fillColor: '#1A2FA8',
  },
  {
    num: "03 — 06",
    title: "New\nCreation",
    desc: "The old has passed away; behold, the new has come.",
    verse: "2 Corinthians 5:17",
    price: "₹899.00",
    bgImg: "/carousel-pngs/new-creation-bg-acidwash.png",
    modelImg: "/carousel-pngs/new-creation-model-acidwash.png",
    fillColor: '#2E2E2E',
  },
  {
    num: "04 — 06",
    title: "Fear\nNot",
    desc: "The Lion stands with the lamb. You are never alone.",
    verse: "Isaiah 41:10",
    price: "₹899.00",
    bgImg: "/carousel-bg-4.jpeg",
    modelImg: "/carousel-pngs/image 2003-1.png",
    fillColor: '#E8E4DC',
  },
  {
    num: "05 — 06",
    title: "Holy\nSpirit",
    desc: "The same Spirit who raised Christ lives in you.",
    verse: "Romans 8:11",
    price: "₹899.00",
    bgImg: "/carousel-bg-5.jpeg",
    modelImg: "/carousel-pngs/image 2003.png",
    fillColor: '#1550E8',
  },
  {
    num: "06 — 06",
    title: "Christ\nGenerations",
    desc: "Led by the Spirit. Becoming more like Christ.",
    verse: "Romans 8:14",
    price: "₹899.00",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 2126.png",
    fillColor: '#0B3DFF',
  },
];

interface CollectionsCarouselProps {
  onSelectProductByHandle?: (handle: string) => void;
  products?: Product[];
}

const PRODUCT_HANDLES = [
  'the-spirit-gives-life-tee',
  'spirit-being-graffiti-tee',
  'new-creation-oversized-tee',
  'fear-not-gold-lion-tee',
  'holy-spirit-dove-tee',
  'christ-generations-tee'
];

export const CollectionsCarousel: React.FC<CollectionsCarouselProps> = ({
  onSelectProductByHandle,
  products = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wishlistActive, setWishlistActive] = useState<boolean[]>([false, false, false, false, false, false]);

  const curRef = useRef<number>(0);
  const transitionRef = useRef<((next: number) => void) | null>(null);
  const goToSlideRef = useRef<((next: number) => void) | null>(null);

  const toggleWishlist = (idx: number) => {
    setWishlistActive(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Preload all slide images immediately on mount so transitions are instant (no lazy-load latency)
  useEffect(() => {
    SLIDES.forEach((slide) => {
      [slide.bgImg, slide.modelImg].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panels = Array.from(el.querySelectorAll('.panel')) as HTMLDivElement[];
    const texts = Array.from(el.querySelectorAll('.txt')) as HTMLDivElement[];
    const steps = Array.from(el.querySelectorAll('.step')) as HTMLDivElement[];
    const railNum = el.querySelector<HTMLElement>('#railNum');
    const liquidFill = el.querySelector<HTMLElement>('.liquid-fill');
    const frame = el.querySelector<HTMLDivElement>('#frame');
    const bobs = Array.from(el.querySelectorAll('.bob')) as HTMLDivElement[];

    curRef.current = 0;
    let tl: gsap.core.Timeline | null = null;
    let mmListener: ((e: MouseEvent) => void) | null = null;
    let bobAnimation: gsap.core.Tween[] = [];
    // Track when each slide was entered — prevents auto-snap on the same wheel event that arrived at slide 6
    let slideArrivedAt = Date.now();

    function setRail(i: number) {
      if (railNum) railNum.textContent = String(i + 1).padStart(2, '0');
    }

    setRail(0);

    const swapSlide = (next: number) => {
      panels.forEach((panel, index) => {
        panel.classList.toggle('active', index === next);
        panel.style.zIndex = index === next ? '2' : '1';
      });
      texts.forEach((text, index) => {
        text.classList.toggle('active', index === next);
      });
    };

    const instantTransition = (next: number) => {
      if (next === curRef.current) return;
      curRef.current = next;
      slideArrivedAt = Date.now();
      swapSlide(next);
      if (liquidFill) gsap.set(liquidFill, { scaleY: 0 });
      setRail(next);
    };

    if (reduced) {
      transitionRef.current = instantTransition;
    } else {
      const FILL_DUR = 0.36;
      const DRAIN_DUR = 0.36;
      const EASE = 'power2.inOut';

      const transition = (next: number) => {
        if (next === curRef.current) return;
        if (tl) tl.progress(1);
        slideArrivedAt = Date.now();

        const outP = panels[curRef.current];
        const inP = panels[next];
        const outT = texts[curRef.current];
        const inT = texts[next];

        if (!inP || !outP || !inT || !outT || !liquidFill) return;

        const fillColor = SLIDES[next].fillColor;
        curRef.current = next;

        inP.style.zIndex = '2';
        outP.style.zIndex = '1';

        tl = gsap.timeline({
          onComplete() {
            swapSlide(next);
            gsap.set(liquidFill, { scaleY: 0, clearProps: 'transform,backgroundColor' });
            gsap.set(outT.children, { clearProps: 'all' });
            tl = null;
          },
        });

        tl.to(outT.children, {
          opacity: 0,
          duration: 0.16,
          stagger: 0.02,
          ease: 'power2.in',
        }, 0);

        gsap.set(liquidFill, {
          scaleY: 0,
          transformOrigin: 'bottom center',
          backgroundColor: fillColor,
        });

        tl.to(liquidFill, { scaleY: 1, duration: FILL_DUR, ease: EASE }, 0);

        tl.call(() => {
          outP.classList.remove('active');
          inP.classList.add('active');
          outT.classList.remove('active');
          inT.classList.add('active');
        }, [], FILL_DUR);

        tl.fromTo(
          inT.children,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, stagger: 0.04, ease: 'power2.out' },
          FILL_DUR + 0.04,
        );

        tl.set(liquidFill, { transformOrigin: 'top center' }, FILL_DUR);
        tl.to(liquidFill, { scaleY: 0, duration: DRAIN_DUR, ease: EASE }, FILL_DUR);

        setRail(next);
      };

      transitionRef.current = transition;

      if (panels[0] && liquidFill) {
        gsap.set(liquidFill, {
          scaleY: 1,
          transformOrigin: 'top center',
          backgroundColor: SLIDES[0].fillColor,
        });
        gsap.to(liquidFill, { scaleY: 0, duration: 0.95, ease: EASE, delay: 0.12 });
      }

      if (texts[0]) {
        gsap.fromTo(
          texts[0].children,
          { opacity: 0 },
          { opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power2.out', delay: 0.35 },
        );
      }

      if (frame) {
        const qx = gsap.quickTo(frame, 'x', { duration: 0.8, ease: 'power3.out' });
        const flElements = Array.from(el.querySelectorAll('.fl')) as HTMLDivElement[];
        const qfl = flElements.map((flEl) => gsap.quickTo(flEl, 'x', { duration: 1.1, ease: 'power3.out' }));

        mmListener = (e: MouseEvent) => {
          const n = (e.clientX / window.innerWidth) - 0.5;
          qx(n * 10);
          qfl.forEach((q) => q(n * 22));
        };

        window.addEventListener('mousemove', mmListener);
      }

      bobs.forEach((b, i) => {
        const tween = gsap.fromTo(
          b,
          { y: -12 },
          {
            y: 12,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.45,
          },
        );
        bobAnimation.push(tween);
      });
    }


    // ──────────────────────────────────────────────────────────────
    // SNAP NAVIGATION — Lenis-based, behaves like scroll-snap-mandatory
    // Transitions:
    //   A) Hero  →  Carousel Slide 1  (any scroll-down from Hero)
    //   B) Carousel Slide 1  →  Hero  (any scroll-up from Slide 1)
    //   C) Carousel Slide 6  →  StatementParticles  (any scroll-down from Slide 6)
    // ──────────────────────────────────────────────────────────────
    let snapCooldown = false;
    let touchStartY = 0;

    const heroHeight = (): number => {
      const hero = document.getElementById('hero-section') ?? document.querySelector('section.relative.h-screen') as HTMLElement | null;
      return hero ? hero.offsetHeight : window.innerHeight;
    };

    const getScrollY = (): number => {
      const lenis = (window as any).lenis;
      return lenis ? lenis.scroll : window.scrollY;
    };

    const carouselTop = (): number => {
      const rect = el.getBoundingClientRect();
      return getScrollY() + rect.top;
    };

    const isInCarouselZone = (scrollY: number, heroH: number, vh: number): boolean => {
      const top = carouselTop();
      const bottom = top + el.offsetHeight - vh * 0.35;
      return scrollY >= top - 40 && scrollY <= bottom && scrollY >= heroH * 0.45;
    };

    const snapTo = (target: HTMLElement | number, onComplete?: () => void) => {
      if (snapCooldown) return false;
      snapCooldown = true;

      const release = () => {
        snapCooldown = false;
        onComplete?.();
      };

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 0.82,
          easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
          lock: true,
          onComplete: release,
        });
      } else {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(release, 900);
      }
      return true;
    };

    const goToSlide = (next: number) => {
      if (next === curRef.current || snapCooldown) return;
      if (next < 0 || next >= steps.length) return;

      const targetStep = steps[next];
      if (!targetStep) return;

      snapCooldown = true;
      if (transitionRef.current) {
        transitionRef.current(next);
      } else {
        curRef.current = next;
        setRail(next);
      }

      const release = () => { snapCooldown = false; };
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetStep, {
          duration: 0.82,
          easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
          lock: true,
          onComplete: release,
        });
      } else {
        targetStep.scrollIntoView({ behavior: 'smooth' });
        setTimeout(release, 900);
      }
    };

    goToSlideRef.current = goToSlide;

    const handleSnapWheel = (e: WheelEvent) => {
      if (snapCooldown) {
        e.preventDefault();
        return;
      }

      const scrollY = getScrollY();
      const heroH = heroHeight();
      const vh = window.innerHeight;
      const scrollingDown = e.deltaY > 4;
      const scrollingUp = e.deltaY < -4;
      if (!scrollingDown && !scrollingUp) return;

      // A) Hero → Carousel Slide 1
      if (scrollingDown && scrollY < heroH * 0.9) {
        e.preventDefault();
        goToSlide(0);
        return;
      }

      // B) Carousel Slide 1 → Hero
      if (scrollingUp && curRef.current === 0 && scrollY >= heroH * 0.5 && scrollY < heroH + 80) {
        e.preventDefault();
        snapTo(0);
        return;
      }

      // Within carousel: one wheel tick = exactly one slide
      if (isInCarouselZone(scrollY, heroH, vh)) {
        e.preventDefault();

        if (scrollingDown) {
          if (curRef.current < steps.length - 1) {
            goToSlide(curRef.current + 1);
            return;
          }

          // C) Slide 6 → Statement (dwell guard)
          if (curRef.current === steps.length - 1 && Date.now() - slideArrivedAt >= 800) {
            const stmtSection = document.getElementById('sbStatement');
            if (stmtSection && stmtSection.getBoundingClientRect().top > 50) {
              snapTo(stmtSection);
            }
          }
          return;
        }

        if (scrollingUp) {
          if (curRef.current > 0) {
            goToSlide(curRef.current - 1);
          } else {
            snapTo(0);
          }
          return;
        }
      }

      // D) StatementParticles → Carousel Slide 6
      if (scrollingUp && scrollY >= heroH + 5.8 * vh && scrollY <= heroH + 6.2 * vh) {
        e.preventDefault();
        goToSlide(steps.length - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (snapCooldown) return;

      const deltaY = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(deltaY) < 40) return;

      const scrollY = getScrollY();
      const heroH = heroHeight();
      const vh = window.innerHeight;
      const swipingUp = deltaY > 0;
      const swipingDown = deltaY < 0;

      // A) Hero → Carousel Slide 1
      if (swipingUp && scrollY < heroH * 0.9) {
        goToSlide(0);
        return;
      }

      // B) Carousel Slide 1 → Hero
      if (swipingDown && curRef.current === 0 && scrollY >= heroH * 0.5 && scrollY < heroH + 80) {
        snapTo(0);
        return;
      }

      if (isInCarouselZone(scrollY, heroH, vh)) {
        if (swipingUp) {
          if (curRef.current < steps.length - 1) {
            goToSlide(curRef.current + 1);
            return;
          }

          if (curRef.current === steps.length - 1 && Date.now() - slideArrivedAt >= 800) {
            const stmtSection = document.getElementById('sbStatement');
            if (stmtSection && stmtSection.getBoundingClientRect().top > 50) {
              snapTo(stmtSection);
            }
          }
          return;
        }

        if (swipingDown) {
          if (curRef.current > 0) {
            goToSlide(curRef.current - 1);
          } else {
            snapTo(0);
          }
        }
        return;
      }

      // D) Statement → Slide 6
      if (swipingDown && scrollY >= heroH + 5.8 * vh && scrollY <= heroH + 6.2 * vh) {
        goToSlide(steps.length - 1);
      }
    };

    window.addEventListener('wheel', handleSnapWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleSnapWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (mmListener) window.removeEventListener('mousemove', mmListener);
      bobAnimation.forEach((tween) => tween.kill());
      transitionRef.current = null;
      goToSlideRef.current = null;
      if (tl) tl.kill();
    };
  }, []);

  const handleNextClick = () => {
    if (curRef.current < SLIDES.length - 1) {
      handleDotClick(curRef.current + 1);
      return;
    }
    const stmtSection = document.getElementById('sbStatement');
    if (!stmtSection) return;
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(stmtSection, { duration: 0.82, lock: true });
    } else {
      stmtSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDotClick = (idx: number) => {
    if (idx === curRef.current) return;
    goToSlideRef.current?.(idx);
  };

  useEffect(() => {
    const onNavigateSlide = (event: Event) => {
      const slideIndex = (event as CustomEvent<{ slideIndex?: number }>).detail?.slideIndex;
      if (typeof slideIndex === 'number') {
        handleDotClick(slideIndex);
      }
    };

    window.addEventListener('sb-go-to-collection-slide', onNavigateSlide);
    return () => window.removeEventListener('sb-go-to-collection-slide', onNavigateSlide);
  }, []);

  return (
    <div className="collections-carousel-wrapper" id="collections-section" ref={containerRef}>
      {/* Sticky Stage Container */}
      <div className="stage">
        {/* Frame Section with Background & Model overlays */}
        <div
          className="frame cursor-pointer"
          id="frame"
          onClick={() => onSelectProductByHandle?.(PRODUCT_HANDLES[curRef.current])}
        >
          <span className="findex flex items-center justify-center pointer-events-none" id="findex" style={{ mixBlendMode: 'normal' }}>
            <img src="/img_logo_white.png" alt="Spirit Being Logo" className="h-9 md:h-11 w-auto object-contain drop-shadow-md" />
          </span>

          {SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`panel ${idx === 0 ? 'active' : ''} cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProductByHandle?.(PRODUCT_HANDLES[idx]);
              }}
              title={`View ${slide.title.replace('\n', ' ')}`}
            >
              <div className="ph">
                <img src={slide.bgImg} alt={`Collection piece background ${idx + 1}`} loading={idx === 0 ? 'eager' : 'eager'} decoding="async" fetchPriority={idx < 2 ? 'high' : 'auto'} />
              </div>
              <div className="fl">
                <div className="bob">
                  <img
                    className={`model ${idx === 1 ? 'model-slide-2' : idx === 2 ? 'model-slide-3' : idx === 3 ? 'model-extra-large' : idx >= 4 ? 'model-large' : ''}`}
                    src={slide.modelImg}
                    alt={`Collection model overlay ${idx + 1}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority={idx < 2 ? 'high' : 'auto'}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="liquid-fill" aria-hidden="true" />
        </div>

        {/* Content Section containing details per slide */}
        <div className="content">
          {SLIDES.map((slide, idx) => {
            const product = products.find(p => p.handle === PRODUCT_HANDLES[idx]);
            const isSoldOut = product ? !product.inStock : false;
            return (
              <div key={idx} className={`txt ${idx === 0 ? 'active' : ''}`}>
                <div className="num-badge">
                  <span className="num-badge-dot" aria-hidden="true" />
                  <span className="num-badge-brand">SB</span>
                  <span className="num-badge-label">Special Edition</span>
                </div>
                <h2>
                  {slide.title.split('\n').map((line, lIdx) => (
                    <span key={lIdx} className="title-part">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="desc">{slide.desc}</p>
                <p className="verse">{slide.verse}</p>
                <div className="price flex items-center gap-3">
                  {slide.price}
                  {isSoldOut && (
                    <span className="text-[10px] font-sans font-extrabold text-[#FF3E3E] tracking-widest uppercase border border-[#FF3E3E]/40 px-2.5 py-0.5 rounded bg-[#FF3E3E]/10 select-none shadow-[0_0_10px_rgba(255,62,62,0.15)]">
                      Sold Out
                    </span>
                  )}
                </div>
              <div className="actions">
                <button
                  onClick={() => onSelectProductByHandle?.(PRODUCT_HANDLES[idx])}
                  className="view cursor-pointer"
                  type="button"
                >
                  View Piece <span>&#8594;</span>
                </button>
                <button
                  className={`wish ${wishlistActive[idx] ? 'active' : ''}`}
                  onClick={() => toggleWishlist(idx)}
                  type="button"
                >
                  <span className="heart">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21s-7.5-4.9-10-9.2C.4 8.4 2.2 4.5 6 4.5c2.2 0 3.6 1.2 4.5 2.6.4.6.7 1.2 1.5 1.2s1.1-.6 1.5-1.2c.9-1.4 2.3-2.6 4.5-2.6 3.8 0 5.6 3.9 4 7.3-2.5 4.3-10 9.2-10 9.2z" />
                    </svg>
                  </span>
                  <span className="label">
                    {wishlistActive[idx] ? 'Liked' : 'Drop Like'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        </div>

        {/* Bottom nav — count left, paired arrow CTAs right */}
        <nav className="rail" aria-label="Collection slides">
          <span className="rail-count" aria-live="polite">
            <b id="railNum">01</b>
            <span className="rail-count-total">/{String(SLIDES.length).padStart(2, '0')}</span>
          </span>

          <div className="rail-arrows">
            <button
              type="button"
              className="rail-arrow-btn rail-arrow-btn--prev"
              onClick={() => handleDotClick(Math.max(0, curRef.current - 1))}
              aria-label="Previous piece"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              type="button"
              className="rail-arrow-btn rail-arrow-btn--next"
              onClick={handleNextClick}
              aria-label="Next piece"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Six Scroll target elements to drive sticky animations (positioned absolutely) */}
      <div className="step" style={{ top: '0vh' }}></div>
      <div className="step" style={{ top: '100vh' }}></div>
      <div className="step" style={{ top: '200vh' }}></div>
      <div className="step" style={{ top: '300vh' }}></div>
      <div className="step" style={{ top: '400vh' }}></div>
      <div className="step" style={{ top: '500vh' }}></div>
    </div>
  );
};
