import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Product } from '../types';

interface ShowcaseSectionProps {
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

const SHOWCASE_ITEMS = [
  {
    num: '01 — 06',
    title: ['All Things', 'Through Christ'],
    verse: 'His power is made perfect in my weakness — Philippians 4:13',
    price: '₹2,499',
    side: 'left',
    scale: 1.0,
    img: '/showcase/model-1.webp',
    alt: 'Blue oversized tee, red boxing glove artwork, Philippians 4:13'
  },
  {
    num: '02 — 06',
    title: ['Jesus My', 'Superhero'],
    verse: 'He who rose, now lives in me',
    price: '₹2,499',
    side: 'right',
    scale: 0.9,
    img: '/showcase/model-2.webp',
    alt: 'Black oversized tee, red cape and cross artwork'
  },
  {
    num: '03 — 06',
    title: ['Life Is Better', 'With Jesus'],
    verse: 'Joy in every step',
    price: '₹2,499',
    side: 'left',
    scale: 1.05,
    img: '/showcase/model-3.webp',
    alt: 'Red oversized tee, hand-painted lettering'
  },
  {
    num: '04 — 06',
    title: ['New', 'Creation'],
    verse: "We didn't find our identity. We remembered it.",
    price: '₹2,499',
    side: 'right',
    scale: 0.94,
    img: '/showcase/model-4.webp',
    alt: 'Blue oversized tee, dripping New Creation type'
  },
  {
    num: '05 — 06',
    title: ['Blood', 'Of Christ'],
    verse: 'Redeemed by His blood',
    price: '₹2,499',
    side: 'left',
    scale: 1.06,
    img: '/showcase/model-5.webp',
    alt: 'White oversized tee, blood drop and three crosses'
  },
  {
    num: '06 — 06',
    title: ['Fear', 'Not'],
    verse: 'For I am with you — Isaiah 41:10',
    price: '₹2,499',
    side: 'right',
    scale: 0.96,
    img: '/showcase/model-6.webp',
    alt: 'Black oversized tee, lion and lamb artwork'
  }
];

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ products = [], onSelectProduct }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const SEG = 1.5, INTRO = 0.6;
      const TOTAL = INTRO + SHOWCASE_ITEMS.length * SEG;
      const isMobile = window.matchMedia('(max-width:768px)').matches;

      const railNumEl = document.getElementById('scRailNum');
      const dotsEl = document.querySelectorAll('.sc-dot');

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate(self) {
            const t = self.progress * TOTAL;
            let idx = Math.floor((t - INTRO) / SEG);
            idx = Math.max(0, Math.min(SHOWCASE_ITEMS.length - 1, idx));
            if (railNumEl) railNumEl.textContent = String(idx + 1).padStart(2, '0');
            dotsEl.forEach((d, i) => d.classList.toggle('active', i === idx));
          }
        }
      });

      // Background camera zoom & dim
      tl.fromTo('#scBg', { scale: 1, xPercent: 0 }, { scale: 1.06, xPercent: isMobile ? 0 : -1.5, duration: TOTAL, ease: 'none' }, 0);
      tl.to('#scDim', { opacity: 0.32, duration: TOTAL, ease: 'none' }, 0);

      // Hero elements exit
      tl.to('#scHero', { opacity: 0, y: -70, duration: 0.55, ease: 'power2.in' }, 0.05);
      tl.to('#scScrollLabel', { opacity: 0, duration: 0.3 }, 0.05);

      // Model sequence animations
      SHOWCASE_ITEMS.forEach((m, i) => {
        const start = INTRO + i * SEG;
        const fig = '#scM' + (i + 1);
        const info = '#scInfo' + (i + 1);
        const fromX = isMobile ? 0 : (m.side === 'left' ? -120 : 120);

        // Spotlight follows side
        tl.to('#scGlow', {
          xPercent: isMobile ? -50 : (m.side === 'left' ? -50 - 28 : -50 + 28),
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, start);

        // Enter
        tl.fromTo(fig,
          { opacity: 0, x: fromX, y: 90, scale: 0.82 },
          { opacity: 1, x: 0, y: 0, scale: m.scale, duration: 0.7 }, start);
        tl.fromTo(info,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.55 }, start + 0.18);

        // Zoom through & fade out
        tl.to(fig, { scale: m.scale * 1.16, opacity: 0, duration: 0.62, ease: 'power2.in' }, start + SEG - 0.55);
        tl.to(info, { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' }, start + SEG - 0.5);
      });

      // Glow rests
      tl.to('#scGlow', { xPercent: -50, opacity: 0.5, duration: 0.4 }, TOTAL - 0.35);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePieceClick = (index: number) => {
    if (onSelectProduct) {
      const match = products[index % products.length];
      if (match) {
        onSelectProduct(match);
      }
    }
  };

  return (
    <div ref={containerRef} className="showcase-wrapper relative w-full text-[#F2F0EA] font-space select-none" id="showcase">
      {/* Showcase Scroll Track (700vh) */}
      <div className="showcase h-[700vh] relative">
        <div className="stage sticky top-0 h-screen w-full overflow-hidden bg-[#080808]">
          {/* Background Layers */}
          <div
            id="scBg"
            className="stage-bg absolute -inset-[4%] bg-cover bg-[center_30%] will-change-transform"
            style={{ backgroundImage: 'url(/showcase/bg-desktop.jpeg)' }}
          />
          <div id="scGlow" className="glow absolute top-[16%] left-1/2 w-[56vmin] h-[74vmin] -translate-x-1/2 opacity-0 pointer-events-none will-change-transform" />
          <div className="stage-vignette absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_50%_42%,transparent_45%,rgba(8,8,8,0.72)_100%)]" />
          <div id="scDim" className="stage-dim absolute inset-0 bg-[#080808] opacity-0 pointer-events-none" />

          {/* Hero Section */}
          <div id="scHero" className="hero absolute inset-0 flex flex-col justify-center px-[8vw] z-10">
            <h1 className="font-anton text-[clamp(64px,11vw,168px)] leading-[0.92] tracking-[0.01em] text-[#F2F0EA] uppercase">
              Faith<br />In Every<br /><span className="text-[#8A8A8A]">Step.</span>
            </h1>
            <div className="sub mt-[36px] max-w-[300px] text-[12px] leading-[1.8] tracking-[0.14em] text-[#8A8A8A] uppercase">
              <strong className="block text-[#F2F0EA] tracking-[0.42em] mb-[14px] font-medium">Spirit Being</strong>
              A collection built on faith, identity and purpose.
            </div>
            <a
              className="cta mt-[44px] inline-flex items-center gap-[14px] w-fit text-[12px] tracking-[0.3em] uppercase text-[#F2F0EA] border-b border-[rgba(242,240,234,0.3)] pb-[10px] hover:border-[#F2F0EA] hover:gap-[22px] transition-all duration-300"
              href="#scScene"
            >
              Explore Collection <span>→</span>
            </a>
          </div>

          {/* Scene / Models */}
          <div className="scene" id="scScene">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Model Figure */}
                <figure
                  id={`scM${idx + 1}`}
                  className={`model absolute bottom-0 h-screen z-10 flex items-end opacity-0 pointer-events-none ${
                    item.side === 'left' ? 'left-[9vw]' : 'right-[9vw]'
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="h-[80vh] w-auto block drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </figure>

                {/* Model Info */}
                <div
                  id={`scInfo${idx + 1}`}
                  className={`info absolute top-1/2 -translate-y-1/2 z-20 opacity-0 pointer-events-none ${
                    item.side === 'left' ? 'right-[10vw] text-right' : 'left-[10vw] text-left'
                  }`}
                >
                  <div className="num text-[12px] tracking-[0.5em] text-[#8A8A8A]">{item.num}</div>
                  <h2 className={`font-anton text-[clamp(34px,4.6vw,72px)] leading-[1.02] tracking-[0.015em] uppercase text-[#F2F0EA] my-[18px] mb-[14px] max-w-[15ch] ${item.side === 'left' ? 'ml-auto' : ''}`}>
                    {item.title[0]}<br />{item.title[1]}
                  </h2>
                  <p className="verse text-[11px] tracking-[0.3em] uppercase text-[#8A8A8A] max-w-[34ch] leading-[2]">
                    {item.verse}
                  </p>
                  <div className="price mt-[26px] text-[13px] tracking-[0.2em] text-[#F2F0EA]">{item.price}</div>
                  <button
                    onClick={() => handlePieceClick(idx)}
                    className="view mt-[18px] inline-flex items-center gap-[12px] pointer-events-auto text-[11px] tracking-[0.3em] uppercase text-[#F2F0EA] border-b border-[rgba(242,240,234,0.3)] pb-[8px] hover:border-[#F2F0EA] transition-colors cursor-pointer"
                  >
                    View Piece <span>→</span>
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Progress Rail */}
          <div className="rail absolute right-[40px] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-0" id="scRail">
            <div className="count text-[11px] tracking-[0.3em] text-[#8A8A8A] mb-[22px] whitespace-nowrap">
              <b id="scRailNum" className="text-[#F2F0EA] font-medium">01</b>&nbsp;/&nbsp;06
            </div>
            {SHOWCASE_ITEMS.map((_, i) => (
              <React.Fragment key={i}>
                <div className={`sc-dot dot w-[5px] h-[5px] rounded-full bg-[#3a3a3a] transition-all duration-400 ${i === 0 ? 'active' : ''}`} />
                {i < SHOWCASE_ITEMS.length - 1 && <div className="line w-[1px] h-[26px] bg-[#2a2a2a]" />}
              </React.Fragment>
            ))}
          </div>

          {/* Scroll Label */}
          <div id="scScrollLabel" className="scroll-label absolute right-[38px] bottom-[44px] z-30 [writing-mode:vertical-rl] text-[10px] tracking-[0.44em] uppercase text-[#8A8A8A] flex items-center gap-[16px]">
            Scroll to explore
          </div>
        </div>
      </div>

      {/* Outro Section */}
      <div className="outro min-h-[92vh] flex flex-col justify-center items-center text-center px-[8vw] py-[14vh] relative bg-[#080808]">
        <h2 className="font-anton text-[clamp(48px,8vw,128px)] leading-[0.96] tracking-[0.01em] uppercase text-[#F2F0EA]">
          Designed<br />For The <span className="text-[#3f3f3f]">Chosen.</span>
        </h2>
        <p className="mt-[30px] text-[11px] tracking-[0.3em] uppercase text-[#8A8A8A] leading-[2.2]">
          Every garment carries a statement. Wear your identity.
        </p>
        <button
          onClick={() => {
            const el = document.getElementById('products-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cta mt-[48px] text-[12px] tracking-[0.3em] uppercase text-[#F2F0EA] border border-[rgba(242,240,234,0.25)] px-[44px] py-[20px] hover:bg-[#F2F0EA] hover:text-[#080808] hover:border-[#F2F0EA] transition-all duration-350 cursor-pointer"
        >
          Shop Full Drop <span>→</span>
        </button>

        <div className="footer-line absolute bottom-[32px] left-0 right-0 flex justify-between px-[40px] text-[10px] tracking-[0.3em] uppercase text-[#4a4a4a]">
          <span>Spirit Being Studio</span>
          <span>© 2026</span>
        </div>
      </div>

      {/* Custom Scoped CSS Styles for Showcase */}
      <style>{`
        .glow {
          background: radial-gradient(50% 50% at 50% 40%, rgba(242,240,234,0.14) 0%, rgba(242,240,234,0.05) 42%, transparent 70%);
        }
        .sc-dot.active {
          background: #ffffff !important;
          transform: scale(1.5);
        }
        .scroll-label::after {
          content: '';
          width: 1px;
          height: 44px;
          background: linear-gradient(to bottom, #8A8A8A, transparent);
          animation: scDrip 2.2s ease-in-out infinite;
        }
        @keyframes scDrip {
          0% { transform: scaleY(0.2); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(1); transform-origin: top; opacity: 0; }
        }
        @media (max-width: 768px) {
          .showcase-wrapper .hero { padding: 0 7vw; justify-content: flex-end; padding-bottom: 18vh; }
          .showcase-wrapper .model { left: 50% !important; right: auto !important; transform: translateX(-50%); }
          .showcase-wrapper .model img { height: 62vh; }
          .showcase-wrapper .info { left: 7vw !important; right: 7vw !important; top: auto; bottom: 7vh; transform: none; text-align: left !important; }
          .showcase-wrapper .info h2 { margin-left: 0 !important; font-size: clamp(30px, 9vw, 44px); }
          .showcase-wrapper .rail { right: 16px; }
          .showcase-wrapper #scScrollLabel { display: none; }
          .showcase-wrapper .footer-line { padding: 0 20px; }
        }
      `}</style>
    </div>
  );
};
