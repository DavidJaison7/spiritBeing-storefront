import React from 'react';
import { CartItem, Product } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowUpRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onShopNow?: () => void;
  onUpdateQuantity: (productId: string, size: string, color: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, size: string, color: string | undefined) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  products = [],
  onSelectProduct,
  onShopNow,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
      document.body.style.overflow = 'hidden';
    } else {
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      document.body.style.overflow = '';
    }

    return () => {
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const total = subtotal;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Background click to dismiss */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Cart Panel */}
      <div
        className="w-full max-w-md bg-[#FBF9F9] text-[#1A1A1A] h-full flex flex-col border-l border-black/10 shadow-2xl relative z-10 font-sans sm:rounded-l-[28px] overflow-hidden"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/8 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 font-sans font-bold text-base md:text-lg uppercase tracking-wider text-[#1A1A1A]">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-black stroke-[2]" />
            </div>
            <span>YOUR BAG ({totalItemCount})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 overscroll-contain flex flex-col justify-start" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="h-full flex flex-col justify-between pt-4 pb-2">
              <div className="text-left space-y-2">
                <h2 className="text-3xl sm:text-4xl font-headline font-bold text-black tracking-tight leading-none">
                  Your bag is empty!
                </h2>
                <p className="text-sm font-sans text-gray-600 font-medium">
                  Let's get started
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onShopNow) {
                      onShopNow();
                    } else {
                      setTimeout(() => {
                        const el = document.getElementById('products-grid') || document.getElementById('product-grid');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          if ((window as any).lenis) {
                            (window as any).lenis.scrollTo(el);
                          }
                        }
                      }, 100);
                    }
                  }}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-sans font-bold text-black border-b-2 border-black pb-0.5 hover:opacity-70 transition-all cursor-pointer"
                >
                  <span>Shop now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Products you may like Carousel */}
              {products && products.length > 0 && (
                <div className="pt-8">
                  <h4 className="font-sans font-bold text-sm text-black tracking-tight mb-3 uppercase">
                    Products you may like
                  </h4>
                  <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                    {products.slice(0, 6).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct?.(prod);
                          window.scrollTo(0, 0);
                          if ((window as any).lenis) {
                            (window as any).lenis.scrollTo(0, { immediate: true });
                          }
                        }}
                        className="w-28 sm:w-32 shrink-0 group cursor-pointer"
                      >
                        <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#e8e5de] border border-black/5 shadow-xs">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="font-sans font-medium text-[11px] text-black mt-1.5 truncate">
                          {prod.title}
                        </p>
                        <p className="font-sans text-[10px] text-gray-500 font-normal">
                          Rs. {prod.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Complimentary Gifts Perk Box */}
              <div className="bg-gradient-to-r from-[#2040FF]/8 to-purple-500/8 border border-[#2040FF]/15 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2040FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div className="text-xs flex-grow">
                  <p className="font-sans font-bold text-black uppercase tracking-wide text-[11px]">
                    COMPLIMENTARY GIFTS INCLUDED
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5 leading-snug">
                    Weatherproof Sticker Pack + Metallic "Chosen One" Badge
                  </p>
                </div>
              </div>

              {items.map((item) => {
                const displayImage =
                  item.selectedColor &&
                  item.product.colorImageMap &&
                  item.product.colorImageMap[item.selectedColor]?.[0]
                    ? item.product.colorImageMap[item.selectedColor][0]
                    : item.product.image;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}`}
                    className="flex gap-4 p-4 rounded-2xl border border-black/6 bg-white shadow-sm hover:shadow-md transition-all relative group"
                  >
                    {/* Image Thumbnail */}
                    <div className="w-20 h-24 shrink-0 rounded-xl bg-[#f5f3ef] border border-black/5 overflow-hidden flex items-center justify-center p-1.5">
                      <img
                        src={displayImage}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-sans font-bold uppercase text-xs sm:text-sm text-[#1A1A1A] leading-snug pr-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() =>
                            onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 text-[#333] border border-black/10">
                          SIZE: {item.selectedSize}
                        </span>
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 text-[#333] border border-black/10">
                            COLOR: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/5">
                      <div className="flex items-center bg-black/5 rounded-lg border border-black/10 p-0.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)
                          }
                          className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-sans font-bold text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)
                          }
                          className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-sans font-bold text-sm text-[#1A1A1A]">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </>
          )}
        </div>

        {/* Cart Footer Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-black/8 bg-white space-y-4 shadow-lg sticky bottom-0 z-20">
            {/* Calculations Summary */}
            <div className="space-y-2 font-sans text-xs">
              <div className="flex justify-between items-center text-xs text-gray-600 font-medium uppercase tracking-wide">
                <span>SUBTOTAL</span>
                <span className="text-black font-bold">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-600 font-medium uppercase tracking-wide">
                <span>ESTIMATED SHIPPING</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>

              <div className="flex justify-between items-center text-base font-sans font-bold text-black uppercase tracking-wider pt-2 border-t border-black/10">
                <span>TOTAL</span>
                <span className="text-lg">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-black text-white h-13 rounded-2xl text-xs font-bold uppercase tracking-[2px] hover:bg-black/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-sans font-semibold text-gray-500 uppercase tracking-widest pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SHOPIFY ENCRYPTED CHECKOUT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
