import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, Check, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
}
const getColorHex = (colorName: string) => {
  const normalized = colorName.toLowerCase();
  if (normalized.includes('black')) return '#1a1a1a';
  if (normalized.includes('white') || normalized.includes('clear')) return '#fcfcfc';
  if (normalized.includes('grey') || normalized.includes('charcoal')) return '#4a4a4a';
  if (normalized.includes('blue') || normalized.includes('navy') || normalized.includes('cobalt')) return '#2040FF';
  if (normalized.includes('red')) return '#8b0000';
  if (normalized.includes('olive')) return '#556b2f';
  return '#cccccc';
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
}) => {
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultColor);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSizeGuideModal, setShowSizeGuideModal] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number>(0);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);

  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; delay: number; color: string }[]>([]);

  const galleryImages = [
    product.image,
    ...(product.additionalImages && product.additionalImages.length > 0
      ? product.additionalImages
      : [
          '/products/product-sec1.jpg',
          '/products/product-sec2.png',
          '/products/product-sec3.png'
        ])
  ];

  const handleRelatedPlusClick = (e: React.MouseEvent, relProduct: Product) => {
    e.stopPropagation();
    const defaultSize = relProduct.sizes && relProduct.sizes.length > 0 ? relProduct.sizes[0] : 'M';
    onAddToCart(relProduct, defaultSize, undefined);
    
    setJustAddedId(relProduct.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === relProduct.id ? null : current));
    }, 1400);
  };

  // Update default state if product changes
  React.useEffect(() => {
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    setSelectedImage(null);
    setMobileActiveIndex(0);
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTo({ left: 0 });
    }
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [product]);

  const triggerParticles = () => {
    const newParticles = Array.from({ length: 18 }).map((_, i) => {
      const angle = (i / 18) * 360 + (Math.random() - 0.5) * 15;
      const distance = 45 + Math.random() * 85;
      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance;
      const colors = ['#2040FF', '#6366F1', '#8B00FF', '#A020F0', '#4F46E5', '#D946EF', '#4338CA', '#a5f3fc'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return {
        id: Date.now() + i,
        x,
        y,
        scale: 0.4 + Math.random() * 0.7,
        delay: Math.random() * 0.08,
        color: randomColor,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setIsBouncing(true);
    triggerParticles();
    setTimeout(() => setIsBouncing(false), 600);
    setTimeout(() => setAdded(false), 1800);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  // Dynamic images for the selected product and selected color variant
  const activeColorImages = (selectedColor && product.colorImageMap && product.colorImageMap[selectedColor] && product.colorImageMap[selectedColor].length > 0)
    ? product.colorImageMap[selectedColor]
    : (product.additionalImages && product.additionalImages.length > 0)
      ? [product.image, ...product.additionalImages]
      : [product.image, product.image, product.image, product.image];

  const mainFixedImage = activeColorImages[0] || product.image;
  const secondaryImagesStack = activeColorImages.length > 1
    ? activeColorImages.slice(1)
    : [mainFixedImage, mainFixedImage, mainFixedImage];

  const mobileGalleryImages = [mainFixedImage, ...secondaryImagesStack];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20 md:pt-28 flex flex-col gap-20">

      {/* Main Product Layout: 60% Left (Images) and 40% Right (Details) */}
      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">
        {/* MOBILE GALLERY: Horizontal Swipe Carousel with Curved Square Arrow Controls (md:hidden) */}
        <div className="md:hidden w-full flex flex-col gap-3.5">
          <div
            ref={mobileScrollRef}
            onScroll={(e) => {
              const target = e.currentTarget;
              if (target.clientWidth > 0) {
                const idx = Math.round(target.scrollLeft / target.clientWidth);
                setMobileActiveIndex(idx);
              }
            }}
            className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-[20px]"
          >
            {mobileGalleryImages.map((imgUrl, idx) => {
              const isPng = imgUrl.endsWith('.png');
              return (
                <div key={idx} className="w-full shrink-0 snap-center">
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${idx + 1}`}
                    className={`w-full h-[68vh] min-h-[460px] rounded-[20px] bg-[#e8e5de] ${
                      isPng ? 'object-contain p-4' : 'object-cover object-center'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Curved Square Arrow Bubble Controls & Indicators */}
          <div className="flex items-center justify-between px-2 pt-1">
            {/* Left Curved Square Arrow Button */}
            <button
              type="button"
              onClick={() => {
                const nextIdx = Math.max(0, mobileActiveIndex - 1);
                if (mobileScrollRef.current) {
                  mobileScrollRef.current.scrollTo({
                    left: nextIdx * mobileScrollRef.current.clientWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              disabled={mobileActiveIndex === 0}
              className={`w-10 h-10 rounded-xl bg-white shadow-md border border-black/10 flex items-center justify-center cursor-pointer transition-all ${
                mobileActiveIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 text-black'
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2">
              {mobileGalleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (mobileScrollRef.current) {
                      mobileScrollRef.current.scrollTo({
                        left: idx * mobileScrollRef.current.clientWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === mobileActiveIndex ? 'w-6 bg-black' : 'w-2 bg-black/25'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Curved Square Arrow Button */}
            <button
              type="button"
              onClick={() => {
                const nextIdx = Math.min(mobileGalleryImages.length - 1, mobileActiveIndex + 1);
                if (mobileScrollRef.current) {
                  mobileScrollRef.current.scrollTo({
                    left: nextIdx * mobileScrollRef.current.clientWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              disabled={mobileActiveIndex === mobileGalleryImages.length - 1}
              className={`w-10 h-10 rounded-xl bg-white shadow-md border border-black/10 flex items-center justify-center cursor-pointer transition-all ${
                mobileActiveIndex === mobileGalleryImages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 text-black'
              }`}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* DESKTOP GALLERY: 60% Width (lg:col-span-6) -> 30% Stationary Main + 30% Vertical Scrolling Stack (hidden md:grid) */}
        <div className="hidden md:grid lg:col-span-6 w-full grid-cols-2 gap-2.5 items-start">
          {/* Sub-column 1: 30% Width - Completely Stationary Main Image */}
          <div className="md:sticky md:top-24 w-full self-start">
            <img
              src={mainFixedImage}
              alt={product.title}
              className="w-full h-[calc(100vh-140px)] min-h-[580px] max-h-[900px] object-cover object-center rounded-[20px] bg-[#e8e5de]"
            />
          </div>

          {/* Sub-column 2: 30% Width - Vertical Scrolling Secondary Stack */}
          <div className="flex flex-col gap-2.5 w-full">
            {secondaryImagesStack.map((imgUrl, idx) => {
              const isPng = imgUrl.endsWith('.png');
              return (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${product.title} detail view ${idx + 1}`}
                  className={`w-full h-auto rounded-[20px] bg-[#e8e5de] ${
                    isPng ? 'object-contain p-4' : 'object-cover object-center'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: 40% Width (lg:col-span-4) - Product Details & Actions (with Mobile Side Padding) */}
        <div className="lg:col-span-4 flex flex-col items-center text-center max-w-lg mx-auto w-full lg:sticky lg:top-28 self-start px-4 sm:px-6 md:px-0">
          <div className="space-y-2 mb-5">
            <p className="text-[#2040FF] font-headline text-sm font-bold tracking-wider uppercase mb-1">
              {product.tagline || "YOU'RE GETTING WARMER"}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-normal text-black leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-body-garamond font-bold mt-2 text-[#1b1c1c]">
              Rs. {product.price}
            </p>
          </div>

          <p className="text-gray-800 font-sans text-sm md:text-base leading-relaxed mb-8 text-justify">
            {product.description}
          </p>

          {/* Sizes & Size Guide */}
          <div className="space-y-3 w-full mb-8 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-black">
                SELECT SIZE
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuideModal(true)}
                className="text-[11px] font-sans font-medium uppercase tracking-wider text-black/70 hover:text-black underline underline-offset-4 cursor-pointer transition-colors"
              >
                SIZE GUIDE
              </button>
            </div>
            <div className="flex gap-2.5 flex-wrap pt-1">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const isAvailable = (product.sizes && product.sizes.length > 0) ? product.sizes.includes(size) : true;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    className={`w-12 h-12 rounded-[16px] font-sans text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      !isAvailable
                        ? 'bg-[#f5f4f0] text-black/45 line-through border border-dashed border-black/25 cursor-not-allowed'
                        : isSelected
                        ? 'bg-black text-white shadow-md scale-[1.03]'
                        : 'bg-[#f5f4f0] text-black hover:bg-[#eae8e2]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3 w-full mb-8 text-left">
              <span className="block text-xs font-sans font-bold uppercase tracking-widest text-black mb-2.5">
                COLOR: <span className="text-gray-500 font-normal ml-1">{(selectedColor || product.color || 'BLACK').toUpperCase()}</span>
              </span>
              <div className="flex gap-2.5 flex-wrap pt-1">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  const colorHex = getColorHex(color);
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setMobileActiveIndex(0);
                        if (mobileScrollRef.current) {
                          mobileScrollRef.current.scrollTo({ left: 0 });
                        }
                      }}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[16px] border cursor-pointer transition-all font-sans text-xs font-bold ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-md scale-[1.03]'
                          : 'border-black/10 bg-[#f5f4f0] text-black hover:bg-[#eae8e2]'
                      }`}
                      title={color}
                      aria-label={`Select ${color}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border ${
                          isSelected ? 'border-white/40' : 'border-black/10'
                        }`}
                        style={{ backgroundColor: colorHex }}
                      />
                      <span>{color.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Bag Button */}
          <div className="w-full mb-8">
            <button
              onClick={handleAddToCart}
              style={{ overflow: 'visible' }}
              className={`w-full border-2 border-black rounded-full py-4 text-base font-sans font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md relative ${
                added ? 'bg-black text-white' : 'bg-transparent'
              } ${isBouncing ? 'animate-bounce-click' : ''}`}
            >
              {/* Confetti Particles */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="absolute pointer-events-none w-2 h-2 rounded-full z-20 animate-particle -ml-1 -mt-1"
                  style={{
                    left: '50%',
                    top: '50%',
                    backgroundColor: p.color,
                    '--tx': `${p.x}px`,
                    '--ty': `${p.y}px`,
                    '--scale': p.scale,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties}
                />
              ))}

              {/* Text Slide transition container */}
              <div className="relative h-6 overflow-hidden w-full flex justify-center items-center pointer-events-none">
                <span
                  className={`flex items-center justify-center gap-2 transition-all duration-300 absolute ${
                    added ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
                  }`}
                >
                  ADD TO BAG
                </span>
                <span
                  className={`absolute flex items-center justify-center gap-2 transition-all duration-300 text-emerald-400 ${
                    added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-white">ADDED TO BAG</span>
                </span>
              </div>
            </button>
          </div>

          {/* Spec Meta */}
          <div className="w-full pt-6 border-t border-gray-300">
            <div className="text-[11px] md:text-[12px] text-gray-700 font-sans uppercase tracking-[0.08em] space-y-1.5 font-bold text-left">
              {product.material && <p>MATERIAL: {product.material}</p>}
              <p>COLOR: {selectedColor || product.color || 'BLACK'}</p>
              {product.origin && <p>ORIGIN: {product.origin}</p>}
              <p>WASH CARE: REVERSE WASH ONLY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-8 pt-12 border-t border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-sans font-bold tracking-wider uppercase text-black">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProducts.map((rel) => {
            const isAdded = justAddedId === rel.id;

            return (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  window.scrollTo(0, 0);
                  if ((window as any).lenis) {
                    (window as any).lenis.scrollTo(0, { immediate: true });
                  }
                }}
                className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Curved Flashcard Image Frame */}
                <div className="relative aspect-[3/4] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#e8e5de] border border-black/5 shadow-sm">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Carousel Indicator Dots in Bottom Center */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
                  </div>
                </div>

                {/* Card Footer: Title & Price + Plus / Added Button */}
                <div className="flex items-start justify-between pt-3.5 px-1">
                  <div className="pr-2">
                    <h4 className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1a1a1a] tracking-tight leading-snug group-hover:text-black">
                      {rel.title}
                    </h4>
                    <p className="font-sans text-[13px] sm:text-[14px] text-[#333333] mt-1 font-normal tracking-tight">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRelatedPlusClick(e, rel)}
                    className={`w-7 h-7 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer mt-0.5 ${
                      isAdded
                        ? 'bg-black text-white scale-110'
                        : 'text-[#111111] hover:bg-black/10 hover:scale-105'
                    }`}
                    title={isAdded ? 'Added to cart' : 'Add to cart'}
                    aria-label="Add to cart"
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[1.5]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Size Guide Modal Overlay */}
      {showSizeGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div
            className="bg-white text-black p-6 sm:p-8 rounded-[24px] max-w-md w-full relative shadow-2xl space-y-4 border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-sans font-bold tracking-widest uppercase">SIZE GUIDE</h3>
              <button
                onClick={() => setShowSizeGuideModal(false)}
                className="text-gray-400 hover:text-black text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-gray-700 leading-relaxed">
              <p className="font-bold text-black uppercase tracking-wider text-[11px]">STANDARD DROP SHOULDER SIZE ESTIMATES</p>

              {/* Size Table */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-black uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 pr-2 font-bold">SIZE</th>
                      <th className="py-2.5 px-2 font-bold">CHEST</th>
                      <th className="py-2.5 px-2 font-bold">SHOULDER</th>
                      <th className="py-2.5 pl-2 font-bold">LENGTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#333]">
                    <tr><td className="py-2 pr-2 font-bold text-black">XS</td><td className="py-2 px-2">39"–40"</td><td className="py-2 px-2">19.5"</td><td className="py-2 pl-2">26.5"–27"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">S</td><td className="py-2 px-2">41"–42"</td><td className="py-2 px-2">20"</td><td className="py-2 pl-2">27"–28"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">M</td><td className="py-2 px-2">43"–44"</td><td className="py-2 px-2">21"</td><td className="py-2 pl-2">28"–29"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">L</td><td className="py-2 px-2">45"–46"</td><td className="py-2 px-2">22"</td><td className="py-2 pl-2">29"–30"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">XL</td><td className="py-2 px-2">47"–48"</td><td className="py-2 px-2">22.5"–23"</td><td className="py-2 pl-2">30"–31"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">XXL</td><td className="py-2 px-2">49"–50"</td><td className="py-2 px-2">23.5"–24"</td><td className="py-2 pl-2">31"–32"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(var(--scale));
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle-burst 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes button-bounce {
          0% { transform: scale(1); }
          15% { transform: scale(0.92); }
          50% { transform: scale(1.05); }
          75% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .animate-bounce-click {
          animation: button-bounce 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
};

