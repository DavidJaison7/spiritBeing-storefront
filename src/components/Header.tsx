import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, RefreshCw, Github, ArrowLeft, User } from 'lucide-react';
import { ShopifyConfig } from '../types';
import { CollectionsMegaMenu } from './CollectionsMegaMenu';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShopifySync: () => void;
  onNavigateHome: () => void;
  onOpenLogin: () => void;
  onNavigateOurStory: () => void;
  shopifyConfig: ShopifyConfig;
  currentView: 'home' | 'product_detail' | 'our_story' | 'blog';
  onOpenBlog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenShopifySync,
  onNavigateHome,
  onOpenLogin,
  onNavigateOurStory,
  shopifyConfig,
  currentView,
  onOpenBlog,
}) => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mega Menu State
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const openTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMegaMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (isMegaMenuOpen) return;
    openTimer.current = setTimeout(() => setIsMegaMenuOpen(true), 70);
  };

  const handleMegaMenuLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (!isMegaMenuOpen) return;
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 220);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  const isOurStoryView = currentView === 'our_story';
  const isBlogView = currentView === 'blog';
  
  // Force white header if mega menu is open
  const showHeaderStyle = isMegaMenuOpen || ((currentView === 'product_detail' || isScrolledPastHero) && !isOurStoryView && !isBlogView);
  const showLogo = showHeaderStyle || isOurStoryView || isBlogView;
  
  // Dynamic classes for header visibility
  const headerBg = isMegaMenuOpen 
    ? 'bg-[#fbf9f9]' // Remove drop shadow so it blends perfectly with the mega menu
    : (isOurStoryView || isBlogView)
    ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-md'
    : showHeaderStyle
    ? 'bg-[#fbf9f9] drop-shadow-sm'
    : 'bg-transparent';
    
  const textColor = isMegaMenuOpen 
    ? 'text-black'
    : (isOurStoryView || isBlogView) ? 'text-white' : showHeaderStyle ? 'text-black' : 'text-white';

  const cornerColor = isMegaMenuOpen
    ? 'text-transparent' // Hide inverted corners when mega menu drops down to prevent them cutting into the panel
    : (isOurStoryView || isBlogView)
    ? 'text-[#080808]/90'
    : showHeaderStyle
    ? 'text-[#fbf9f9]'
    : 'text-transparent';

  return (
    <>
    <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-2 md:py-2.5 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${headerBg} ${textColor}`}>
      {/* Left nav - SHOP or BACK TO STORE */}
      <div className="flex items-center gap-6 w-1/3">
        {currentView === 'product_detail' || currentView === 'our_story' || currentView === 'blog' ? (
          <button
            onClick={onNavigateHome}
            className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                const el = document.getElementById('products-grid');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity cursor-pointer"
            >
              SHOP
            </button>
            <button
              className="text-sm font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1.5 hidden md:flex"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              onClick={(e) => {
                e.preventDefault();
                setIsMegaMenuOpen(!isMegaMenuOpen);
              }}
            >
              Collections
              <span className={`text-[9px] transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </>
        )}
      </div>

      {/* Center Logo */}
      <div className="w-1/3 flex justify-center text-center items-center">
        <button
          onClick={onNavigateHome}
          className={`transition-all duration-300 cursor-pointer hover:opacity-70 ${
            showLogo
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <img 
            src={(isOurStoryView || isBlogView) ? "/assets/img_logo_white.png" : "/sb-blue-header.png"} 
            alt="Spirit Being Logo" 
            className="h-[22px] md:h-[28px] object-contain" 
          />
        </button>
      </div>

      {/* Right nav - OUR STORY, BLOG, CART, MENU */}
      <div className="w-1/3 flex justify-end items-center gap-4 md:gap-6 relative">
        <button
          onClick={onNavigateOurStory}
          className="hidden md:block text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
        >
          OUR STORY
        </button>
        <button
          onClick={onOpenBlog}
          className="hidden md:block text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
        >
          BLOG
        </button>
        <button
          onClick={onOpenCart}
          className="text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
        >
          CART ({cartCount})
        </button>
        
        {/* Toggle Dropdown Menu (Two horizontal lines `=`) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col justify-center items-center gap-[4px] w-6 h-6 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span className="w-[18px] h-[1.8px] bg-current rounded-full transition-all"></span>
          <span className="w-[18px] h-[1.8px] bg-current rounded-full transition-all"></span>
        </button>

        {/* Dropdown Menu popover */}
        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-full right-0 mt-3.5 w-[290px] bg-[#fbf9f9] border border-black/10 rounded-2xl shadow-xl z-50 text-black p-5 flex flex-col gap-4 text-left select-none"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.08))' }}
          >
            <div>
              <h3 className="font-sans text-lg font-bold text-black uppercase tracking-wide">Welcome</h3>
              <p className="font-sans text-[11px] text-gray-500 mt-1 leading-normal">
                To access account and manage orders
              </p>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenLogin();
                }}
                className="w-full mt-3.5 bg-black text-white text-[11px] font-bold py-3 rounded-xl tracking-wider hover:bg-black/80 transition-all cursor-pointer text-center uppercase"
              >
                Login / Signup
              </button>
            </div>
            
            <div className="h-[1px] bg-black/10 my-0.5"></div>
            
            <div className="flex flex-col gap-3.5 pb-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  alert('Order tracking integration is coming soon!');
                }}
                className="w-full text-left font-sans text-[13px] font-medium text-black/85 hover:text-black hover:translate-x-1 transition-all cursor-pointer"
              >
                Track your order
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  alert('Returns & exchanges portal coming soon!');
                }}
                className="w-full text-left font-sans text-[13px] font-medium text-black/85 hover:text-black hover:translate-x-1 transition-all cursor-pointer"
              >
                Returns & Exchanges
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  alert('Our support team is available 24/7. Reach out to support@spiritbeing.in');
                }}
                className="w-full text-left font-sans text-[13px] font-medium text-black/85 hover:text-black hover:translate-x-1 transition-all cursor-pointer"
              >
                Support
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  alert('FAQ section is coming soon!');
                }}
                className="w-full text-left font-sans text-[13px] font-medium text-black/85 hover:text-black hover:translate-x-1 transition-all cursor-pointer"
              >
                FAQ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inverted Corner - Left */}
      <svg 
        className={`absolute top-full left-0 w-6 h-6 transition-colors duration-500 ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 A 24 24 0 0 0 0 24 V 0 Z" />
      </svg>

      {/* Inverted Corner - Right */}
      <svg 
        className={`absolute top-full right-0 w-6 h-6 transition-colors duration-500 ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 V 24 A 24 24 0 0 0 0 0 Z" />
      </svg>

      {/* Mega Menu */}
      <CollectionsMegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)}
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
      />
    </header>
    </>
  );
};


