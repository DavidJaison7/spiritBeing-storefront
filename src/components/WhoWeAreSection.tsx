import React, { useEffect, useRef } from 'react';

export default function WhoWeAreSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.reveal-elem');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-6', 'translate-y-8');
        }
      });
    }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

    elements?.forEach(el => observer.observe(el));

    // Safety fallback to ensure text and image reveal cleanly on all viewports and Lenis scroll
    const timer = setTimeout(() => {
      elements?.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6', 'translate-y-8');
      });
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#f3ede1] text-[#1c1912] pl-[5vw] pt-16 md:pt-24 pb-16 overflow-hidden">

      <div className="w-full flex flex-col lg:flex-row justify-between relative z-10 mt-8 md:mt-0">

        {/* Left Column (Heading + intro) */}
        <div className="w-full lg:w-[280px] xl:w-[320px] flex flex-col shrink-0 pr-[5vw] md:pr-0">
          <h3 className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 ease-out font-sans font-bold text-[13px] md:text-[15px] tracking-[0.1em] text-[#1c1912] uppercase mb-4 lg:mb-6">
            Who We Are
          </h3>
          <p className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 delay-100 ease-out font-sans text-[13.5px] leading-[1.8] text-[#4a4437] max-w-[600px] lg:max-w-none text-justify lg:text-left">
            Spirit Being's story starts with one verse — the moment identity stopped being something we perform, and became something we already are.
          </p>
        </div>

        {/* Right Column (Text Block + Image) */}
        <div className="flex-1 flex flex-col md:flex-row items-center lg:items-start justify-center lg:justify-end gap-12 md:gap-8 lg:gap-10 mt-16 lg:mt-[60px]">

          {/* Text block (Right-aligned on Desktop, Centered on Mobile/Tablet) */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right lg:pt-[60px] px-[5vw] md:px-6 lg:px-0 w-full md:flex-1 lg:w-auto overflow-hidden md:overflow-visible">
            <span className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 delay-100 ease-out font-sans font-bold text-[14px] md:text-[22px] lg:text-[18px] tracking-[0.1em] text-[#1c1912] uppercase block mb-[-5px] md:mb-0 lg:mb-[-30px] lg:mr-2">
              2 Corinthians
            </span>
            <div className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 delay-200 ease-out font-headline font-bold text-[32vw] sm:text-[140px] md:text-[clamp(140px,16vw,200px)] lg:text-[clamp(120px,18vw,200px)] leading-[1] tracking-tight text-[#1c1912] w-full text-center lg:text-right">
              5:17
            </div>

            <div className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 delay-300 ease-out font-body-garamond text-[clamp(26px,5vw,46px)] md:text-[clamp(20px,3.5vw,32px)] lg:text-[clamp(26px,7vw,46px)] leading-[1.1] text-[#1c1912] mt-2 md:mt-6 max-w-full lg:max-w-none lg:whitespace-nowrap mx-auto lg:mx-0">
              We're not a clothing brand. <br className="hidden lg:block" />We're a proclamation.
            </div>

            <p className="reveal-elem opacity-0 translate-y-6 transition-all duration-1000 delay-400 ease-out font-sans text-[13.5px] leading-[1.8] text-[#4a4437] max-w-[500px] md:max-w-[340px] mt-6 md:mt-8 text-center lg:text-right mx-auto lg:mx-0">
              Spirit Being isn't made for people who want to <strong className="text-[#1c1912] font-semibold">look</strong> spiritual. It's worn by the ones who already know who they are — new creations, spirit-led, not of this world. Every piece starts with Scripture, not a trend report. We don't make merch. <strong className="text-[#1c1912] font-semibold">We make declarations you can wear into every room you walk into.</strong>
            </p>
          </div>

          {/* Image block - flush to left/right edges on mobile, right aligned on tablet/desktop */}
          <div className="reveal-elem opacity-0 translate-y-8 transition-all duration-[1100ms] delay-500 ease-out w-[calc(100%+5vw)] -ml-[5vw] md:ml-0 md:w-[380px] lg:w-[480px] xl:w-[550px] h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden shrink-0 mt-8 md:mt-0">
            <img src="/who-we-are-bg.jpg" alt="Who We Are" className="w-full h-full object-cover block" />
          </div>

        </div>
      </div>

    </section>
  );
}
