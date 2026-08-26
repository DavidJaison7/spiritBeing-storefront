import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
    price: "₹899",
    bgImg: "/carousel-bg-1.jpeg",
    modelImg: "/carousel-pngs/image 1886.png",
  },
  {
    num: "02 — 06",
    title: "Spirit\nBeing",
    desc: "Faith, identity, and kingdom purpose defined.",
    verse: "Romans 8:16",
    price: "₹899",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 1998.png",
  },
  {
    num: "03 — 06",
    title: "New\nCreation",
    desc: "The old has passed away; behold, the new has come.",
    verse: "2 Corinthians 5:17",
    price: "₹899",
    bgImg: "/carousel-pngs/new-creation-bg-acidwash.png",
    modelImg: "/carousel-pngs/new-creation-model-acidwash.png",
  },
  {
    num: "04 — 06",
    title: "Fear\nNot",
    desc: "The Lion stands with the lamb. You are never alone.",
    verse: "Isaiah 41:10",
    price: "₹899",
    bgImg: "/carousel-bg-4.jpeg",
    modelImg: "/carousel-pngs/image 2003-1.png",
  },
  {
    num: "05 — 06",
    title: "Holy\nSpirit",
    desc: "The same Spirit who raised Christ lives in you.",
    verse: "Romans 8:11",
    price: "₹899",
    bgImg: "/carousel-bg-5.jpeg",
    modelImg: "/carousel-pngs/image 2003.png",
  },
  {
    num: "06 — 06",
    title: "Christ\nGenerations",
    desc: "Led by the Spirit. Becoming more like Christ.",
    verse: "Romans 8:14",
    price: "₹899",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-pngs/image 2126.png",
  },
];

interface CollectionsCarouselProps {
  onSelectProductByHandle?: (handle: string) => void;
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
  onSelectProductByHandle
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

    function setRail(i: number) {
      if (railNum) railNum.textContent = String(i + 1).padStart(2, '0');
      dots.forEach((d, j) => d.classList.toggle('active', j === i));
    }

    setRail(0);

    let io: IntersectionObserver | null = null;
    let mmListener: ((e: MouseEvent) => void) | null = null;
    let bobAnimation: gsap.core.Tween[] = [];

    if (!reduced) {
      const DUR = 0.48;
      const EASE = 'power2.out';

      const transition = (next: number, dir: number) => {
        if (next === curRef.current) return;
        if (tl) tl.progress(1); // Finish running transition instantly

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

    // Scroll Deck Wheel & Swipe Interceptor to enforce "one scroll/swipe = one slide" transition
    let isTransitioning = false;

    const performSmoothScroll = (targetIndex: number) => {
      isTransitioning = true;
      const targetStep = steps[targetIndex];
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetStep, {
          duration: 0.6,
          easing: (t: number) => 1 - Math.pow(1 - t, 2.5),
          lock: true,
          onComplete: () => {
            isTransitioning = false;
          }
        });
      } else {
        targetStep.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isTransitioning = false;
        }, 600);
      }
    };

      // Single-scroll transition from 6th slide (Slide 06 - 06) to StatementParticlesSection
      let lastTransitionTime = 0;

      const handleSlide6Wheel = (e: WheelEvent) => {
        if (e.deltaY <= 5) return;

        const now = Date.now();
        if (now - lastTransitionTime < 1200) return;

        // Check if we are currently on the 6th slide (index 5)
        if (curRef.current === 5) {
          const stmtSection = document.getElementById('sbStatement');
          if (stmtSection) {
            const rect = stmtSection.getBoundingClientRect();
            // If StatementParticlesSection is not yet centered in viewport
            if (rect.top > 40) {
              e.preventDefault();
              lastTransitionTime = now;

              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(stmtSection, {
                  duration: 0.95,
                  easing: (t: number) => 1 - Math.pow(1 - t, 3),
                });
              } else {
                stmtSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        }
      };

      if (el) {
        el.addEventListener('wheel', handleSlide6Wheel, { passive: false });
      }

      // Cleanup listeners and animations on unmount
      return () => {
        if (el) {
          el.removeEventListener('wheel', handleSlide6Wheel);
        }
        io?.disconnect();
        if (mmListener) {
          window.removeEventListener('mousemove', mmListener);
        }
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
                <img src={slide.bgImg} alt={`Collection piece background ${idx + 1}`} loading="lazy" />
              </div>
              <div className="fl">
                <div className="bob">
                  <img className={`model ${idx === 2 ? 'model-slide-3' : idx === 3 ? 'model-extra-large' : idx >= 1 ? 'model-large' : ''}`} src={slide.modelImg} alt={`Collection model overlay ${idx + 1}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section containing details per slide */}
        <div className="content">
          {SLIDES.map((slide, idx) => (
            <div key={idx} className={`txt ${idx === 0 ? 'active' : ''}`}>
              <div className="num-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs font-mono self-start mb-1 select-none">
                <span className="w-2 h-2 rounded-full bg-[#0B3DFF] shadow-[0_0_10px_#0B3DFF] animate-pulse shrink-0" />
                <span className="text-white font-bold tracking-[0.22em]">SPIRITBEING</span>
                <span className="text-[#0B3DFF] font-script text-base sm:text-lg capitalize font-normal tracking-normal -ml-1">
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
              <div className="price">{slide.price}</div>
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
                    {wishlistActive[idx] ? 'Liked ❤️' : 'Like Drop'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right-hand Rail Indicators inside Sticky Stage */}
        <div className="rail">
          <div className="count">
            <b id="railNum">01</b>&nbsp;/&nbsp;06
          </div>
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
