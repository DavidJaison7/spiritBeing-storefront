import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, color: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, size: string, color: string | undefined) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discount);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SPIRIT10') {
      const disc = subtotal * 0.1;
      setDiscount(disc);
      setPromoMessage('10% Editorial Studio Discount Applied');
    } else if (promoCode.trim().toUpperCase() === 'CHOSEN20') {
      const disc = subtotal * 0.2;
      setDiscount(disc);
      setPromoMessage('20% Collector VIP Discount Applied');
    } else {
      setPromoMessage('Invalid Code (Try SPIRIT10 or CHOSEN20)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Background click to dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Cart Panel */}
      <div className="w-full max-w-md bg-[#F9F7F4] text-[#1A1A1A] h-full flex flex-col border-l border-black/10 shadow-2xl relative z-10 font-sans">
        {/* Header */}
        <div className="p-6 border-b border-black/10 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2 font-sans font-bold text-lg uppercase tracking-wider text-[#1A1A1A]">
            <ShoppingBag className="w-4 h-4 text-[#1A1A1A] stroke-2" />
            <span>SHOPPING CART ({items.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Complimentary Gifts Banner */}
          <div className="bg-[#f0f9ff] border border-[#2040FF]/20 rounded-xl p-4 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#2040FF] text-white flex items-center justify-center shrink-0 font-bold text-xs">
              FREE
            </div>
            <div className="text-xs">
              <p className="font-sans font-bold text-black uppercase tracking-wide flex items-center gap-1.5">
                <span>COMPLIMENTARY GIFTS INCLUDED</span>
              </p>
              <p className="text-gray-600 text-[11px] font-mono mt-0.5">
                • SpiritBeing Weatherproof Sticker Pack<br />
                • Metallic "Chosen One" Enamel Badge
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center my-auto py-12">
              <ShoppingBag className="w-10 h-10 text-black/20 mb-4 stroke-1" />
              <p className="font-sans text-2xl uppercase text-[#1A1A1A]">
                YOUR SELECTION IS EMPTY
              </p>
              <p className="font-sans italic text-sm text-[#666] mt-2 max-w-xs">
                Explore the archive and curate your personal collection.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#1A1A1A] text-white px-8 h-12 text-xs font-sans uppercase tracking-[3px] hover:bg-black/80 cursor-pointer"
              >
                EXPLORE CATALOG
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}`}
                className="flex gap-4 p-4 border border-black/5 bg-white relative group"
              >
                {/* Image */}
                <div className="w-20 h-24 shrink-0 bg-[#E8E4E1]/40 border border-black/5 flex items-center justify-center p-2">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-sans uppercase text-base text-[#1A1A1A] leading-tight">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)
                        }
                        className="text-black/30 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-sans tracking-[1px] text-[#666] uppercase mt-1">
                      SIZE: <span className="text-[#1A1A1A] font-medium">{item.selectedSize}</span>
                      {item.selectedColor && (
                        <>
                          <span className="mx-2 text-[#999]">|</span>
                          COLOR: <span className="text-[#1A1A1A] font-medium">{item.selectedColor}</span>
                        </>
                      )}
                    </p>
                    <p className="text-[11px] font-sans italic text-[#444] mt-0.5">
                      Rs. {item.product.price} EACH
                    </p>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5">
                    <div className="flex items-center border border-black/10">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)
                        }
                        className="p-1.5 hover:bg-black/5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-sans font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)
                        }
                        className="p-1.5 hover:bg-black/5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-sans italic text-[#1A1A1A] text-right mt-3">
                      Rs. {item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-white/90 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. SPIRIT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-black/10 px-3 h-10 text-xs font-sans tracking-[1px] uppercase bg-[#F9F7F4] focus:outline-none focus:border-black"
                />
                <button
                  onClick={applyPromo}
                  className="bg-[#1A1A1A] text-white px-4 h-10 text-xs font-sans uppercase tracking-[2px] hover:bg-black/80 cursor-pointer"
                >
                  APPLY
                </button>
              </div>
              {promoMessage && (
                <p className="text-[10px] font-sans tracking-[1px] text-emerald-700 uppercase">
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 font-sans text-xs pt-3 border-t border-black/5 tracking-[1px]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#666]">SUBTOTAL</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm text-[#507D5A] mt-2 font-medium">
                  <span>DISCOUNT</span>
                  <span>-Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666]">
                <span>ESTIMATED SHIPPING</span>
                <span>COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between items-center text-lg font-sans font-bold uppercase tracking-wider mt-4">
                <span>TOTAL</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-[#1A1A1A] text-white h-14 text-xs font-sans uppercase tracking-[3px] hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 stroke-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-sans tracking-[1px] text-[#888] text-center uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SHOPIFY ENCRYPTED CHECKOUT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
