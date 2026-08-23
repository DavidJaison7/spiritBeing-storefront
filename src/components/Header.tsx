import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Github, ArrowLeft } from 'lucide-react';
import { ShopifyConfig } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShopifySync: () => void;
  onNavigateHome: () => void;
  shopifyConfig: ShopifyConfig;
  currentView: 'home' | 'product_detail';
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenShopifySync,
  onNavigateHome,
  shopifyConfig,
  currentView,
}) => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 10) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showHeaderStyle = currentView === 'product_detail' || isScrolledPastHero;
  
  // Dynamic classes for header visibility
  const headerBg = showHeaderStyle ? 'bg-[#fbf9f9] drop-shadow-sm' : 'bg-transparent';
  const textColor = showHeaderStyle ? 'text-black' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-3 md:py-4 transition-all duration-500 ${headerBg} ${textColor}`}>
      {/* Left nav - SHOP or BACK TO STORE */}
      <div className="flex items-center gap-6 w-1/3">
        {currentView === 'product_detail' ? (
          <button
            onClick={onNavigateHome}
            className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
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
        )}
      </div>

      {/* Center Logo */}
      <div className="w-1/3 flex justify-center text-center items-center">
        <button
          onClick={onNavigateHome}
          className={`transition-all duration-300 cursor-pointer hover:opacity-70 ${
            showHeaderStyle
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <img src="/Header_logo.png" alt="Spirit Being Logo" className="h-6 md:h-8 object-contain" />
        </button>
      </div>

      {/* Right nav - CART */}
      <div className="w-1/3 flex justify-end items-center gap-4 md:gap-6">
        <button
          onClick={onOpenCart}
          className="text-sm font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          <span>CART ({cartCount})</span>
        </button>
      </div>

      {/* Inverted Corner - Left */}
      <svg 
        className={`absolute top-full left-0 w-6 h-6 transition-colors duration-500 ${showHeaderStyle ? 'text-[#fbf9f9]' : 'text-transparent'}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 A 24 24 0 0 0 0 24 V 0 Z" />
      </svg>

      {/* Inverted Corner - Right */}
      <svg 
        className={`absolute top-full right-0 w-6 h-6 transition-colors duration-500 ${showHeaderStyle ? 'text-[#fbf9f9]' : 'text-transparent'}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 V 24 A 24 24 0 0 0 0 0 Z" />
      </svg>
    </header>
  );
};


