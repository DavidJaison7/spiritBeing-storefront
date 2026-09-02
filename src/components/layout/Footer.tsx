import React from 'react';
import { Camera, Briefcase, Globe, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const handleScrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full bg-[#fbf9f9] text-black relative z-10 overflow-hidden pt-10">
      {/* Blue Marquee Ticker */}
      <div className="w-full overflow-hidden bg-transparent text-[#2040FF] pb-8 whitespace-nowrap">
        <div className="animate-ticker text-sm sm:text-base font-mono font-bold tracking-[0.2em] uppercase leading-none">
          <div className="inline-flex items-center gap-12 px-6">
            <span>24/7 ONLINE STORE • SHIPPING ACROSS INDIA</span>
            <span></span>
            <span>SPIRITBEING • CHRISTIAN STREETWEAR & DROP SHOULDER TEES</span>
            <span></span>
            <span>DESIGNED FOR THE CHOSEN ONES • EST. 2026 INDIA</span>
            <span></span>

            {/* Repeat for continuous loop */}
            <span>24/7 ONLINE STORE • SHIPPING ACROSS INDIA</span>
            <span></span>
            <span>SPIRITBEING • CHRISTIAN STREETWEAR & DROP SHOULDER TEES</span>
            <span></span>
            <span>DESIGNED FOR THE CHOSEN ONES • EST. 2026 INDIA</span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Horizontal divider line aligned with footer padding */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-8">
        <div className="border-t border-black/10" />
      </div>

      {/* Links & Info Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-0 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
        
        {/* Left: Connect & Support Links */}
        <div className="flex gap-16 md:gap-24">
          {/* Connect with us */}
          <div className="flex flex-col gap-3 font-sans text-[12px] sm:text-[13px] text-[#2a2a2a]">
            <h3 className="font-bold text-black mb-0.5 text-[15px] sm:text-[16px]">Connect with us</h3>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Call</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Text (WhatsApp)</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Instagram</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">YouTube</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">LinkedIn</a>
          </div>

          {/* Order Support */}
          <div className="flex flex-col gap-3 font-sans text-[12px] sm:text-[13px] text-[#2a2a2a]">
            <h3 className="font-bold text-black mb-0.5 text-[15px] sm:text-[16px]">Order Support</h3>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Make a return/Exchange</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Refund/Exchange policy</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Track your order</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Shipping policy</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">FAQ's</a>
            <a href="#" className="font-medium hover:text-black transition-all duration-300 inline-block origin-left transform hover:translate-x-1.5">Terms</a>
          </div>
        </div>

        {/* Middle: Newsletter */}
        <div className="flex flex-col gap-3 font-sans text-[12px] sm:text-[13px] lg:items-center">
          <div className="w-full max-w-[300px]">
            <h3 className="font-bold text-black mb-3 text-[13px] sm:text-[14px] uppercase tracking-wider">Sign up for our newsletter</h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full">
              <input
                type="email"
                placeholder="enter email"
                className="bg-transparent border border-black/25 rounded-sm px-3 py-2.5 text-[12px] sm:text-[13px] w-full focus:outline-none focus:border-black font-sans font-medium lowercase"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 rounded-sm text-[12px] font-bold tracking-wider hover:bg-black/80 transition-colors cursor-pointer"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Right: Info Text */}
        <div className="flex flex-col gap-2 font-sans text-[11px] sm:text-[12px] text-[#444] font-medium uppercase tracking-[0.05em] lg:items-end lg:text-right">
          <p className="font-bold text-black tracking-widest text-[12px] sm:text-[13px] mb-1">24/7 ONLINE STORE • SHIPPING ACROSS INDIA</p>
          <p>EST. 2026 • BASED IN INDIA</p>
          <p className="text-[#888]">© SPIRITBEING, {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Horizontal divider line above Giant Wordmark with centered Back to Top button */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative flex flex-col items-center pt-8 pb-3 sm:pb-4">
        <button
          onClick={handleScrollToTop}
          className="group flex items-center gap-2 px-5 py-2.5 border border-black/10 bg-white text-black text-[11.5px] font-sans font-bold uppercase tracking-widest rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm cursor-pointer z-10 -mb-[21px] bg-white px-7"
        >
          <span>Back to Top</span>
          <span className="font-mono text-sm inline-block transform group-hover:-translate-y-1 transition-transform duration-300">↑</span>
        </button>
        <div className="w-full border-t border-black/10" />
      </div>

      {/* Giant Wordmark */}
      <div className="w-full text-center relative flex items-center justify-center py-4 md:py-6 pb-6 md:pb-8 overflow-hidden select-none">
        <h2 className="text-[17vw] leading-[0.75] font-sans font-black tracking-tighter text-black uppercase">
          SPIRITBEING
        </h2>
      </div>
    </footer>
  );
};

