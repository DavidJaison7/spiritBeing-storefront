import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductGrid';
import './ShopCategoryView.css';

const SHOP_HERO_IMAGE = '/assets/Collections/webp/essentials.webp';

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
  initialSection = 'top',
  wishlist = [],
  onToggleWishlist,
  onAddToCart
}) => {
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product, size: string, color?: string) => {
    if (onAddToCart) {
      onAddToCart(product, size, color);
    }
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const tshirtsSectionRef = useRef<HTMLElement>(null);
  const capsSectionRef = useRef<HTMLElement>(null);
  const totebagsSectionRef = useRef<HTMLElement>(null);

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

  const scrollToShopSection = (sectionKey: string) => {
    if (sectionKey === 'top') {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.82 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    let targetEl: HTMLElement | null = null;
    if (sectionKey === 'tshirts') targetEl = tshirtsSectionRef.current;
    if (sectionKey === 'caps') targetEl = capsSectionRef.current;
    if (sectionKey === 'totebags') targetEl = totebagsSectionRef.current;

    if (targetEl) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetEl, { duration: 0.82, offset: -8 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      scrollToShopSection(initialSection);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [initialSection]);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const syncHeaderOffset = () => {
      const height = Math.round(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--sb-shop-header-offset', `${height}px`);
    };

    syncHeaderOffset();
    window.addEventListener('resize', syncHeaderOffset);

    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);

    return () => {
      window.removeEventListener('resize', syncHeaderOffset);
      observer.disconnect();
      document.documentElement.style.removeProperty('--sb-shop-header-offset');
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
    <div className="sb-shop-view-container pb-24">
      <div className="sb-shop-view__hero">
        <img
          src={SHOP_HERO_IMAGE}
          alt=""
          className="sb-shop-view__hero-img"
          decoding="async"
        />
        <div className="sb-shop-view__hero-scrim" aria-hidden="true" />

        <button
          type="button"
          className="sb-shop-view__back"
          onClick={onNavigateHome}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          <span>Back</span>
        </button>

        <div className="sb-shop-view__hero-copy">
          <h1 className="sb-shop-view__title">Shop by Category</h1>
          <p className="sb-shop-view__desc">
            Explore oversized unisex tees, premium caps, and everyday canvas totes — designed with faith and purpose.
          </p>
        </div>
      </div>

      <div className="sb-shop-scroll">
        <div className="w-full px-6 md:px-12 pt-4 md:pt-10 space-y-20">
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

            <div className="sb-product-grid">
              {tshirtProducts.map(renderProductCard)}
            </div>
          </section>

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

            <div className="sb-product-grid">
              {capProducts.map(renderProductCard)}
            </div>
          </section>

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

            <div className="sb-product-grid">
              {toteProducts.map(renderProductCard)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
