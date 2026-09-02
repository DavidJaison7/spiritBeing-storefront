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
  },
  {
    num: "02 — 06",
    title: "Spirit\nBeing",
    desc: "Faith, identity, and kingdom purpose defined.",
    verse: "Romans 8:16",
    price: "₹899.00",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 1998.png",
  },
  {
    num: "03 — 06",
    title: "New\nCreation",
    desc: "The old has passed away; behold, the new has come.",
    verse: "2 Corinthians 5:17",
    price: "₹899.00",
    bgImg: "/carousel-pngs/new-creation-bg-acidwash.png",
    modelImg: "/carousel-pngs/new-creation-model-acidwash.png",
  },
  {
    num: "04 — 06",
    title: "Fear\nNot",
    desc: "The Lion stands with the lamb. You are never alone.",
    verse: "Isaiah 41:10",
    price: "₹899.00",
    bgImg: "/carousel-bg-4.jpeg",
    modelImg: "/carousel-pngs/image 2003-1.png",
  },
  {
    num: "05 — 06",
    title: "Holy\nSpirit",
    desc: "The same Spirit who raised Christ lives in you.",
    verse: "Romans 8:11",
    price: "₹899.00",
    bgImg: "/carousel-bg-5.jpeg",
    modelImg: "/carousel-pngs/image 2003.png",
  },
  {
    num: "06 — 06",
    title: "Christ\nGenerations",
    desc: "Led by the Spirit. Becoming more like Christ.",
    verse: "Romans 8:14",
    price: "₹899.00",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 2126.png",
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
  const isDotJumpingRef = useRef<boolean>(false);
  const transitionRef = useRef<((next: number, dir: number) => void) | null>(null);

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
    const dots = Array.from(el.querySelectorAll('.dot')) as HTMLButtonElement[];
    const steps = Array.from(el.querySelectorAll('.step')) as HTMLDivElement[];
    const railNum = el.querySelector<HTMLElement>('#railNum');
    const hint = el.querySelector<HTMLElement>('#hint');
    const frame = el.querySelector<HTMLDivElement>('#frame');
    const bobs = Array.from(el.querySelectorAll('.bob')) as HTMLDivElement[];

    curRef.current = 0;
    let tl: gsap.core.Timeline | null = null;
    // Track when each slide was entered — prevents auto-snap on the same wheel event that arrived at slide 6
    let slideArrivedAt = Date.now();

    function setRail(i: number) {
      if (railNum) railNum.textContent = String(i + 1).padStart(2, '0');
      dots.forEach((d, j) => d.classList.toggle('active', j === i));
    }

    setRail(0);

    let io: IntersectionObserver | null = null;
    let mmListener: ((e: MouseEvent) => void) | null = null;
    let bobAnimation: gsap.core.Tween[] = [];

    if (!reduced) {
      const DUR = 0.62; // slightly faster slide transition for swipe feel
      const EASE = 'power2.out';

      const transition = (next: number, dir: number) => {
        if (next === curRef.current) return;
        if (tl) tl.progress(1); // Finish running transition instantly
        slideArrivedAt = Date.now(); // record when this slide was reached

        const inP = panels[next];
        const outP = panels[curRef.current];
        const inT = texts[next];
        const outT = texts[curRef.current];

        if (!inP || !outP || !inT || !outT) return;

        const inPh = inP.querySelector('.ph');
        const outPh = outP.querySelector('.ph');
        const inFl = inP.querySelector('.fl');
        const outFl = outP.querySelector('.fl');

        curRef.current = next;

        inP.style.zIndex = '3';
        outP.style.zIndex = '2';
        inT.classList.add('active');

        gsap.set(inP, { clipPath: dir > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' });
        if (inPh) gsap.set(inPh, { yPercent: dir > 0 ? -10 : 10, scale: 1.14 });
        if (inFl) gsap.set(inFl, { yPercent: dir > 0 ? -18 : 18, scale: 1.06 });

        tl = gsap.timeline({
          onComplete() {
            outP.classList.remove('active');
            inP.classList.add('active');
            outT.classList.remove('active');
            gsap.set(outP, { clipPath: 'inset(100% 0 0 0)', zIndex: 1 });
            if (outPh) gsap.set(outPh, { yPercent: 0, scale: 1 });
            if (outFl) gsap.set(outFl, { yPercent: 0, scale: 1 });
            gsap.set(outT.children, { clearProps: 'all' });
            tl = null;
          }
        });

        tl.to(inP, { clipPath: 'inset(0% 0 0% 0)', duration: DUR, ease: EASE }, 0);
        if (inPh) tl.to(inPh, { yPercent: 0, scale: 1, duration: DUR, ease: EASE }, 0);
        if (inFl) tl.to(inFl, { yPercent: 0, scale: 1, duration: DUR, ease: EASE }, 0);
        if (outPh) tl.to(outPh, { yPercent: dir > 0 ? 8 : -8, scale: 1.06, duration: DUR, ease: EASE }, 0);
        if (outFl) tl.to(outFl, { yPercent: dir > 0 ? 16 : -16, duration: DUR, ease: EASE }, 0);

        tl.to(outT.children, {
          y: dir > 0 ? -26 : 26,
          opacity: 0,
          duration: 0.22,
          stagger: 0.03,
          ease: 'power2.in'
        }, 0);

        tl.fromTo(inT.children,
          { y: dir > 0 ? 40 : -40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: 'power2.out' },
          0.22
        );

        setRail(next);
        if (next > 0 && hint) {
          gsap.to(hint, { opacity: 0, duration: 0.4 });
        } else if (next === 0 && hint) {
          gsap.to(hint, { opacity: 1, duration: 0.4 });
        }
      };

      transitionRef.current = transition;

      // Intersection Observer drives the active index
      io = new IntersectionObserver((entries) => {
        if (isDotJumpingRef.current) return;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = steps.indexOf(e.target as HTMLDivElement);
          if (i !== -1 && i !== curRef.current) {
            transition(i, i > curRef.current ? 1 : -1);
          }
        });
      }, { threshold: 0.55 });

      steps.forEach((s) => io?.observe(s));

      // Mouse Parallax Effect on frame container and models
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

      // Initial Slide 0 Animations
      if (panels[0]) {
        gsap.set(panels[0], { clipPath: 'inset(100% 0 0 0)' });
        const firstPh = panels[0].querySelector('.ph');
        const firstFl = panels[0].querySelector('.fl');
        if (firstPh) gsap.set(firstPh, { yPercent: -10, scale: 1.14 });
        if (firstFl) gsap.set(firstFl, { yPercent: -18, scale: 1.06 });

        gsap.to(panels[0], { clipPath: 'inset(0% 0 0% 0)', duration: 1.25, ease: EASE, delay: 0.15 });
        if (firstPh) gsap.to(firstPh, { yPercent: 0, scale: 1, duration: 1.25, ease: EASE, delay: 0.15 });
        if (firstFl) gsap.to(firstFl, { yPercent: 0, scale: 1, duration: 1.25, ease: EASE, delay: 0.15 });
      }

      // Live slow bobbing of models
      bobs.forEach((b, i) => {
        const tween = gsap.fromTo(b,
          { y: -12 },
          {
            y: 12,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.45
          }
        );
        bobAnimation.push(tween);
      });

      if (texts[0]) {
        gsap.fromTo(texts[0].children,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.075, ease: 'power3.out', delay: 0.5 }
        );
      }
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

    const snapTo = (target: HTMLElement | number) => {
      if (snapCooldown) return;
      snapCooldown = true;

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 0.82,
          easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // ease-in-out quad
          lock: true,
          onComplete: () => { snapCooldown = false; },
        });
      } else {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => { snapCooldown = false; }, 900);
      }
    };

    const getScrollY = (): number => {
      const lenis = (window as any).lenis;
      return lenis ? lenis.scroll : window.scrollY;
    };

    const handleSnapWheel = (e: WheelEvent) => {
      if (snapCooldown) { e.preventDefault(); return; }

      const scrollY = getScrollY();
      const heroH = heroHeight();
      const vh = window.innerHeight;

      // A) Hero → Carousel Slide 1: scrolling down while in Hero zone
      if (e.deltaY > 4 && scrollY < heroH * 0.9) {
        e.preventDefault();
        const firstStep = steps[0];
        if (firstStep) snapTo(firstStep);
        return;
      }

      // B) Carousel Slide 1 → Hero: scrolling up while on Slide 1
      if (e.deltaY < -4 && curRef.current === 0 && scrollY >= heroH * 0.5 && scrollY < heroH + 50) {
        e.preventDefault();
        snapTo(0);
        return;
      }

      // C) Carousel Slide 6 → StatementParticles: scrolling down from last slide
      // Guard: only fire if the user has been on slide 6 for at least 1000ms
      // (prevents auto-snap on the same wheel event that transitioned into slide 6)
      if (e.deltaY > 4 && curRef.current === 5 && Date.now() - slideArrivedAt >= 1000) {
        const stmtSection = document.getElementById('sbStatement');
        if (stmtSection) {
          const stmtRect = stmtSection.getBoundingClientRect();
          if (stmtRect.top > 50) {
            e.preventDefault();
            snapTo(stmtSection);
          }
        }
        return;
      }

      // D) StatementParticles → Carousel Slide 6: scrolling up from top of StatementParticles
      if (e.deltaY < -4 && scrollY >= heroH + 5.8 * vh && scrollY <= heroH + 6.2 * vh) {
        const lastStep = steps[5];
        if (lastStep) {
          e.preventDefault();
          snapTo(lastStep);
        }
        return;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (snapCooldown) return;
      const deltaY = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(deltaY) < 25) return; // ignore micro-swipes

      const scrollY = getScrollY();
      const heroH = heroHeight();
      const vh = window.innerHeight;

      // A) Hero → Carousel Slide 1
      if (deltaY > 0 && scrollY < heroH * 0.9) {
        const firstStep = steps[0];
        if (firstStep) snapTo(firstStep);
        return;
      }

      // B) Carousel Slide 1 → Hero
      if (deltaY < 0 && curRef.current === 0 && scrollY >= heroH * 0.5 && scrollY < heroH + 50) {
        snapTo(0);
        return;
      }

      // C) Carousel Slide 6 → StatementParticles (touch — guard with 1000ms dwell)
      if (deltaY > 0 && curRef.current === 5 && Date.now() - slideArrivedAt >= 1000) {
        const stmtSection = document.getElementById('sbStatement');
        if (stmtSection && stmtSection.getBoundingClientRect().top > 50) {
          snapTo(stmtSection);
        }
        return;
      }

      // D) StatementParticles → Carousel Slide 6 (touch)
      if (deltaY < 0 && scrollY >= heroH + 5.8 * vh && scrollY <= heroH + 6.2 * vh) {
        const lastStep = steps[5];
        if (lastStep) snapTo(lastStep);
        return;
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
      io?.disconnect();
      if (mmListener) window.removeEventListener('mousemove', mmListener);
      transitionRef.current = null;
      bobAnimation.forEach(tween => tween.kill());
      if (tl) tl.kill();
    };
  }, []);

  const handleDotClick = (idx: number) => {
    if (idx === curRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const steps = Array.from(el.querySelectorAll('.step')) as HTMLDivElement[];
    const targetStep = steps[idx];
    if (!targetStep) return;

    isDotJumpingRef.current = true;

    // Trigger direct transition
    if (transitionRef.current) {
      transitionRef.current(idx, idx > curRef.current ? 1 : -1);
    }

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetStep, {
        duration: 0.65,
        easing: (t: number) => 1 - Math.pow(1 - t, 2.5),
        lock: true,
        onComplete: () => {
          isDotJumpingRef.current = false;
        }
      });
    } else {
      targetStep.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isDotJumpingRef.current = false;
      }, 650);
    }
  };

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
        </div>

        {/* Content Section containing details per slide */}
        <div className="content">
          {SLIDES.map((slide, idx) => {
            const product = products.find(p => p.handle === PRODUCT_HANDLES[idx]);
            const isSoldOut = product ? !product.inStock : false;
            return (
              <div key={idx} className={`txt ${idx === 0 ? 'active' : ''}`}>
                <div className="num-badge inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-sans self-start mb-2 select-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-[#0B3DFF] shadow-[0_0_12px_#0B3DFF] animate-pulse shrink-0 ml-1" />
                  <span className="text-white font-bold tracking-[0.2em] uppercase">SPIRITBEING</span>
                  <span className="bg-[#0B3DFF] text-white font-yellowtail text-[16px] leading-none px-3 pt-1 pb-1.5 rounded-full shadow-[0_0_15px_rgba(11,61,255,0.4)] ml-1">
                    Special Edition
                  </span>
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
                    {wishlistActive[idx] ? 'Liked' : 'Like Drop'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        </div>

        {/* Right-hand Rail Indicators inside Sticky Stage */}
        <div className="rail">
          <div className="count">
            <b id="railNum">01</b>&nbsp;/&nbsp;06
          </div>

          <button
            className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-[#8A8D95] hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 mb-3 mx-auto shadow-sm group backdrop-blur-sm"
            onClick={() => handleDotClick(Math.max(0, curRef.current - 1))}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>

          {SLIDES.map((_, idx) => (
            <React.Fragment key={idx}>
              <button
                className={`dot ${idx === 0 ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to piece ${idx + 1}`}
              ></button>
              {idx < SLIDES.length - 1 && <div className="line"></div>}
            </React.Fragment>
          ))}

          <button
            className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-[#8A8D95] hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 mt-3 mx-auto shadow-sm group backdrop-blur-sm"
            onClick={() => handleDotClick(Math.min(SLIDES.length - 1, curRef.current + 1))}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Downward hint visual drip indicator inside Sticky Stage */}
        <div className="hint" id="hint">
          Scroll
        </div>
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
