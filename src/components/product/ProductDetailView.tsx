import React, { useState } from 'react';
import { Product } from '../../types';
import { ArrowLeft, Check, Plus, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { ProductReviewsSection } from './ProductReviewsSection';
import './ProductDetailView.css';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  initialColor?: string;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onBackToShop: () => void;
  onSelectProduct: (product: Product, selectedColor?: string) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  suppressFixedCtas?: boolean;
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

export const soundOptions = {
  tadaa: () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    playTone(523.25, now, 0.15, 'triangle'); // C5
    playTone(659.25, now + 0.15, 0.15, 'triangle'); // E5
    playTone(523.25, now + 0.3, 1.5, 'square', 0.1); // C5
    playTone(659.25, now + 0.3, 1.5, 'square', 0.1); // E5
    playTone(783.99, now + 0.3, 1.5, 'square', 0.1); // G5
    playTone(1046.50, now + 0.3, 1.5, 'square', 0.1); // C6
  },
  choir: () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
        osc.stop(ctx.currentTime + 2.0);
      }, i * 120);
    });
  },
  retro: () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const freqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + 0.01);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.08);
        osc.stop(ctx.currentTime + 0.08);
      }, i * 60);
    });
  },
  chime: () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1046.50; // C6
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.stop(ctx.currentTime + 1.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = 1052.50;
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  }
};

interface RelatedProductCardProps {
  product: Product;
  onSelect: () => void;
  onAddToCart: (e: React.MouseEvent, size: string, color?: string) => void;
  isAdded: boolean;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
}

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded,
  wishlist = [],
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartXRef = React.useRef<number | null>(null);
  const isDraggingRef = React.useRef<boolean>(false);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const lastStepTimeRef = React.useRef<number>(0);

  const isWishlisted = wishlist.includes(product.id);
  const isSoldOut = !product.inStock;

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

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (productImages.length <= 1) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastStepTimeRef.current < 380) return;
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
      onClick={() => {
        if (isDraggingRef.current) return;
        onSelect();
      }}
      className={`group flex flex-col cursor-pointer transition-transform duration-300 select-none ${
        isSoldOut ? '' : 'hover:-translate-y-1'
      }`}
    >
      {/* Curved Flashcard Image Frame */}
      <div
        ref={frameRef}
        className={`relative aspect-[3/4] w-full rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border shadow-sm touch-pan-y ${
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
            <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-b from-black/20 via-black/45 to-black/60" />
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
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer select-none ${
              isSoldOut ? 'opacity-45 saturate-0' : ''
            } ${
              isWishlisted ? 'text-[#2040FF]' : 'text-[#1b1c1c]/70 hover:text-[#1b1c1c]'
            }`}
            title={isWishlisted ? 'Liked by you! Click to unlike' : 'Like this drop'}
            aria-label={isWishlisted ? 'Unlike product' : 'Like product'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'fill-[#2040FF] text-[#2040FF]' : 'text-[#1b1c1c]'
              }`}
            />
            <span className={`text-[11px] font-mono font-bold ${isWishlisted ? 'text-[#2040FF]' : 'text-[#1b1c1c]'}`}>
              {(product.likesCount || 280) + (isWishlisted ? 1 : 0)}
            </span>
          </button>
        )}

        {/* Horizontal CSS Transform Slider */}
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
                    ? 'grayscale-[0.4] brightness-[0.62] saturate-[0.55]'
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
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
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

        if (!hasSizes && !hasColors) return null;

        return (
          <div className={`flex items-center ${hasSizes && hasColors ? 'justify-between' : hasSizes ? 'justify-start' : 'justify-end'} pt-2 px-1`}>
            {hasSizes && (
              <div className="flex items-center gap-1.5">
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
                      className={`w-7 h-7 flex items-center justify-center text-[11px] font-sans font-medium rounded-md border transition-all cursor-pointer ${
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
                    className="w-7 h-7 flex items-center justify-center text-[10px] font-sans text-[#666666] rounded-md border border-black/15 bg-transparent"
                    title={`${product.sizes!.length - 2} more sizes available`}
                  >
                    +{product.sizes!.length - 2}
                  </div>
                )}
              </div>
            )}

            {hasColors && (
              <div className="flex items-center gap-1.5">
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
          </div>
        );
      })()}

      {/* Card Footer: Title & Price + Hover Add to Bag + Wishlist Heart */}
      <div className="flex items-start justify-between px-1 pt-2">
        <div className="pr-2 flex-grow">
          <h4 className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1a1a1a] tracking-tight leading-snug group-hover:text-black">
            {product.title}
          </h4>
          <div className="relative h-5 mt-1 overflow-hidden w-full">
            <p className="absolute inset-x-0 top-0 font-sans text-[13px] sm:text-[14px] text-[#333333] font-normal tracking-tight transition-all duration-300 transform translate-y-0 group-hover:-translate-y-full group-hover:opacity-0">
              ₹{product.price.toFixed(2)}
            </p>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                if (!product.inStock) return;
                onAddToCart(e, selectedSize, selectedColor);
              }}
              className={`absolute inset-x-0 top-0 font-sans text-[12px] sm:text-[13px] font-bold tracking-wider text-left transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 uppercase ${
                !product.inStock
                  ? 'text-gray-400 cursor-default'
                  : isAdded
                  ? 'text-green-600'
                  : 'text-[#2040FF] hover:text-[#001cbf] hover:underline'
              }`}
            >
              {!product.inStock ? 'Sold Out' : isAdded ? 'Added ✓' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  initialColor,
  wishlist = [],
  onToggleWishlist,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
  suppressFixedCtas = false,
}) => {
  const availableSizes = React.useMemo(() => {
    const standard = ['S', 'M', 'L', 'XL'];
    if (!product.sizes || product.sizes.length === 0) return [];
    return standard.filter((size) => product.sizes!.includes(size));
  }, [product.sizes]);

  const defaultSize = availableSizes[0] || 'M';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultColor);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSizeGuideModal, setShowSizeGuideModal] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number>(0);
  const thumbsScrollRef = React.useRef<HTMLDivElement>(null);

  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [isBlessing, setIsBlessing] = useState<boolean>(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; delay: number; color: string }[]>([]);
  const isProductLiked = wishlist.includes(product.id);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const galleryImages = [
    product.image,
    ...(product.additionalImages && product.additionalImages.length > 0
      ? product.additionalImages
      : [
        '/products/product-sec1.webp',
        '/products/product-sec2.webp',
        '/products/product-sec3.webp'
      ])
  ];

  const handleRelatedPlusClick = (e: React.MouseEvent, relProduct: Product, size?: string, color?: string) => {
    e.stopPropagation();
    const targetSize = size || (relProduct.sizes && relProduct.sizes.length > 0 ? relProduct.sizes[0] : 'M');
    onAddToCart(relProduct, targetSize, color);

    setJustAddedId(relProduct.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === relProduct.id ? null : current));
    }, 1400);
  };

  // Update default state if product changes
  React.useEffect(() => {
    setSelectedSize(availableSizes[0] || 'M');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    setSelectedImage(null);
    setMobileActiveIndex(0);
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [product, availableSizes]);

  const triggerParticles = () => {
    const newParticles = Array.from({ length: 24 }).map((_, i) => {
      // Balloon physics: float upwards (negative y) and drift slightly sideways (random x)
      const x = (Math.random() - 0.5) * 120; // Sideways drift between -60 and +60
      const y = -100 - Math.random() * 200;  // Float up by 100 to 300 pixels
      const colors = ['#2040FF', '#6366F1', '#8B00FF', '#4F46E5', '#D946EF', '#4338CA', '#a5f3fc', '#ffffff'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return {
        id: Date.now() + i,
        x,
        y,
        scale: 0.5 + Math.random() * 0.9,
        delay: Math.random() * 0.4, // Rise one after another like a release of balloons
        color: randomColor,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setIsBouncing(true);
    triggerParticles();
    setTimeout(() => setIsBouncing(false), 600);
    setTimeout(() => setAdded(false), 1800);
  };

  const relatedSectionRef = React.useRef<HTMLDivElement>(null);
  const relatedTrackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const section = relatedSectionRef.current;
      const track = relatedTrackRef.current;
      if (!section || !track) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Determine sticky top offset (mobile: 56px, tablet: 64px, desktop: 80px)
      const stickyOffset = window.innerWidth >= 1024 ? 80 : (window.innerWidth >= 640 ? 64 : 56);
      const totalScrollableDistance = section.clientHeight - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Calculate how far we've scrolled vertically into this sticky section
      const scrolled = stickyOffset - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

      const parentWidth = track.parentElement?.clientWidth || window.innerWidth;
      const maxTranslateX = track.scrollWidth - parentWidth;
      
      if (maxTranslateX > 0) {
        track.style.transform = `translate3d(-${progress * maxTranslateX}px, 0, 0)`;
      } else {
        track.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Synchronize with global Lenis smooth scroll if present
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    // Recalculate on layout/image size changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        handleScroll();
      });
      if (relatedSectionRef.current) ro.observe(relatedSectionRef.current);
      if (relatedTrackRef.current) ro.observe(relatedTrackRef.current);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
      if (ro) {
        ro.disconnect();
      }
    };
  }, []);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  // Dynamic images for the selected product and selected color variant
  const activeColorImages = (selectedColor && product.colorImageMap && product.colorImageMap[selectedColor] && product.colorImageMap[selectedColor].length > 0)
    ? product.colorImageMap[selectedColor]
    : (product.additionalImages && product.additionalImages.length > 0)
      ? [product.image, ...product.additionalImages]
      : [product.image, product.image, product.image, product.image, product.image];

  const mainFixedImage = activeColorImages[0] || product.image;
  const secondaryImagesStack = activeColorImages.length > 1
    ? activeColorImages.slice(1)
    : [mainFixedImage, mainFixedImage, mainFixedImage, mainFixedImage];

  const mobileGalleryImages = [mainFixedImage, ...secondaryImagesStack];

  const scrollThumbIntoView = (index: number) => {
    const container = thumbsScrollRef.current;
    if (!container) return;
    const thumb = container.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const handleMobileThumbNext = () => {
    if (mobileGalleryImages.length <= 1) return;
    const next = (mobileActiveIndex + 1) % mobileGalleryImages.length;
    setMobileActiveIndex(next);
    scrollThumbIntoView(next);
  };

  return (
    <div className="w-full pt-14 md:pt-20 pb-0 lg:pb-12 flex flex-col gap-6 sm:gap-8 relative">
      {/* Top Section: Main Product Details (White Background Container) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-start">
          {/* MOBILE + TABLET: Compact gallery + meta in first viewport */}
          <div className="lg:hidden sb-pdp-mobile w-full">
            <div className="sb-pdp-mobile-hero">
              <div className="sb-pdp-main-image">
                <img
                  src={mobileGalleryImages[mobileActiveIndex] || mainFixedImage}
                  alt={product.title}
                />
              </div>

              <div className="sb-pdp-thumbs-wrap">
                <div
                  ref={thumbsScrollRef}
                  className="sb-pdp-thumbs"
                  aria-label="Product image thumbnails"
                >
                  {mobileGalleryImages.map((imgUrl, idx) => (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      className={`sb-pdp-thumb ${idx === mobileActiveIndex ? 'active' : ''}`}
                      onClick={() => {
                        setMobileActiveIndex(idx);
                        scrollThumbIntoView(idx);
                      }}
                      aria-label={`View image ${idx + 1}`}
                      aria-current={idx === mobileActiveIndex ? 'true' : undefined}
                    >
                      <img src={imgUrl} alt="" />
                    </button>
                  ))}
                </div>

                {mobileGalleryImages.length > 1 && (
                  <button
                    type="button"
                    className="sb-pdp-thumbs-next"
                    onClick={handleMobileThumbNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                )}
              </div>

              <div className="sb-pdp-mobile-meta">
                <h1 className="sb-pdp-mobile-title">{product.title}</h1>
                <p className="sb-pdp-mobile-price">₹{product.price.toFixed(2)}</p>

                {product.colors && product.colors.length > 0 && (
                  <div className="sb-pdp-mobile-colors">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          className={`sb-pdp-color-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedColor(color);
                            setMobileActiveIndex(0);
                          }}
                          aria-label={`Select ${color}`}
                        >
                          <span
                            className="sb-pdp-color-dot"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESKTOP GALLERY (lg+): portrait main fixed + scrolling stack */}
          <div className="hidden lg:grid lg:col-span-8 w-full gap-1 items-start sb-pdp-desktop-gallery">
            <div className="lg:sticky lg:top-16 w-full self-start">
              <img
                src={mainFixedImage}
                alt={product.title}
                className="sb-pdp-desktop-main w-full object-cover rounded-2xl sm:rounded-[20px] border border-black/5 shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              {secondaryImagesStack.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${product.title} detail view ${idx + 1}`}
                  className="w-full h-auto object-cover rounded-2xl sm:rounded-[20px] border border-black/5 shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Product details — mobile/tablet stack below hero · desktop far-right column */}
          <div className="sb-pdp-details-panel lg:col-span-4 lg:col-start-9 flex flex-col items-start text-left w-full lg:max-w-none lg:mx-0 lg:sticky lg:self-start lg:top-14 xl:top-16 lg:max-h-none px-0 transition-all duration-300">
            <div className="hidden md:block lg:block mb-3 lg:mb-4 2xl:mb-4 text-left w-full">
              <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-sans font-medium text-black tracking-tight leading-[1.1] mb-3">
                {product.title}
              </h1>


              {/* Price Row */}
              <div className="flex items-center gap-3 mt-1">
                <p className="sb-pdp-desktop-price">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="sb-pdp-desc w-full mb-3 lg:mb-3.5 2xl:mb-4 text-left md:text-justify">
              {product.description}
            </p>

            {/* Sizes & Size Guide */}
            {availableSizes.length > 0 && !product.title.toLowerCase().includes('cap') && (
              <div className="space-y-2.5 2xl:space-y-3.5 w-full mb-3 lg:mb-4 2xl:mb-5 text-left">
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
                <div className="flex gap-2 2xl:gap-2.5 flex-wrap pt-0.5">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 lg:w-11 lg:h-11 2xl:w-12 2xl:h-12 rounded-[14px] 2xl:rounded-[16px] font-sans text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
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
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="hidden md:block lg:block space-y-2.5 2xl:space-y-3.5 w-full mb-3 lg:mb-4 2xl:mb-5 text-left">
                <span className="block text-xs font-sans font-bold uppercase tracking-widest text-black mb-2 2xl:mb-2.5">
                  COLOR: <span className="text-gray-500 font-normal ml-1">{(selectedColor || product.color || 'BLACK').toUpperCase()}</span>
                </span>
                <div className="flex gap-2 2xl:gap-2.5 flex-wrap pt-0.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    const colorHex = getColorHex(color);
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setMobileActiveIndex(0);
                        }}
                        className={`flex items-center gap-2 2xl:gap-2.5 px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-[14px] 2xl:rounded-[16px] border cursor-pointer transition-all font-sans text-xs font-bold ${isSelected
                            ? 'border-black bg-black text-white shadow-md scale-[1.03]'
                            : 'border-black/10 bg-[#f5f4f0] text-black hover:bg-[#eae8e2]'
                          }`}
                        title={color}
                        aria-label={`Select ${color}`}
                      >
                        <span
                          className={`w-3.5 h-3.5 2xl:w-4 2xl:h-4 rounded-full border ${isSelected ? 'border-white/40' : 'border-black/10'
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

            {/* Desktop: side-by-side CTAs (lg+ only) */}
            <div
              className={`sb-pdp-desktop-ctas hidden md:flex w-full mb-4 lg:mb-6 2xl:mb-8${
                isProductLiked ? ' sb-pdp-desktop-ctas--blessed' : ''
              }`}
            >
              <button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`sb-pdp-desktop-btn sb-pdp-desktop-btn-primary relative ${
                  !product.inStock
                    ? 'border-black/10 bg-black/5 text-black/40 cursor-not-allowed shadow-none'
                    : added
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-black bg-transparent text-black hover:bg-black hover:text-white shadow-sm'
                } ${isBouncing && product.inStock ? 'animate-bounce-click' : ''}`}
              >
                {/* Confetti Particles */}
                {product.inStock && particles.map((p) => (
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
                <div className="relative h-5 overflow-hidden w-full flex justify-center items-center pointer-events-none">
                  {!product.inStock ? (
                    <span className="flex items-center justify-center gap-2 opacity-100 translate-y-0 text-black/40">
                      SOLD OUT
                    </span>
                  ) : (
                    <>
                      <span
                        className={`flex items-center justify-center gap-2 transition-all duration-300 absolute ${added ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
                          }`}
                      >
                        ADD TO BAG
                      </span>
                      <span
                        className={`absolute flex items-center justify-center gap-2 transition-all duration-300 text-emerald-400 ${added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                          }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span className="text-white">ADDED TO BAG</span>
                      </span>
                    </>
                  )}
                </div>
              </button>

              {/* Community Like Button Wrapper */}
              {onToggleWishlist && (
                <div className="sb-pdp-desktop-bless-wrap relative">
                  {toastMessage && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 bg-white/95 text-black border border-black/5 px-4.5 py-2.5 rounded-full text-xs font-sans font-bold tracking-widest uppercase shadow-[0_8px_30px_rgba(0,0,0,0.06)] z-30 flex items-center gap-1.5 animate-cloud-toast pointer-events-none whitespace-nowrap">
                      <span>{toastMessage}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onToggleWishlist(product.id);
                      if (!isProductLiked) {
                        soundOptions.choir();
                        setToastMessage("BLESSED ❤️");
                        setTimeout(() => setToastMessage(null), 2000);
                      }
                    }}
                    className={`sb-pdp-desktop-btn sb-pdp-desktop-btn-bless relative w-full flex items-center justify-center cursor-pointer group overflow-hidden ${isProductLiked
                        ? 'border-rose-500 text-white shadow-md'
                        : 'border-black/15 bg-white text-black hover:border-rose-500 hover:text-rose-600 hover:shadow-[0_0_16px_rgba(244,63,94,0.12)] hover:-translate-y-0.5 active:scale-95'
                      }`}
                    title={isProductLiked ? 'Blessed by you!' : 'Bless this drop'}
                  >
                    {/* Wavy Liquid fill background */}
                    <span
                      className={`absolute left-1/2 top-full w-[300px] h-[300px] bg-rose-500 rounded-[43%] z-0 pointer-events-none transition-transform duration-300 ${isProductLiked ? 'animate-wave-fill' : '-translate-x-1/2 translate-y-[10%]'
                        }`}
                    />

                    <Heart className={`relative z-10 w-3.5 h-3.5 shrink-0 transition-transform duration-500 ${isProductLiked ? 'fill-white text-white scale-110' : 'text-black group-hover:scale-105 group-hover:text-rose-500 group-active:scale-90'}`} />
                    <span
                      className={`relative z-10 whitespace-nowrap transition-all duration-500 overflow-hidden ${
                        isProductLiked ? 'max-w-0 opacity-0 ml-0 mr-0' : 'max-w-[10rem] opacity-100 ml-1 mr-0.5'
                      }`}
                    >
                      BLESS THIS DROP
                    </span>
                    <span className={`relative z-10 px-1.5 py-0.5 rounded-full font-mono font-bold text-[10px] transition-colors duration-300 ${isProductLiked ? 'bg-white text-rose-600' : 'bg-black/5 group-hover:bg-rose-100 group-hover:text-rose-600'}`}>
                      {(product.likesCount || 280) + (isProductLiked ? 1 : 0)}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Drop Options */}
            <div className="w-full pb-4 pt-1 text-left">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-black/55 block mb-2.5">
                Share this drop
              </span>
              <div className="sb-pdp-share-row">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`sb-pdp-share-copy${copied ? ' is-copied' : ''}`}
                  title="Copy link to clipboard"
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                >
                  {copied ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy link'}</span>
                </button>

                <span className="sb-pdp-share-divider" aria-hidden="true" />

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out the ' + product.title + ' on Spirit Being: ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sb-pdp-share-action sb-pdp-share-action--whatsapp"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <WhatsappIcon />
                </a>

                <a
                  href={`https://www.instagram.com/spiritbeinggen`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sb-pdp-share-action sb-pdp-share-action--instagram"
                  title="Share on Instagram"
                  aria-label="Share on Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Spec Meta */}
            <div className="w-full pt-2 pb-6 2xl:pt-4 2xl:pb-8">
              <div className="sb-pdp-specs">
                {product.material && (
                  <div className="sb-pdp-spec-card">
                    <span className="sb-pdp-spec-label">Material</span>
                    <span className="sb-pdp-spec-value">{product.material}</span>
                  </div>
                )}
                <div className="sb-pdp-spec-card">
                  <span className="sb-pdp-spec-label">Color</span>
                  <span className="sb-pdp-spec-value">{(selectedColor || product.color || 'BLACK').toUpperCase()}</span>
                </div>
                {product.origin && (
                  <div className="sb-pdp-spec-card">
                    <span className="sb-pdp-spec-label">Origin</span>
                    <span className="sb-pdp-spec-value">{product.origin}</span>
                  </div>
                )}
                <div className="sb-pdp-spec-card">
                  <span className="sb-pdp-spec-label">Wash Care</span>
                  <span className="sb-pdp-spec-value">Reverse wash only</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Section: Full-Width Pitch Black Reviews (Straight Edges, No Curved Borders) */}
      <div className="w-full bg-[#000000] text-white border-y border-white/10 pt-10 pb-3 sm:pt-14 sm:pb-4 mt-0 mb-0">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ProductReviewsSection product={product} initialVisibleCount={2} loadMoreStep={4} loadMoreLabel="Show more" />
        </div>
      </div>

      {/* Bottom Section: Curated Drops */}
      <div ref={relatedSectionRef} className="w-full h-[250vh] sm:h-[230vh] lg:h-[200vh] relative bg-[#fbf9f9]">
        <div className="sticky top-14 sm:top-16 lg:top-20 w-full pt-1 sm:pt-2 pb-4 overflow-hidden bg-[#fbf9f9]">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
            <div className="pb-3 sm:pb-4">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B3DFF] shadow-[0_0_12px_#0B3DFF]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#8A8D95] font-semibold font-mono">
                  CURATED DROPS
                </span>
              </div>

              {/* Main Headline — stacked mobile · inline on desktop */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-4xl sm:text-6xl font-anton uppercase text-black tracking-normal flex flex-col items-start leading-[0.92] lg:flex-row lg:items-baseline lg:gap-x-3 xl:gap-x-4">
                  <span>Chosen for</span>
                  <span className="text-[#0B3DFF] font-script text-5xl sm:text-7xl capitalize font-normal normal-case">
                    Spirit Beings
                  </span>
                </h2>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-widest hidden sm:inline-block font-semibold">
                  <span>Scroll to explore →</span>
                </span>
              </div>
            </div>

            <div className="sb-pdp-related-scroll w-full overflow-hidden pt-2 pb-4">
              <div
                ref={relatedTrackRef}
                className="flex gap-3.5 sm:gap-4 md:gap-5 transition-transform duration-75 ease-out will-change-transform"
              >
                {relatedProducts.map((rel) => {
                  const isAdded = justAddedId === rel.id;

                  return (
                    <div
                      key={rel.id}
                      className="w-[72vw] sm:w-[46vw] md:w-[35vw] lg:w-[calc((100%-2.625rem)/4)] shrink-0"
                    >
                      <RelatedProductCard
                        product={rel}
                        wishlist={wishlist}
                        onToggleWishlist={onToggleWishlist}
                        onSelect={() => {
                          onSelectProduct(rel);
                          window.scrollTo(0, 0);
                          if ((window as any).lenis) {
                            (window as any).lenis.scrollTo(0, { immediate: true });
                          }
                        }}
                        onAddToCart={(e, size, color) => handleRelatedPlusClick(e, rel, size, color)}
                        isAdded={isAdded}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSizeGuideModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
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
                    <tr><td className="py-2 pr-2 font-bold text-black">S</td><td className="py-2 px-2">41"–42"</td><td className="py-2 px-2">20"</td><td className="py-2 pl-2">27"–28"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">M</td><td className="py-2 px-2">43"–44"</td><td className="py-2 px-2">21"</td><td className="py-2 pl-2">28"–29"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">L</td><td className="py-2 px-2">45"–46"</td><td className="py-2 px-2">22"</td><td className="py-2 pl-2">29"–30"</td></tr>
                    <tr><td className="py-2 pr-2 font-bold text-black">XL</td><td className="py-2 px-2">47"–48"</td><td className="py-2 px-2">22.5"–23"</td><td className="py-2 pl-2">30"–31"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile + tablet: fixed bottom CTAs (hidden when cart/checkout overlays are open) */}
      {!suppressFixedCtas && (
      <div className="sb-pdp-fixed-ctas md:hidden" role="region" aria-label="Product actions">
        <div className="sb-pdp-fixed-ctas-inner">
          <div className="sb-pdp-mobile-ctas sb-pdp-mobile-ctas--fixed">
            {onToggleWishlist && (
              <div className="relative flex-1 min-w-0">
                {toastMessage && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black border border-black/5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md z-30 pointer-events-none whitespace-nowrap">
                    {toastMessage}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onToggleWishlist(product.id);
                    if (!isProductLiked) {
                      soundOptions.choir();
                      setToastMessage('BLESSED ❤️');
                      setTimeout(() => setToastMessage(null), 2000);
                    }
                  }}
                  className={`sb-pdp-btn-bless ${isProductLiked ? 'is-blessed' : ''}`}
                >
                  <Heart className={`w-3.5 h-3.5 shrink-0 ${isProductLiked ? 'fill-white text-white' : 'text-rose-500'}`} />
                  <span className="truncate">Bless the Drop</span>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded-full font-mono text-[9px] ${isProductLiked ? 'bg-white/20' : 'bg-black/5'}`}>
                    {(product.likesCount || 280) + (isProductLiked ? 1 : 0)}
                  </span>
                </button>
              </div>
            )}

            <button
              disabled={!product.inStock}
              onClick={handleAddToCart}
              style={{ overflow: 'visible' }}
              className={`sb-pdp-btn-primary sb-pdp-btn-primary--fixed relative ${
                !product.inStock
                  ? 'border-black/10 bg-black/5 text-black/40 cursor-not-allowed'
                  : added
                  ? 'border-black bg-black text-white'
                  : 'bg-black text-white hover:bg-[#2040FF] hover:border-[#2040FF]'
              } ${isBouncing && product.inStock ? 'animate-bounce-click' : ''}`}
            >
              {product.inStock && particles.map((p) => (
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
              {!product.inStock ? 'Sold Out' : added ? 'Added ✓' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
      )}

      <style>{`
        @keyframes cloud-fade-up {
          0% {
            transform: translate(-50%, 12px) scale(0.85);
            opacity: 0;
            filter: blur(2px);
          }
          12% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          45% {
            transform: translate(-50%, -6px) scale(1.02);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate(-50%, -36px) scale(1.22);
            opacity: 0;
            filter: blur(10px);
          }
        }
        .animate-cloud-toast {
          animation: cloud-fade-up 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.15 + 10px), calc(var(--ty) * 0.15)) scale(var(--scale));
          }
          40% {
            transform: translate(calc(var(--tx) * 0.4 - 15px), calc(var(--ty) * 0.4)) scale(var(--scale));
          }
          70% {
            transform: translate(calc(var(--tx) * 0.7 + 12px), calc(var(--ty) * 0.7)) scale(var(--scale));
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(calc(var(--scale) * 0.4));
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle-burst 2.0s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
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

const LinkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const WhatsappIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.488 2.008 14.025.986 11.998.986c-5.44 0-9.866 4.372-9.87 9.802 0 1.77.483 3.498 1.4 5.012l-1.005 3.678 3.793-1.002zM17.06 14.382c-.276-.138-1.631-.806-1.884-.898-.252-.093-.437-.139-.621.137-.184.276-.713.897-.874 1.082-.161.184-.322.207-.598.069-.276-.138-1.168-.43-2.223-1.372-.82-.733-1.375-1.639-1.536-1.915-.161-.276-.017-.425.121-.563.124-.124.276-.322.414-.483.137-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.621-1.496-.851-2.047-.224-.54-.447-.467-.621-.476-.161-.009-.345-.01-.529-.01-.184 0-.483.069-.736.345-.253.276-.966.943-.966 2.3 0 1.357.989 2.668 1.127 2.852.138.184 1.947 2.973 4.717 4.168.659.285 1.173.454 1.574.582.662.21 1.265.181 1.741.11.531-.079 1.631-.667 1.861-1.311.23-.644.23-1.196.161-1.311-.069-.115-.253-.184-.529-.322z"/>
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

