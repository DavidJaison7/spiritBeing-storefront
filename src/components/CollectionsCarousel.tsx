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
    num: "01 — 05",
    title: "The Spirit\nGives Life",
    desc: "The letter kills. The Spirit raises what was dead.",
    verse: "2 Corinthians 3:6",
    price: "₹899",
    bgImg: "/carousel-bg-1.jpeg",
    modelImg: "/carousel-model-1.webp",
  },
  {
    num: "02 — 05",
    title: "Holy\nSpirit",
    desc: "The same Spirit who raised Christ lives in you. Walk like it.",
    verse: "Romans 8:11",
    price: "₹899",
    bgImg: "/carousel-bg-2.jpeg",
    modelImg: "/carousel-model-2.webp",
  },
  {
    num: "03 — 05",
    title: "New\nCreation",
    desc: "The old is gone. We didn't find our identity. We remembered it.",
    verse: "2 Corinthians 5:17",
    price: "₹899",
    bgImg: "/carousel-bg-3.jpeg",
    modelImg: "/carousel-model-3.webp",
  },
  {
    num: "04 — 05",
    title: "Fear\nNot",
    desc: "The Lion stands with the lamb. You were never alone.",
    verse: "Isaiah 41:10",
    price: "₹899",
    bgImg: "/carousel-bg-4.jpeg",
    modelImg: "/carousel-model-4.webp",
  },
  {
    num: "05 — 05",
    title: "King Of\nKings",
    desc: "The horse is ready for battle. The victory is already His.",
    verse: "Proverbs 21:31",
    price: "₹999",
    bgImg: "/carousel-bg-5.jpeg",
    modelImg: "/carousel-model-5.webp",
  },
];

export const CollectionsCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wishlistActive, setWishlistActive] = useState<boolean[]>([false, false, false, false, false]);

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
    const findex = el.querySelector<HTMLElement>('#findex');
    const hint = el.querySelector<HTMLElement>('#hint');
    const frame = el.querySelector<HTMLDivElement>('#frame');
    const bobs = Array.from(el.querySelectorAll('.bob')) as HTMLDivElement[];

    curRef.current = 0;
    let tl: gsap.core.Timeline | null = null;

    function setRail(i: number) {
      if (railNum) railNum.textContent = String(i + 1).padStart(2, '0');
      if (findex) findex.textContent = String(i + 1).padStart(2, '0');
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

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 860) return;
      
      const r = el.getBoundingClientRect();
      const isPinned = r.top <= 10 && r.bottom >= window.innerHeight - 10;
      if (!isPinned) return;

      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 5) {
        // Scroll down
        if (curRef.current < 4) {
          e.preventDefault();
          performSmoothScroll(curRef.current + 1);
        }
      } else if (e.deltaY < -5) {
        // Scroll up
        if (curRef.current > 0) {
          e.preventDefault();
          performSmoothScroll(curRef.current - 1);
        }
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth < 860) return;
      
      const r = el.getBoundingClientRect();
      const isPinned = r.top <= 10 && r.bottom >= window.innerHeight - 10;
      if (!isPinned) return;

      if (isTransitioning) {
        e.preventDefault();
        return;
      }
      const currentY = e.touches[0].clientY;
      const diffY = startY - currentY;

      if (diffY > 30) {
        // Swiped up (scroll down)
        if (curRef.current < 4) {
          e.preventDefault();
          performSmoothScroll(curRef.current + 1);
        }
      } else if (diffY < -30) {
        // Swiped down (scroll up)
        if (curRef.current > 0) {
          e.preventDefault();
          performSmoothScroll(curRef.current - 1);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup listeners and animations on unmount
    return () => {
      io?.disconnect();
      if (mmListener) {
        window.removeEventListener('mousemove', mmListener);
      }
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
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
        <div className="frame" id="frame">
          <span className="findex" id="findex">01</span>

          {SLIDES.map((slide, idx) => (
            <div key={idx} className={`panel ${idx === 0 ? 'active' : ''}`}>
              <div className="ph">
                <img src={slide.bgImg} alt={`Collection piece background ${idx + 1}`} loading="lazy" />
              </div>
              <div className="fl">
                <div className="bob">
                  <img className="model" src={slide.modelImg} alt={`Collection model overlay ${idx + 1}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section containing details per slide */}
        <div className="content">
          {SLIDES.map((slide, idx) => (
            <div key={idx} className={`txt ${idx === 0 ? 'active' : ''}`}>
              <div className="num">{slide.num}</div>
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
                <a className="view" href="#products-grid">
                  View Piece <span>&#8594;</span>
                </a>
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
                    {wishlistActive[idx] ? 'Wishlisted' : 'Wishlist'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right-hand Rail Indicators inside Sticky Stage */}
        <div className="rail">
          <div className="count">
            <b id="railNum">01</b>&nbsp;/&nbsp;05
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

      {/* Five Scroll target elements to drive sticky animations (positioned absolutely) */}
      <div className="step" style={{ top: '0vh' }}></div>
      <div className="step" style={{ top: '100vh' }}></div>
      <div className="step" style={{ top: '200vh' }}></div>
      <div className="step" style={{ top: '300vh' }}></div>
      <div className="step" style={{ top: '400vh' }}></div>
    </div>
  );
};
