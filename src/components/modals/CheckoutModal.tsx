import React, { useState } from 'react';
import { CartItem, OrderDetails } from '../../types';
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'shoppay' | 'applepay'>('shoppay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const total = subtotal;

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: OrderDetails = {
        id: `SB-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: name || 'Valued Customer',
        email: email || 'customer@spiritbeing.studio',
        shippingAddress: address || '100 Spring Street',
        city: city || 'New York',
        postalCode: zip || '10012',
        country: 'United States',
        items: [...items],
        subtotal,
        shipping: 0,
        total,
        paymentMethod,
        createdAt: new Date().toLocaleTimeString(),
      };
      setCompletedOrder(newOrder);
      setStep('confirmation');
      onClearCart();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#F9F7F4] text-[#1A1A1A] border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans-editorial">
        {/* Header */}
        <div className="p-6 border-b border-black/10 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 stroke-1" />
            <h3 className="font-headline font-bold uppercase text-xl text-[#1A1A1A]">
              SPIRITBEING — SECURE CHECKOUT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'confirmation' && completedOrder ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-sans-editorial uppercase tracking-[3px] text-emerald-700 font-medium block mb-1">
                  PAYMENT SUCCESSFUL
                </span>
                <h2 className="text-4xl font-serif-editorial uppercase text-[#1A1A1A]">
                  SELECTION CONFIRMED
                </h2>
                <p className="text-xs font-sans-editorial text-[#666] uppercase tracking-[1px] mt-1">
                  ORDER NO: <span className="text-[#1A1A1A] font-medium">{completedOrder.id}</span>
                </p>
              </div>

              <div className="border border-black/5 bg-white p-5 text-left font-sans-editorial text-xs tracking-[1px] space-y-2.5 uppercase">
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span>COLLECTOR:</span>
                  <span className="font-medium text-[#1A1A1A]">{completedOrder.customerName} ({completedOrder.email})</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span>DESTINATION:</span>
                  <span className="font-medium text-[#1A1A1A]">{completedOrder.shippingAddress}, {completedOrder.city}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span>TOTAL DISPATCHED:</span>
                  <span className="font-medium text-[#1A1A1A]">${completedOrder.total.toFixed(2)} VIA {completedOrder.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESTIMATED DELIVERY:</span>
                  <span className="font-medium text-emerald-700">3-5 BUSINESS DAYS</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-serif-editorial italic text-[#555]">
                  A detailed gazette receipt and courier tracking dispatch link have been sent to your email.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#1A1A1A] text-white px-8 h-12 text-xs font-sans-editorial uppercase tracking-[3px] hover:bg-black/80 cursor-pointer"
                >
                  RETURN TO CATALOG
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProcessOrder} className="space-y-6">
              {/* Order Summary banner */}
              <div className="bg-white border border-black/5 p-4 space-y-1.5 text-xs font-sans-editorial tracking-[1px]">
                <div className="flex justify-between font-serif-editorial text-lg text-[#1A1A1A] uppercase">
                  <span>SELECTION TOTAL ({items.reduce((a, b) => a + b.quantity, 0)} ITEMS):</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-[#666] text-[11px] truncate uppercase">
                  OBJECTS: {items.map((i) => `${i.product.title} (${i.selectedSize}) x${i.quantity}`).join(', ')}
                </div>
              </div>

              {/* Express checkout options */}
              <div className="space-y-2">
                <span className="text-[11px] font-sans-editorial uppercase tracking-[2px] text-[#888] block">
                  EXPRESS PAYMENT METHOD:
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs font-sans-editorial tracking-[1px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('shoppay')}
                    className={`py-3 border text-center uppercase transition-colors cursor-pointer ${
                      paymentMethod === 'shoppay'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-medium'
                        : 'border-black/10 bg-white hover:border-black'
                    }`}
                  >
                    Shop Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`py-3 border text-center uppercase transition-colors cursor-pointer ${
                      paymentMethod === 'applepay'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-medium'
                        : 'border-black/10 bg-white hover:border-black'
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 border text-center uppercase transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-black/10 bg-white hover:border-black'
                    }`}
                  >
                    Credit Card
                  </button>
                </div>
              </div>

              {/* Shipping & Contact Info */}
              <div className="space-y-3 font-sans-editorial text-xs tracking-[1px]">
                <span className="text-[11px] uppercase tracking-[2px] text-[#888] block font-medium border-b border-black/5 pb-1">
                  SHIPPING & DESTINATION
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[#666] uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-black/10 p-2.5 bg-white focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[#666] uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/10 p-2.5 bg-white focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-[#666] uppercase">STREET ADDRESS</label>
                  <input
                    type="text"
                    required
                    placeholder="100 Spring Street, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-black/10 p-2.5 bg-white focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[#666] uppercase">CITY</label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-black/10 p-2.5 bg-white focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[#666] uppercase">POSTAL CODE</label>
                    <input
                      type="text"
                      required
                      placeholder="10012"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full border border-black/10 p-2.5 bg-white focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details if Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 font-sans-editorial text-xs tracking-[1px] pt-2">
                  <span className="text-[11px] uppercase tracking-[2px] text-[#888] block font-medium border-b border-black/5 pb-1">
                    CREDIT CARD SPECIFICATION
                  </span>
                  <div>
                    <label className="block mb-1 text-[#666] uppercase">CARD NUMBER</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-black/10 p-2.5 pl-9 bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-black/40 absolute left-2.5 top-2.5 stroke-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#1A1A1A] text-white h-14 text-xs font-sans-editorial uppercase tracking-[3px] hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>PROCESSING PAYLOAD WITH SHOPIFY...</span>
                ) : (
                  <>
                    <span>COMPLETE ORDER (${total.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4 stroke-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-sans-editorial tracking-[1px] text-[#888] text-center uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-BIT ENCRYPTED SHOPIFY CHECKOUT SIMULATION</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
