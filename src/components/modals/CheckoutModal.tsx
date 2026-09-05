import React, { useState, useEffect } from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  Smartphone, 
  MapPin, 
  Check, 
  FileText,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../layout/Header';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  currentUser?: UserProfile | null;
  onOpenOrderHub?: (tab?: 'active' | 'history') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
  currentUser,
  onOpenOrderHub,
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  
  // Returning Customer Saved Address State
  const [useSavedAddress, setUseSavedAddress] = useState(true);

  // Form States (Pre-filled if customer is logged in)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  
  // Payment States (100% Prepaid via Shopify Shop Pay, UPI, Cards — Zero COD)
  const [paymentMethod, setPaymentMethod] = useState<'shoppay' | 'upi' | 'card'>('shoppay');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  // Pre-fill fields whenever currentUser is provided or changed
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || 'David Jaison');
      setEmail(currentUser.email || 'davidj@gmail.com');
      setPhone(currentUser.phone || '+91 98765 43210');
      setStreet('Flat 402, Zion Court, 12th Cross');
      setLocality('Indiranagar 2nd Stage');
      setCity('Bengaluru');
      setState('Karnataka');
      setPincode('560038');
      setUseSavedAddress(true);
    } else {
      setUseSavedAddress(false);
    }
  }, [currentUser, isOpen]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const lenis = (window as any).lenis;
    if (lenis) lenis.stop();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal > 1000 ? 150 : 0;
  const shippingFee = 0; // Free express delivery
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomId = `SB-${Math.floor(10000 + Math.random() * 90000)}`;
      setCompletedOrderId(randomId);
      setStep('confirmation');
      onClearCart();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      data-lenis-prevent="true"
      style={{ overscrollBehavior: 'contain' }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-[#fbf9f9] text-[#1b1c1c] w-full max-w-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[92vh] border border-black/10 transition-all duration-300"
        role="dialog"
        aria-modal="true"
        data-lenis-prevent="true"
        style={{ overscrollBehavior: 'contain' }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-display text-xs">
              SB
            </div>
            <div>
              <h3 className="font-display text-sm tracking-wider uppercase text-black">
                SPIRIT BEING • SECURE CHECKOUT
              </h3>
              <p className="text-[10px] font-mono text-neutral-400">
                256-bit Encrypted • Shopify Payments Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div 
          className="p-6 overflow-y-auto space-y-6 flex-1 overscroll-contain"
          data-lenis-prevent="true"
          style={{ overscrollBehavior: 'contain' }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* ============================================================== */}
          {/* STEP 3: ORDER CONFIRMATION & BILLING CONFIRMED                 */}
          {/* ============================================================== */}
          {step === 'confirmation' && completedOrderId ? (
            <div className="text-center py-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  PAYMENT SUCCESSFUL • ORDER CONFIRMED
                </span>
                <h2 className="text-2xl font-display uppercase tracking-wider text-black mt-3">
                  YOUR GARMENT IS BEING PACKED
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Order ID: <strong className="text-black">{completedOrderId}</strong> • SMS &amp; WhatsApp confirmation sent to <strong>{phone}</strong>
                </p>
              </div>

              {/* Order Quick Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-black/10 text-left font-mono text-xs space-y-2.5 shadow-sm">
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-400">CUSTOMER:</span>
                  <span className="font-bold text-black">{name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-400">DELIVER TO:</span>
                  <span className="font-bold text-black text-right truncate max-w-[280px]">
                    {street}, {city} - {pincode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-400">PAID VIA:</span>
                  <span className="font-bold text-black uppercase">
                    {paymentMethod === 'shoppay' ? 'SHOPIFY SHOP PAY' : paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : 'CREDIT / DEBIT CARD'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black pt-1">
                  <span>TOTAL PAID:</span>
                  <span className="text-[#2040FF]">₹{total.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Secure Delivery OTP Reminder */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs font-mono text-amber-900 leading-relaxed">
                  <strong>Secure Delivery OTP Enabled:</strong> A 4-digit code will be sent to <strong>{phone}</strong> when the courier partner arrives. Please share it with the delivery executive only when receiving your parcel.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderHub?.('active');
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" /> Track This Order
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderHub?.('history');
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white text-black border border-black/15 font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> View Tax Invoice
                </button>
              </div>
            </div>
          ) : step === 'payment' ? (

            /* ============================================================== */
            /* STEP 2: PAYMENT SECTION (UPI, CARD, COD)                       */
            /* ============================================================== */
            <form onSubmit={handleProcessOrder} className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Back to Address Link */}
              <button
                type="button"
                onClick={() => setStep('info')}
                className="text-xs font-mono text-neutral-500 hover:text-black flex items-center gap-1.5 cursor-pointer"
              >
                ← Edit Delivery Address
              </button>

              {/* Order Summary Pill */}
              <div className="bg-white rounded-2xl p-4 border border-black/10 flex justify-between items-center font-mono text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Amount Payable</span>
                  <span className="text-base font-bold text-black">₹{total.toLocaleString('en-IN')}.00</span>
                </div>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                  Includes 12% GST &amp; Free Shipping
                </span>
              </div>

              {/* 100% Prepaid Policy Banner */}
              <div className="bg-[#2040FF]/5 border border-[#2040FF]/20 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#2040FF] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-mono text-xs font-bold text-black uppercase tracking-wide">
                    100% Insured Prepaid Courier Transit
                  </h5>
                  <p className="text-[11px] font-mono text-neutral-600 mt-0.5 leading-relaxed">
                    To guarantee doorstep delivery via BlueDart &amp; Delhivery Express, Spirit Being operates exclusively on 100% verified prepaid payments. We do not accept Cash on Delivery (COD).
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Select Verified Payment Gateway:
                </span>

                {/* Method 1: Shopify Shop Pay */}
                <div 
                  onClick={() => setPaymentMethod('shoppay')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    paymentMethod === 'shoppay'
                      ? 'border-[#2040FF] bg-[#2040FF]/5 shadow-sm'
                      : 'border-black/10 bg-white hover:border-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center">
                        {paymentMethod === 'shoppay' && <div className="w-2 h-2 rounded-full bg-[#2040FF]" />}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-black uppercase">Shopify Shop Pay</span>
                        <p className="text-[10px] font-mono text-neutral-500">1-Click Accelerated Checkout with Mobile OTP</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-[#5A31F4]/10 text-[#5A31F4] px-2 py-0.5 rounded-full font-bold uppercase border border-[#5A31F4]/20">
                      Shopify Global
                    </span>
                  </div>
                </div>

                {/* Method 2: Instant UPI */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                    paymentMethod === 'upi'
                      ? 'border-[#2040FF] bg-[#2040FF]/5 shadow-sm'
                      : 'border-black/10 bg-white hover:border-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center">
                        {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-[#2040FF]" />}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-black uppercase">Instant UPI (Google Pay, PhonePe, Paytm)</span>
                        <p className="text-[10px] font-mono text-neutral-500">Instant Bank Transfer • 0% Convenience Fee</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                      Fastest
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="pt-2 border-t border-black/5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUpiApp('gpay'); }}
                        className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                          upiApp === 'gpay' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        Google Pay
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUpiApp('phonepe'); }}
                        className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                          upiApp === 'phonepe' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        PhonePe
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUpiApp('paytm'); }}
                        className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                          upiApp === 'paytm' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        Paytm
                      </button>
                    </div>
                  )}
                </div>

                {/* Method 3: Cards */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    paymentMethod === 'card'
                      ? 'border-[#2040FF] bg-[#2040FF]/5 shadow-sm'
                      : 'border-black/10 bg-white hover:border-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center">
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#2040FF]" />}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-black uppercase">Credit / Debit Card</span>
                        <p className="text-[10px] font-mono text-neutral-500">Visa, MasterCard, RuPay, Amex</p>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-neutral-400" />
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="pt-2 border-t border-black/5 space-y-2 text-xs font-mono">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-black/10 bg-white text-xs font-mono focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Authorizing Payment...
                  </span>
                ) : (
                  <>
                    Authorize &amp; Place Order (₹{total.toLocaleString('en-IN')}.00)
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (

            /* ============================================================== */
            /* STEP 1: CUSTOMER CONTACT & ADDRESS (SAVED VS NEW ADDRESS)      */
            /* ============================================================== */
            <form onSubmit={handleProceedToPayment} className="space-y-5 animate-in fade-in-50 duration-200">
              {/* If Returning Customer: Show Saved Address Card */}
              {currentUser && (
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2040FF]" />
                      <span className="font-mono text-xs font-bold text-blue-950 uppercase tracking-wide">
                        Returning Member Identified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">
                      Shopify Account
                    </span>
                  </div>

                  {/* Radio Choice: Saved Address vs New Address */}
                  <div className="space-y-2 pt-1">
                    <label 
                      onClick={() => setUseSavedAddress(true)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        useSavedAddress ? 'bg-white border-[#2040FF] shadow-sm' : 'bg-transparent border-black/10'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center mt-0.5 shrink-0">
                        {useSavedAddress && <div className="w-2 h-2 rounded-full bg-[#2040FF]" />}
                      </div>
                      <div className="text-xs font-mono text-neutral-800 leading-relaxed">
                        <strong className="text-black block font-sans text-xs">Deliver to Saved Address (Home)</strong>
                        <span>Flat 402, Zion Court, Indiranagar 2nd Stage, Bengaluru, Karnataka - 560038</span>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          Phone: {currentUser.phone || '+91 98765 43210'} • Name: {currentUser.name}
                        </div>
                      </div>
                    </label>

                    <label 
                      onClick={() => setUseSavedAddress(false)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        !useSavedAddress ? 'bg-white border-[#2040FF] shadow-sm' : 'bg-transparent border-black/10'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center shrink-0">
                        {!useSavedAddress && <div className="w-2 h-2 rounded-full bg-[#2040FF]" />}
                      </div>
                      <span className="font-mono text-xs text-neutral-700">
                        + Deliver to a different address
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Fields: Only shown if Not using saved address OR guest customer */}
              {(!useSavedAddress || !currentUser) && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block border-b border-black/5 pb-1">
                    Shipping &amp; Contact Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="David Jaison"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Mobile Number (For Delivery OTP)</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Email Address (For Tax Invoice)</label>
                    <input
                      type="email"
                      required
                      placeholder="davidj@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Flat / House No. / Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat 402, Zion Court, 12th Cross"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Locality / Landmark</label>
                      <input
                        type="text"
                        required
                        placeholder="Indiranagar"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] text-neutral-500 uppercase font-bold">Pincode</label>
                      <input
                        type="text"
                        required
                        placeholder="560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full border border-black/10 p-2.5 rounded-xl bg-white focus:outline-none focus:border-black text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items Preview */}
              <div className="bg-white rounded-2xl p-4 border border-black/10 font-mono text-xs space-y-2">
                <div className="flex justify-between text-neutral-500 text-[10px] uppercase">
                  <span>Items ({items.reduce((a, b) => a + b.quantity, 0)} pieces)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-[11px] font-bold">
                    <span>First Order Privilege (FAITHFIRST)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 text-[10px] uppercase">
                  <span>Courier Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-black border-t border-neutral-100 pt-2 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-[#2040FF]">₹{total.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                Proceed to Payment Section
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
