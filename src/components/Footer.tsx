import React from 'react';
import { Camera, Briefcase, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#fbf9f9] text-black relative z-10 overflow-hidden pt-10">
      {/* Blue Marquee Ticker */}
      <div className="w-full overflow-hidden bg-transparent text-[#2040FF] pb-8 whitespace-nowrap">
        <div className="animate-ticker text-sm sm:text-base font-space-mono font-bold tracking-[0.2em] uppercase leading-none">
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
          <div className="flex flex-col gap-3 font-sans text-[11px] text-[#4a4a4a]">
            <h3 className="font-bold text-black mb-0.5 text-[12px]">Connect with us</h3>
            <a href="#" className="hover:text-black transition-colors">Call</a>
            <a href="#" className="hover:text-black transition-colors">Text (WhatsApp)</a>
            <a href="#" className="hover:text-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-black transition-colors">YouTube</a>
            <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          </div>

          {/* Order Support */}
          <div className="flex flex-col gap-3 font-sans text-[11px] text-[#4a4a4a]">
            <h3 className="font-bold text-black mb-0.5 text-[12px]">Order Support</h3>
            <a href="#" className="hover:text-black transition-colors">Make a return/Exchange</a>
            <a href="#" className="hover:text-black transition-colors">Refund/Exchange policy</a>
            <a href="#" className="hover:text-black transition-colors">Track your order</a>
            <a href="#" className="hover:text-black transition-colors">Shipping policy</a>
            <a href="#" className="hover:text-black transition-colors">FAQ's</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>

        {/* Middle: Newsletter */}
        <div className="flex flex-col gap-3 font-sans text-[11px] lg:items-center">
          <div className="w-full max-w-[280px]">
            <h3 className="font-bold text-black mb-3 text-[12px] uppercase tracking-wider">Sign up for our newsletter</h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full">
              <input
                type="email"
                placeholder="enter email"
                className="bg-transparent border border-black/20 rounded-sm px-3 py-2 text-[11px] w-full focus:outline-none focus:border-black font-sans lowercase"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-sm text-[11px] font-bold tracking-wider hover:bg-black/80 transition-colors cursor-pointer"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Right: Info Text */}
        <div className="flex flex-col gap-2 font-sans text-[10px] sm:text-[11px] text-[#666] uppercase tracking-[0.05em] lg:items-end lg:text-right">
          <p className="font-bold text-black tracking-widest text-[11px] sm:text-[12px] mb-1">24/7 ONLINE STORE • SHIPPING ACROSS INDIA</p>
          <p>EST. 2026 • BASED IN INDIA</p>
          <p className="text-gray-400">© SPIRITBEING, {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Horizontal divider line above Giant Wordmark (Exact same length max-w-[1600px] px-6 md:px-12) */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="border-t border-black/10" />
      </div>

      {/* Giant Wordmark */}
      <div className="w-full text-center relative flex items-center justify-center py-4 md:py-6 pb-6 md:pb-8 overflow-hidden select-none">
        <h2 className="text-[17vw] leading-[0.75] font-headline font-black tracking-tighter text-black uppercase">
          SPIRITBEING
        </h2>
      </div>
    </footer>
  );
};

