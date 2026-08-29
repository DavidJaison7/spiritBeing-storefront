import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, ArrowRight, Check, Plus, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { ProductReviewsSection } from './ProductReviewsSection';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  initialColor?: string;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onBackToShop: () => void;
  onSelectProduct: (product: Product, selectedColor?: string) => void;
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
      className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 select-none"
    >
      {/* Curved Flashcard Image Frame */}
      <div
        ref={frameRef}
        className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-black/5 shadow-sm touch-pan-y"
        style={{ overscrollBehaviorX: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Sold Out Badge */}
        {!product.inStock && (
          <div className="absolute top-3.5 left-3.5 z-30 bg-[#080808]/90 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-white/5 select-none">
            Sold Out
          </div>
        )}

        {/* Horizontal CSS Transform Slider */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out pointer-events-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {productImages.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`${product.title} view ${idx + 1}`}
              draggable={false}
              className={`w-full h-full object-cover shrink-0 group-hover:scale-102 transition-transform duration-700 ease-out select-none ${
                !product.inStock ? 'opacity-75 grayscale-[20%]' : ''
              }`}
            />
          ))}
        </div>

        {/* Left Arrow */}
        {productImages.length > 1 && (
          <button
            type="button"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/15 backdrop-blur-md text-white border border-white/20 hover:bg-black/30 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => Math.max(prev - 1, 0));
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Previous image"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        )}

        {/* Right Arrow */}
        {productImages.length > 1 && (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/15 backdrop-blur-md text-white border border-white/20 hover:bg-black/30 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => Math.min(prev + 1, productImages.length - 1));
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Next image"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Carousel Indicator Dots in Bottom Center */}
        {productImages.length > 1 && (
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
      <div className="flex items-center justify-between pt-3 px-1">
        {product.title.toLowerCase().includes('cap') ? (
          <div />
        ) : product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.sizes.slice(0, 2).map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-7 h-7 flex items-center justify-center text-[11px] font-sans font-medium rounded-md border transition-all cursor-pointer ${isSelected
                      ? 'border-black text-black bg-white font-semibold shadow-sm'
                      : 'border-black/15 text-[#666666] bg-transparent hover:border-black/30'
                    }`}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              );
            })}
            {product.sizes.length > 2 && (
              <div
                className="w-7 h-7 flex items-center justify-center text-[10px] font-sans text-[#666666] rounded-md border border-black/15 bg-transparent"
                title={`${product.sizes.length - 2} more sizes available`}
              >
                +{product.sizes.length - 2}
              </div>
            )}
          </div>
        )}

        {/* Colors Selector */}
        {(() => {
          const displayColors = product.colors && product.colors.length > 0 ? product.colors : product.color ? [product.color] : ['Black'];
          return (
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
                    className={`w-5 h-5 rounded-md border transition-all cursor-pointer ${isSelected ? 'border-black scale-105 shadow-sm ring-1 ring-black/20' : 'border-black/15 hover:border-black/40 hover:scale-102'
                      }`}
                    style={{ backgroundColor: bgHex }}
                    title={color}
                    aria-label={`Select ${color} color`}
                  />
                );
              })}
            </div>
          );
        })()}
      </div>

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

        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold transition-all duration-300 cursor-pointer select-none border mt-0.5 ${isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm scale-105'
                : 'bg-white/80 border-black/10 text-gray-700 hover:bg-rose-50/70 hover:text-rose-600 hover:border-rose-200'
              }`}
            title={isWishlisted ? 'Liked by you! Click to unlike' : 'Like this drop'}
            aria-label={isWishlisted ? 'Unlike product' : 'Like product'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-600'
                }`}
            />
            <span>{(product.likesCount || 280) + (isWishlisted ? 1 : 0)}</span>
          </button>
        )}
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
  const [isBlessing, setIsBlessing] = useState<boolean>(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; delay: number; color: string }[]>([]);
  const [isTallViewport, setIsTallViewport] = useState<boolean>(false);

  const isProductLiked = wishlist.includes(product.id);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    const checkViewportHeight = () => {
      // True fullscreen OR window height >= 800px (meaning no searchbars/toolbars shrinking height)
      const isFullscreen = !!document.fullscreenElement;
      setIsTallViewport(isFullscreen || window.innerHeight >= 800);
    };

    checkViewportHeight();
    window.addEventListener('resize', checkViewportHeight);
    document.addEventListener('fullscreenchange', checkViewportHeight);
    return () => {
      window.removeEventListener('resize', checkViewportHeight);
      document.removeEventListener('fullscreenchange', checkViewportHeight);
    };
  }, []);

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
      const totalScrollableDistance = section.clientHeight - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Calculate how far we've scrolled vertically inside this sticky section wrapper
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));

      const maxTranslateX = track.scrollWidth - (track.parentElement?.clientWidth || window.innerWidth);
      if (maxTranslateX > 0) {
        track.style.transform = `translate3d(-${progress * maxTranslateX}px, 0, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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

  return (
    <div className="w-full pb-12 pt-16 md:pt-20 flex flex-col gap-6 sm:gap-8 relative">
      {/* Top Section: Main Product Details (White Background Container) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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
              className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            >
              {mobileGalleryImages.map((imgUrl, idx) => {
                return (
                  <div key={idx} className="w-full shrink-0 snap-center">
                    <img
                      src={imgUrl}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-[68vh] min-h-[460px] object-cover"
                    />
                  </div>
                );
              })}
            </div>

            {/* Curved Square Arrow Bubble Controls & Indicators */}
            <div className="flex items-center justify-between px-2 pt-1">
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
                className={`w-10 h-10 rounded-xl bg-white shadow-md border border-black/10 flex items-center justify-center cursor-pointer transition-all ${mobileActiveIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 text-black'
                  }`}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

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
                    className={`h-2 rounded-full transition-all cursor-pointer ${idx === mobileActiveIndex ? 'w-6 bg-black' : 'w-2 bg-black/25'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

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
                className={`w-10 h-10 rounded-xl bg-white shadow-md border border-black/10 flex items-center justify-center cursor-pointer transition-all ${mobileActiveIndex === mobileGalleryImages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 text-black'
                  }`}
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* DESKTOP GALLERY: 60% Width (lg:col-span-6) -> 30% Stationary Main + 30% Vertical Scrolling Stack (hidden md:grid) */}
          <div className="hidden md:grid lg:col-span-6 w-full grid-cols-2 gap-1 items-start">
            {/* Sub-column 1: 30% Width - Completely Stationary Main Image */}
            <div className="md:sticky md:top-16 w-full self-start">
              <img
                src={mainFixedImage}
                alt={product.title}
                className="w-full h-[calc(100vh-80px)] object-cover rounded-2xl sm:rounded-[20px] border border-black/5 shadow-sm"
              />
            </div>

            {/* Sub-column 2: 30% Width - Vertical Scrolling Secondary Stack */}
            <div className="flex flex-col gap-1 w-full">
              {secondaryImagesStack.map((imgUrl, idx) => {
                return (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`${product.title} detail view ${idx + 1}`}
                    className="w-full h-auto object-cover rounded-2xl sm:rounded-[20px] border border-black/5 shadow-sm"
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: 40% Width (lg:col-span-4) - Product Details & Actions (with Mobile Side Padding) */}
          <div className={`lg:col-span-4 flex flex-col items-center text-center max-w-lg mx-auto w-full lg:sticky self-start px-4 sm:px-6 md:px-2 scrollbar-none transition-all duration-300 ${isTallViewport
              ? 'lg:top-28 lg:pt-16 lg:max-h-none'
              : 'lg:top-14 xl:top-16 lg:pt-0 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto'
            }`}>
            <div className="mb-3 lg:mb-4 2xl:mb-4 text-left w-full">
              <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-sans font-medium text-black tracking-tight leading-[1.1] mb-3">
                {product.title}
              </h1>


              {/* Price Row */}
              <div className="flex items-center gap-3">
                <p className="text-lg sm:text-xl 2xl:text-2xl font-sans font-normal text-[#1a1a1a] tracking-wide">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-gray-800 font-sans text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base leading-relaxed mb-3 lg:mb-3.5 2xl:mb-4 text-justify">
              {product.description}
            </p>

            {/* Sizes & Size Guide */}
            {!product.title.toLowerCase().includes('cap') && (
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
                  {['S', 'M', 'L', 'XL'].map((size) => {
                    const isAvailable = (product.sizes && product.sizes.length > 0) ? product.sizes.includes(size) : true;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        className={`w-10 h-10 lg:w-11 lg:h-11 2xl:w-12 2xl:h-12 rounded-[14px] 2xl:rounded-[16px] font-sans text-xs font-bold transition-all flex items-center justify-center cursor-pointer relative overflow-hidden ${!isAvailable
                            ? 'bg-[#f5f4f0]/50 text-black/25 border border-dashed border-black/15 cursor-not-allowed'
                            : isSelected
                              ? 'bg-black text-white shadow-md scale-[1.03]'
                              : 'bg-[#f5f4f0] text-black hover:bg-[#eae8e2]'
                          }`}
                      >
                        <span className={!isAvailable ? 'opacity-30' : ''}>{size}</span>
                        {/* Blue diagonal line overlay for out of stock sizes */}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[140%] h-[1.5px] bg-[#0B3DFF]/60 rotate-45 transform" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 2xl:space-y-3.5 w-full mb-3 lg:mb-4 2xl:mb-5 text-left">
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
                          if (mobileScrollRef.current) {
                            mobileScrollRef.current.scrollTo({ left: 0 });
                          }
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

            {/* Add to Bag & Community Like Buttons (Dynamic Bento Layout) */}
            <div className="w-full flex gap-3 mb-4 lg:mb-6 2xl:mb-8 px-0.5 py-0.5">
              <button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                style={{
                  overflow: 'visible',
                  flex: isProductLiked ? '1.5 1 0%' : '1 1 0%',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className={`border-2 rounded-[16px] py-3.5 2xl:py-4 text-xs sm:text-sm font-sans font-bold uppercase tracking-widest relative ${
                  !product.inStock
                    ? 'border-black/10 bg-black/5 text-black/40 cursor-not-allowed shadow-none'
                    : added
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-black bg-transparent text-black hover:bg-black hover:text-white shadow-md'
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
                <div className="relative h-6 overflow-hidden w-full flex justify-center items-center pointer-events-none">
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
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        <span className="text-white">ADDED TO BAG</span>
                      </span>
                    </>
                  )}
                </div>
              </button>

              {/* Community Like Button Wrapper */}
              {onToggleWishlist && (
                <div
                  style={{
                    flex: isProductLiked ? '0.5 1 0%' : '1 1 0%',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="relative"
                >
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
                    className={`relative w-full py-3.5 2xl:py-4 rounded-[16px] border-2 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group overflow-hidden ${isProductLiked
                        ? 'border-rose-500 text-white shadow-md scale-[1.02]'
                        : 'border-black/15 bg-white text-black hover:border-rose-500 hover:text-rose-600 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:-translate-y-0.5 active:scale-95'
                      }`}
                    title={isProductLiked ? 'Blessed by you!' : 'Bless this drop'}
                  >
                    {/* Wavy Liquid fill background */}
                    <span
                      className={`absolute left-1/2 top-full w-[300px] h-[300px] bg-rose-500 rounded-[43%] z-0 pointer-events-none transition-transform duration-300 ${isProductLiked ? 'animate-wave-fill' : '-translate-x-1/2 translate-y-[10%]'
                        }`}
                    />

                    <Heart className={`relative z-10 w-4 h-4 shrink-0 transition-transform duration-500 ${isProductLiked ? 'fill-white text-white scale-125' : 'text-black group-hover:scale-110 group-hover:text-rose-500 group-active:scale-90'}`} />
                    <span
                      className={`relative z-10 whitespace-nowrap transition-all duration-500 overflow-hidden ${
                        isProductLiked ? 'max-w-0 opacity-0 ml-0 mr-0' : 'max-w-[150px] opacity-100 ml-1.5 mr-0.5'
                      }`}
                    >
                      BLESS THIS DROP
                    </span>
                    <span className={`relative z-10 px-2 py-0.5 rounded-full font-mono font-bold text-[11px] transition-colors duration-300 ${isProductLiked ? 'bg-white text-rose-600' : 'bg-black/5 group-hover:bg-rose-100 group-hover:text-rose-600'}`}>
                      {(product.likesCount || 280) + (isProductLiked ? 1 : 0)}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Drop Options */}
            <div className="w-full pb-4 pt-1">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-black/55 block mb-2.5 text-left">
                Share this drop
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-white text-black hover:bg-black hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                  title="Copy link to clipboard"
                >
                  <LinkIcon />
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out the ' + product.title + ' on Spirit Being: ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <WhatsappIcon />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out the ' + product.title + ' on Spirit Being: ')}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                  title="Share on X"
                >
                  <XIcon />
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"
                  title="Share on Facebook"
                >
                  <FacebookIcon />
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(product.title)}&body=${encodeURIComponent('Check out the ' + product.title + ' on Spirit Being: ' + window.location.href)}`}
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer"
                  title="Share via Email"
                >
                  <MailIcon />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all cursor-pointer"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>

                <a
                  href={`sms:?&body=${encodeURIComponent('Check out the ' + product.title + ' on Spirit Being: ' + window.location.href)}`}
                  className="w-8 h-8 rounded-full border border-black/15 bg-white text-black flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-all cursor-pointer"
                  title="Share via Messages"
                >
                  <MessagesIcon />
                </a>
              </div>
            </div>

            {/* Spec Meta */}
            <div className="w-full pt-4 2xl:pt-6">
              <div className="text-[11px] md:text-[12px] text-gray-700 font-sans uppercase tracking-[0.08em] space-y-1.5 2xl:space-y-2 font-bold text-left">
                {product.material && <p>MATERIAL: {product.material}</p>}
                <p>COLOR: {selectedColor || product.color || 'BLACK'}</p>
                {product.origin && <p>ORIGIN: {product.origin}</p>}
                <p>WASH CARE: REVERSE WASH ONLY</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Section: Full-Width Pitch Black Reviews (Straight Edges, No Curved Borders) */}
      <div className="w-full bg-[#000000] text-white border-y border-white/10 pt-10 pb-3 sm:pt-14 sm:pb-4 mt-0 mb-0">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ProductReviewsSection product={product} />
        </div>
      </div>

      {/* Bottom Section: Scroll-Driven Pinned Horizontal Track for YOU MAY ALSO LIKE */}
      <div ref={relatedSectionRef} className="w-full h-[180vh] relative bg-[#fbf9f9]">
        <div className="sticky top-20 w-full pt-0 pb-4 overflow-hidden bg-[#fbf9f9]">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
            <div className="border-b border-gray-200 pb-4">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B3DFF] shadow-[0_0_12px_#0B3DFF]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#8A8D95] font-semibold font-mono">
                  CURATED DROPS
                </span>
              </div>

              {/* Main Headline with Electric Blue Cursive Script "Like" */}
              <div className="flex items-baseline justify-between flex-wrap gap-4">
                <h2 className="text-4xl sm:text-6xl font-anton uppercase text-black tracking-normal flex items-baseline gap-3">
                  <span>CHOSEN FOR</span>
                  <span className="text-[#0B3DFF] font-yellowtail text-5xl sm:text-7xl capitalize font-normal">
                    Spirit Beings
                  </span>
                </h2>
                <span className="text-xs font-sans text-gray-500 uppercase tracking-widest hidden sm:inline-block font-semibold">
                  SCROLL DOWN TO EXPLORE →
                </span>
              </div>
            </div>

            <div className="w-full overflow-hidden pt-2 pb-4">
              <div
                ref={relatedTrackRef}
                className="flex gap-3.5 transition-transform duration-75 ease-out will-change-transform"
              >
                {relatedProducts.map((rel) => {
                  const isAdded = justAddedId === rel.id;

                  return (
                    <div
                      key={rel.id}
                      className="w-[78vw] sm:w-[44vw] md:w-[calc((100%-2.625rem)/4)] lg:w-[calc((100%-2.625rem)/4)] shrink-0"
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

      {/* Size Guide Modal Overlay */}
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

const XIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const MailIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MessagesIcon: React.FC = () => (
  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

