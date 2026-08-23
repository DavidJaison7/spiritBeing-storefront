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
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;

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

    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-between cursor-default">
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
          style={{ background: 'radial-gradient(ellipse at 50% 32%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }} />

        {/* Mobile Aspect Ratio Wrapper (locks proportions for mobile, behaves normally on desktop) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-[600px] aspect-[550/1195] md:max-w-none md:w-full md:h-full md:aspect-auto pointer-events-auto">
            {/* Layer 2 — hands */}
            <div ref={handLeftRef} className="absolute top-0 md:top-[18vh] lg:top-[2%] left-0 md:left-[-8%] w-[84.6%] md:w-[44vw] max-w-[680px] pointer-events-none will-change-transform opacity-100 transition-transform duration-150 ease-out z-[4] rotate-[42.3deg] md:rotate-0 origin-top-left md:origin-center">
              <img src="/hand-left.png" alt="hand reaching toward S" className="w-full block" />
            </div>

            {/* Layer 3 — logo image */}
            <div ref={logoLayerRef} className="absolute left-1/2 md:left-0 top-[38%] md:top-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:inset-0 md:flex md:items-start md:justify-center md:pt-[28vh] lg:pt-[16vh] w-[58%] md:w-auto will-change-transform transition-transform duration-150 ease-out z-[5]">
              <img src="/sb-blue.png" alt="Spirit Being logo" className="w-full md:w-[min(30vw,460px)] drop-shadow-[0_0_40px_rgba(0,0,0,0.55)] select-none pointer-events-none" />
            </div>

            <div ref={handRightRef} className="absolute top-[56%] md:top-[22vh] lg:top-[14%] right-[-22%] md:right-[-8%] w-[70%] md:w-[44vw] max-w-[680px] pointer-events-none will-change-transform opacity-100 transition-transform duration-150 ease-out z-[4] rotate-[50deg] md:rotate-0 origin-right md:origin-center">
              <img src="/hand-right.png" alt="hand reaching toward g" className="w-full block" />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Archive Images (overlaid at bottom) */}
      <div className="absolute bottom-0 w-full z-10 pointer-events-auto">
        <div className="w-full overflow-hidden py-4 relative">
          {/* Subtle gradient to blend marquee with background if desired, or keep transparent */}
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
    </section>
  );
};
