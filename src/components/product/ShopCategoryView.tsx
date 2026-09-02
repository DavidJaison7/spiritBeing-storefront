import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductGrid';
import './ShopCategoryView.css';

interface ShopCategoryViewProps {
  products: Product[];
  onSelectProduct: (product: Product, selectedColor?: string) => void;
  onNavigateHome: () => void;
  initialSection?: string;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (product: Product, size: string, color?: string) => void;
}

export const ShopCategoryView: React.FC<ShopCategoryViewProps> = ({
  products,
  onSelectProduct,
  onNavigateHome,
  initialSection = 'tshirts',
  wishlist = [],
  onToggleWishlist,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSection);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product, size: string, color?: string) => {
    if (onAddToCart) {
      onAddToCart(product, size, color);
    }
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const tshirtsSectionRef = useRef<HTMLDivElement>(null);
  const capsSectionRef = useRef<HTMLDivElement>(null);
  const totebagsSectionRef = useRef<HTMLDivElement>(null);

  // Filter products by category
  const tshirtProducts = products.filter(
    (p) =>
      p.category === 'Apparel' ||
      p.title.toLowerCase().includes('tee') ||
      p.title.toLowerCase().includes('t-shirt')
  ).slice(0, 4);

  const capProducts = products.filter(
    (p) =>
      p.category === 'Accessories' ||
      p.title.toLowerCase().includes('cap') ||
      p.title.toLowerCase().includes('hat')
  ).slice(0, 4);

  const toteProducts = products.filter(
    (p) =>
      p.category === 'Tote Bags' ||
      p.title.toLowerCase().includes('tote') ||
      p.title.toLowerCase().includes('bag')
  ).slice(0, 4);

  const scrollToCategory = (categoryKey: string) => {
    setActiveTab(categoryKey);
    let targetEl: HTMLDivElement | null = null;
    if (categoryKey === 'tshirts') targetEl = tshirtsSectionRef.current;
    if (categoryKey === 'caps') targetEl = capsSectionRef.current;
    if (categoryKey === 'totebags') targetEl = totebagsSectionRef.current;

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (initialSection) {
      setTimeout(() => {
        scrollToCategory(initialSection);
      }, 100);
    }
  }, [initialSection]);

  // Scroll Spy: Update activeTab dynamically as user scrolls through sections
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'section-tshirts') {
            setActiveTab('tshirts');
          } else if (entry.target.id === 'section-caps') {
            setActiveTab('caps');
          } else if (entry.target.id === 'section-totebags') {
            setActiveTab('totebags');
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (tshirtsSectionRef.current) observer.observe(tshirtsSectionRef.current);
    if (capsSectionRef.current) observer.observe(capsSectionRef.current);
    if (totebagsSectionRef.current) observer.observe(totebagsSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderProductCard = (product: Product) => {
    return (
      <ProductCard
        key={product.id}
        product={product}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist || (() => {})}
        onSelect={(color) => onSelectProduct(product, color)}
        onAddToCart={(e, size, color) => handleAddToCart(e, product, size, color)}
        isAdded={justAddedId === product.id}
      />
    );
  };

  return (
    <div className="sb-shop-view-container pt-20 pb-24">
      {/* Header Banner */}
      <div className="w-full px-6 md:px-12 pt-6 pb-5">
        {/* Small Top Tag Dot */}
        <div className="inline-flex items-center gap-2 mb-2 select-none">
          <span className="w-2 h-2 rounded-full bg-[#0B3DFF] shadow-[0_0_10px_#0B3DFF] animate-pulse shrink-0" />
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#666666] uppercase">
            SHOP BY CATEGORY
          </span>
        </div>

        {/* Main Title matching Reference Image font format */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-anton font-black uppercase text-[#1b1c1c] tracking-tight leading-none">
          CATEGORIES OF{' '}
          <span className="font-yellowtail normal-case text-[#2040FF] font-normal tracking-normal ml-1 inline-block">
            Spirit Being
          </span>
        </h1>

        <p className="text-sm md:text-base text-[#666666] font-sans mt-3 max-w-2xl leading-relaxed">
          Explore our heavy-weight oversized Unisex Tees, premium caps, and everyday streetwear canvas totes designed with faith and purpose.
        </p>
      </div>

      {/* Sticky 3-Tabs Bar */}
      <div className="sb-tabs-bar">
        <div className="w-full px-6 md:px-12 flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => scrollToCategory('tshirts')}
            className={`sb-tab-btn cursor-pointer ${activeTab === 'tshirts' ? 'active' : ''}`}
          >
            Oversized T-Shirts
          </button>
          <button
            onClick={() => scrollToCategory('caps')}
            className={`sb-tab-btn cursor-pointer ${activeTab === 'caps' ? 'active' : ''}`}
          >
            Caps
          </button>
          <button
            onClick={() => scrollToCategory('totebags')}
            className={`sb-tab-btn cursor-pointer ${activeTab === 'totebags' ? 'active' : ''}`}
          >
            Tote Bags
          </button>
        </div>
      </div>

      {/* Main Category Sections */}
      <div className="w-full px-6 md:px-12 pt-10 space-y-20">
        {/* Section 1: Oversized T-Shirts */}
        <section
          ref={tshirtsSectionRef}
          id="section-tshirts"
          className="sb-category-section"
        >
          <div className="flex items-baseline justify-between border-b border-[#000]/10 pb-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-[#1b1c1c] uppercase">
              OVERSIZED T-SHIRTS
            </h2>
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider">
              {tshirtProducts.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tshirtProducts.map(renderProductCard)}
          </div>
        </section>

        {/* Section 2: Caps */}
        <section
          ref={capsSectionRef}
          id="section-caps"
          className="sb-category-section"
        >
          <div className="flex items-baseline justify-between border-b border-[#000]/10 pb-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-[#1b1c1c] uppercase">
              CAPS
            </h2>
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider">
              {capProducts.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capProducts.map(renderProductCard)}
          </div>
        </section>

        {/* Section 3: Tote Bags */}
        <section
          ref={totebagsSectionRef}
          id="section-totebags"
          className="sb-category-section"
        >
          <div className="flex items-baseline justify-between border-b border-[#000]/10 pb-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-[#1b1c1c] uppercase">
              TOTE BAGS
            </h2>
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider">
              {toteProducts.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toteProducts.map(renderProductCard)}
          </div>
        </section>
      </div>
    </div>
  );
};
