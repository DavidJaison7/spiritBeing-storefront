import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { Heart } from 'lucide-react';

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

export interface ProductCardProps {
  product: Product;
  onSelect: (selectedColor?: string) => void;
  onAddToCart: (e: React.MouseEvent, size: string, color?: string) => void;
  isAdded: boolean;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded,
  wishlist,
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastWheelTimeRef = useRef<number>(0);

  const isWishlisted = wishlist.includes(product.id);
  const isSoldOut = !product.inStock;

  // Get all unique images for this product, scoped to selected color if applicable
  const getProductImages = () => {
    const images: string[] = [];

    if (selectedColor && product.colorImageMap && product.colorImageMap[selectedColor] && product.colorImageMap[selectedColor].length > 0) {
      return product.colorImageMap[selectedColor];
    }

    if (product.image) images.push(product.image);

    if (product.additionalImages) {
      product.additionalImages.forEach(img => {
        if (!images.includes(img)) images.push(img);
      });
    }

    return images.length > 0 ? images : [product.image];
  };

  const productImages = getProductImages();

  const frameRef = useRef<HTMLDivElement>(null);
  const lastStepTimeRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartXRef.current = e.clientX;
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartXRef.current === null) return;
    if (Math.abs(e.clientX - pointerStartXRef.current) > 8) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartXRef.current === null) return;
    const diffX = pointerStartXRef.current - e.clientX;
    pointerStartXRef.current = null;

    if (Math.abs(diffX) > 25 && productImages.length > 1) {
      const now = Date.now();
      if (now - lastStepTimeRef.current > 250) {
        lastStepTimeRef.current = now;
        if (diffX > 0) {
          setActiveIndex((prev) => Math.min(prev + 1, productImages.length - 1));
        } else if (diffX < 0) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    }

    // Reset drag status on tick end
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (productImages.length <= 1) return;

      // If user is swiping horizontally on trackpad/mouse
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        // Prevent Chrome, Edge, Safari, Brave browser history BACK / FORWARD page gesture
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastStepTimeRef.current < 380) return; // 380ms clean cooldown between slides
        lastStepTimeRef.current = now;

        if (e.deltaX > 0) {
          setActiveIndex((prev) => Math.min(prev + 1, productImages.length - 1));
        } else if (e.deltaX < 0) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
    };
  }, [productImages.length]);

  return (
    <div
      onClick={(e) => {
        if (isDraggingRef.current) return;
        onSelect(selectedColor);
      }}
      className={`group flex flex-col cursor-pointer transition-transform duration-300 select-none max-sm:hover:translate-y-0 ${
        isSoldOut ? '' : 'sm:hover:-translate-y-1'
      }`}
    >
      {/* Curved Flashcard Image Frame */}
      <div
        ref={frameRef}
        className={`relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl md:rounded-[20px] overflow-hidden bg-white border shadow-sm touch-pan-y ${
          isSoldOut ? 'border-black/10' : 'border-black/5'
        }`}
        style={{ overscrollBehaviorX: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Out of Stock Overlay */}
        {isSoldOut && (
          <>
            <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-b from-black/10 via-black/28 to-black/42" />
            <div className="absolute inset-0 z-[18] pointer-events-none flex items-center justify-center p-6">
              <span className="inline-flex items-center justify-center min-w-[108px] px-5 py-2.5 rounded-full border border-white/25 bg-black/40 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_36px_rgba(0,0,0,0.28)]">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white">
                  Sold Out
                </span>
              </span>
            </div>
          </>
        )}

        {/* Floating Top-Right Wishlist/Likes Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-30 max-sm:px-2 max-sm:py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center gap-1 sm:gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer select-none ${
            isWishlisted ? 'text-[#2040FF]' : 'text-[#1b1c1c]/70 hover:text-[#1b1c1c]'
          }`}
          title={isWishlisted ? 'Liked by you! Click to unlike' : 'Like this drop'}
          aria-label={isWishlisted ? 'Unlike product' : 'Like product'}
        >
          <Heart
            className={`max-sm:w-3 max-sm:h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isWishlisted ? 'fill-[#2040FF] text-[#2040FF]' : 'text-[#1b1c1c]'
            }`}
          />
          <span className={`max-sm:text-[9px] sm:text-[11px] font-mono font-bold ${isWishlisted ? 'text-[#2040FF]' : 'text-[#1b1c1c]'}`}>
            {(product.likesCount || 280) + (isWishlisted ? 1 : 0)}
          </span>
        </button>

        {/* Horizontal CSS Transform Slider (Safari & Chrome Crash-Proof) */}
        <div
          className="w-full h-full flex flex-nowrap transition-transform duration-500 ease-out pointer-events-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {productImages.map((imgUrl, idx) => (
            <div key={idx} className="w-full h-full shrink-0 overflow-hidden">
              <img
                src={imgUrl}
                alt={`${product.title} view ${idx + 1}`}
                draggable={false}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out select-none ${
                  isSoldOut
                    ? 'grayscale-[0.28] brightness-[0.78] saturate-[0.68]'
                    : idx === activeIndex
                      ? 'group-hover:scale-105'
                      : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        {productImages.length > 1 && !isSoldOut && (
          <button
            type="button"
            className="rail-arrow-btn rail-arrow-btn--prev sb-card-rail-arrow absolute left-1.5 sm:left-2.5 md:left-3 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {productImages.length > 1 && !isSoldOut && (
          <button
            type="button"
            className="rail-arrow-btn rail-arrow-btn--next sb-card-rail-arrow absolute right-1.5 sm:right-2.5 md:right-3 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev + 1) % productImages.length);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        )}

        {/* Carousel Indicator Dots in Bottom Center */}
        {productImages.length > 1 && !isSoldOut && (
          <div className="absolute bottom-2 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-10 max-sm:scale-90">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${idx === activeIndex ? 'w-3.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                  } shadow-sm`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Row of Selectors: Sizes on Left, Colors on Right */}
      {(() => {
        const isNoSizeCategory =
          product.title.toLowerCase().includes('cap') ||
          product.title.toLowerCase().includes('tote') ||
          product.category === 'Caps' ||
          product.category === 'Tote Bags' ||
          product.category === 'Accessories' ||
          (product.sizes && product.sizes.includes('ONE SIZE'));

        const hasSizes = !isNoSizeCategory && product.sizes && product.sizes.length > 0 && !product.sizes.includes('ONE SIZE');
        const displayColors = product.colors && product.colors.length > 0 ? product.colors : product.color ? [product.color] : [];
        const hasColors = displayColors.length > 1;
        const hasColorsMobile = displayColors.length > 0;

        if (!hasSizes && !hasColors && !hasColorsMobile) return null;

        return (
          <div className={`flex items-center max-sm:pt-1.5 sm:pt-2 px-0.5 sm:px-1 ${hasSizes && (hasColors || hasColorsMobile) ? 'justify-between' : hasSizes ? 'justify-start' : 'justify-end'}`}>
            {hasSizes && (
              <div className="flex items-center gap-1 max-sm:gap-0.5 sm:gap-1.5">
                {product.sizes!.slice(0, 2).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`max-sm:w-6 max-sm:h-6 sm:w-7 sm:h-7 flex items-center justify-center max-sm:text-[9px] sm:text-[11px] font-sans font-medium rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black text-black bg-white font-semibold shadow-sm'
                          : 'border-black/15 text-[#666666] bg-transparent hover:border-black/30'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
                {product.sizes!.length > 2 && (
                  <div
                    className="max-sm:w-6 max-sm:h-6 sm:w-7 sm:h-7 flex items-center justify-center max-sm:text-[8px] sm:text-[10px] font-sans text-[#666666] rounded-md border border-black/15 bg-transparent"
                    title={`${product.sizes!.length - 2} more sizes available`}
                  >
                    +{product.sizes!.length - 2}
                  </div>
                )}
              </div>
            )}

            {hasColors && (
              <div className="hidden sm:flex items-center gap-1.5">
                {displayColors.map((color) => {
                  const isSelected = selectedColor === color || (!selectedColor && displayColors.length === 1);
                  const bgHex = getColorHex(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color);
                        setActiveIndex(0);
                      }}
                      className={`w-5 h-5 rounded-md border transition-all cursor-pointer ${
                        isSelected ? 'border-black scale-105 shadow-sm ring-1 ring-black/20' : 'border-black/15 hover:border-black/40 hover:scale-102'
                      }`}
                      style={{ backgroundColor: bgHex }}
                      title={color}
                      aria-label={`Select ${color} color`}
                    />
                  );
                })}
              </div>
            )}

            {hasColorsMobile && (
              <div className="flex sm:hidden items-center gap-1">
                {displayColors.slice(0, 2).map((color) => {
                  const isSelected = selectedColor === color || (!selectedColor && displayColors.length === 1);
                  const bgHex = getColorHex(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color);
                        setActiveIndex(0);
                      }}
                      className={`w-4 h-4 rounded border transition-all cursor-pointer ${
                        isSelected ? 'border-black scale-105 shadow-sm ring-1 ring-black/20' : 'border-black/15'
                      }`}
                      style={{ backgroundColor: bgHex }}
                      title={color}
                      aria-label={`Select ${color} color`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Card Footer: Title & Price + Add to Bag on hover */}
      <div className="flex items-start justify-between max-sm:px-0 sm:px-1 max-sm:pt-1.5 sm:pt-2">
        <div className="pr-1 sm:pr-2 flex-grow min-w-0">
          <h3 className={`font-sans font-medium max-sm:text-[11px] sm:text-[14px] md:text-[15px] tracking-tight leading-snug line-clamp-2 ${
            isSoldOut ? 'text-[#888888]' : 'text-[#1a1a1a] group-hover:text-black'
          }`}>
            {product.title}
          </h3>
          <div className="relative max-sm:h-4 sm:h-5 mt-0.5 sm:mt-1 overflow-hidden w-full">
            {isSoldOut ? (
              <p className="font-sans max-sm:text-[10px] sm:text-[12px] text-[#999999] font-medium tracking-wide uppercase">
                Sold Out
              </p>
            ) : (
              <>
                <p className="absolute inset-x-0 top-0 font-sans max-sm:text-[10px] sm:text-[13px] md:text-[14px] text-[#333333] font-normal tracking-tight transition-all duration-300 transform translate-y-0 group-hover:-translate-y-full group-hover:opacity-0">
                  ₹{product.price.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(e, selectedSize, selectedColor);
                  }}
                  className={`absolute inset-x-0 top-0 font-sans max-sm:text-[9px] sm:text-[12px] md:text-[13px] font-bold tracking-wider text-left transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 uppercase ${
                    isAdded
                      ? 'text-green-600'
                      : 'text-[#2040FF] hover:text-[#001cbf] hover:underline'
                  }`}
                >
                  {isAdded ? 'Added ✓' : 'Add to Bag'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product, selectedColor?: string) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}) => {
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const bestSellers = products.slice(0, 8);

  const handlePlusClick = (e: React.MouseEvent, product: Product, size: string, color?: string) => {
    e.stopPropagation();
    onAddToCart(product, size, color);

    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === product.id ? null : current));
    }, 1400);
  };

  return (
    <section id="products-grid" className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-12 md:py-16 text-black">
      {/* Section Header: BEST SELLERS OF SPIRITBEING */}
      <div className="border-b border-gray-200 pb-8 sm:pb-10 mb-8 sm:mb-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B3DFF] shadow-[0_0_12px_#0B3DFF]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#8A8D95] font-semibold font-mono">
            HOT DROPS
          </span>
        </div>

        {/* Main Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          <h2 className="text-4xl sm:text-6xl font-anton uppercase text-black tracking-normal flex items-baseline gap-3 flex-wrap">
            <span>BEST SELLERS OF</span>
            <span className="text-[#0B3DFF] font-script text-5xl sm:text-7xl capitalize font-normal">
              Spirit Being
            </span>
          </h2>
        </div>
      </div>

      {/* Flashcards Grid — 2 cols mobile, up to 8 best sellers */}
      <div className="sb-product-grid">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={(color) => onSelectProduct(product, color)}
            onAddToCart={(e, size, color) => handlePlusClick(e, product, size, color)}
            isAdded={justAddedId === product.id}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
};
