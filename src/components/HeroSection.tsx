import React, { useEffect, useRef } from 'react';
import { Product } from '../types';

const HERO_MARQUEE_IMAGES = [
  '/archive/archive-1.png',
  '/archive/archive-2.png',
  '/archive/archive-3.png',
  '/archive/archive-4.png',
  '/archive/archive-5.png',
  '/archive/archive-6.png',
  '/archive/archive-7.png',
];

interface HeroSectionProps {
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ products, onSelectProduct }) => {
  const marqueeItems = [...HERO_MARQUEE_IMAGES, ...HERO_MARQUEE_IMAGES];

  const stageRef = useRef<HTMLDivElement>(null);
  const handLeftRef = useRef<HTMLDivElement>(null);
  const handRightRef = useRef<HTMLDivElement>(null);
  const logoLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const handLeft = handLeftRef.current;
    const handRight = handRightRef.current;
    const logoLayer = logoLayerRef.current;

    if (!stage || !handLeft || !handRight || !logoLayer) return;

    const baseLeft = { x: 3, y: 0, rot: -2 };
    const baseRight = { x: -3, y: 2, rot: 2 };

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let animationFrameId: number;

    let time = 0;
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window);

    const onMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      time += 0.03;
      // Gentle automated floating movement (essential for mobile & subtle ambient float on desktop)
      const autoFloatX = isMobile ? Math.sin(time * 0.8) * 0.45 : Math.sin(time * 0.5) * 0.2;
      const autoFloatY = isMobile ? Math.cos(time * 0.9) * 0.35 : Math.cos(time * 0.6) * 0.2;

      curX += (targetX + autoFloatX - curX) * 0.06;
      curY += (targetY + autoFloatY - curY) * 0.06;

      const handDepth = 22;
      const logoDepth = 18;
      const rotDepth = 3;

      handLeft.style.transform =
        `translate(${baseLeft.x}vw, ${baseLeft.y}vh) translate(${curX * handDepth}px, ${curY * handDepth}px) rotate(${baseLeft.rot + curX * rotDepth}deg)`;

      handRight.style.transform =
        `translate(${baseRight.x}vw, ${baseRight.y}vh) translate(${curX * -handDepth}px, ${curY * -handDepth}px) rotate(${baseRight.rot + curX * -rotDepth}deg)`;

      logoLayer.style.transform =
        `translate(${curX * logoDepth}px, ${curY * logoDepth}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Single Scroll handler (ultra-smooth scroll to ShowcaseSection on downward scroll/swipe)
    let isScrollTriggered = false;
    const triggerSingleScroll = () => {
      if (isScrollTriggered) return;
      isScrollTriggered = true;
      const showcase = document.getElementById('showcase');
      if (showcase) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(showcase, {
            duration: 1.8,
            easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
          });
        } else {
          showcase.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setTimeout(() => {
        isScrollTriggered = false;
      }, 2000);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) {
        triggerSingleScroll();
      }
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (startY - currentY > 20) {
        triggerSingleScroll();
      }
    };

    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('mouseleave', onMouseLeave);
    stage.addEventListener('wheel', onWheel, { passive: true });
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove', onTouchMove, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('mouseleave', onMouseLeave);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center cursor-default">
      {/* Parallax Container */}
      <div
        ref={stageRef}
        className="absolute inset-0 w-full h-full"
      >
        {/* Layer 1 — fixed background */}
        <div
          className="absolute inset-[-2%] w-[104%] h-[104%] bg-cover bg-center"
          style={{ backgroundImage: "url('/parallax-bg.jpg')" }}
        />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }} />

        {/* Mobile Aspect Ratio Wrapper (locks proportions for mobile, slides further down towards center on mobile, centers on PC) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-[600px] aspect-[550/1195] md:max-w-none md:w-full md:h-full md:aspect-auto pointer-events-auto translate-y-16 sm:translate-y-20 md:translate-y-0">
            {/* Layer 2 — left hand (Mobile: top-[-6%]; PC: slid slightly upwards md:top-[40%] pointing directly at letter 'S') */}
            <div
              ref={handLeftRef}
              className="absolute top-[-6%] md:top-[40%] md:-translate-y-1/2 left-0 md:left-[1%] w-[84.6%] md:w-[42vw] max-w-[660px] pointer-events-none will-change-transform opacity-100 transition-transform duration-150 ease-out z-[4] rotate-[42.3deg] md:-rotate-[4deg] origin-top-left md:origin-center"
            >
              <img src="/hand-left.png" alt="hand reaching toward S" className="w-full block" />
            </div>

            {/* Layer 3 — logo image (Centered) */}
            <div
              ref={logoLayerRef}
              className="absolute left-1/2 md:left-0 top-[38%] md:top-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:inset-0 md:flex md:items-center md:justify-center md:pt-0 w-[68%] sm:w-[62%] md:w-auto will-change-transform transition-transform duration-150 ease-out z-[5]"
            >
              <img src="/sb-blue.png" alt="Spirit Being logo" className="w-full md:w-[min(32vw,480px)] drop-shadow-[0_0_40px_rgba(0,0,0,0.55)] select-none pointer-events-none" />
            </div>

            {/* Layer 4 — right hand (Mobile: top-[62%]; PC: slid slightly downwards md:top-[60%] pointing directly at letter 'g') */}
            <div
              ref={handRightRef}
              className="absolute top-[62%] md:top-[60%] md:-translate-y-1/2 right-[-22%] md:right-[1%] w-[70%] md:w-[42vw] max-w-[660px] pointer-events-none will-change-transform opacity-100 transition-transform duration-150 ease-out z-[4] rotate-[50deg] md:rotate-[4deg] origin-right md:origin-center"
            >
              <img src="/hand-right.png" alt="hand reaching toward g" className="w-full block" />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Archive Images (COMMENTED OUT FOR FUTURE USE) */}
      {/* 
      <div className="absolute bottom-0 w-full z-10 pointer-events-auto">
        <div className="w-full overflow-hidden py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0"></div>
          <div className="animate-marquee flex gap-10 md:gap-14 px-4 items-end relative z-10">
            {marqueeItems.map((src, index) => {
              const variant = (index % 5) + 1;
              return (
                <div
                  key={`${src}-${index}`}
                  className={`w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 shrink-0 flex flex-col items-center justify-center p-2 rounded-xl relative marquee-item-offset-${variant}`}
                >
                  <div className={`w-full h-full flex items-center justify-center marquee-float-${variant}`}>
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-contain drop-shadow-xl cursor-pointer"
                      onClick={() => {
                        if (products && products.length > 0 && onSelectProduct) {
                          onSelectProduct(products[index % products.length]);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> 
      */}
    </section>
  );
};
