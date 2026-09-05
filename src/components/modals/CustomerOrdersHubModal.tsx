import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  FileText,
  Copy,
  Check,
  ArrowLeft,
  Truck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { UserProfile } from '../layout/Header';

export interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  hsnCode: string;
  fabricSpecs?: string;
}

export interface DetailedOrder {
  orderId: string;
  shopifyOrderNumber: string;
  invoiceNumber: string;
  date: string;
  time: string;
  status: 'Order Placed' | 'Packed & Dispatched' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  courier: string;
  payment: {
    method: string;
    transactionId: string;
    status: 'Captured' | 'Paid';
    paidAt: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    name: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress: {
    name: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    shippingFee: number;
    cgst: number;
    sgst: number;
    total: number;
  };
}

const MOCK_ACTIVE_ORDER: DetailedOrder = {
  orderId: 'SB-10492',
  shopifyOrderNumber: '#10492',
  invoiceNumber: 'SB/2026/09-10492',
  date: 'Sept 2, 2026',
  time: '09:30 AM IST',
  status: 'Out for Delivery',
  trackingNumber: 'BD-98402194IN',
  courier: 'BlueDart Express',
  payment: {
    method: 'UPI / Google Pay (via Shopify Payments)',
    transactionId: 'pay_SB983419082X',
    status: 'Captured',
    paidAt: 'Sept 2, 2026, 09:31 AM',
  },
  customer: {
    name: 'David Jaison',
    email: 'davidj@gmail.com',
    phone: '+91 98765 43210',
  },
  shippingAddress: {
    name: 'David Jaison',
    street: 'Flat 402, Zion Court, 12th Cross',
    locality: 'Indiranagar 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  },
  billingAddress: {
    name: 'David Jaison',
    street: 'Flat 402, Zion Court, 12th Cross',
    locality: 'Indiranagar 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  },
  items: [
    {
      id: 'prod_1',
      name: 'Spirit Gives Life Tee',
      color: 'Electric Blue',
      size: 'XL',
      price: 1499,
      quantity: 1,
      image: '/products/bestsellers/ Spirit Gives Life Tee.png',
      hsnCode: '61091000',
      fabricSpecs: '240 GSM Heavyweight French Terry • Drop-Shoulder Oversized Silhouette',
    },
  ],
  pricing: {
    subtotal: 1499,
    discountCode: 'FAITHFIRST',
    discountAmount: 150,
    shippingFee: 0,
    cgst: 40.42,
    sgst: 40.42,
    total: 1349,
  },
};

const MOCK_PAST_ORDER: DetailedOrder = {
  orderId: 'SB-09821',
  shopifyOrderNumber: '#09821',
  invoiceNumber: 'SB/2026/08-09821',
  date: 'Aug 14, 2026',
  time: '04:15 PM IST',
  status: 'Delivered',
  trackingNumber: 'DEL-44102941IN',
  courier: 'Delhivery Surface',
  payment: {
    method: 'Credit Card (Visa ending in 4242)',
    transactionId: 'pay_SB887192019A',
    status: 'Captured',
    paidAt: 'Aug 14, 2026, 04:16 PM',
  },
  customer: {
    name: 'David Jaison',
    email: 'davidj@gmail.com',
    phone: '+91 98765 43210',
  },
  shippingAddress: {
    name: 'David Jaison',
    street: 'Flat 402, Zion Court, 12th Cross',
    locality: 'Indiranagar 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  },
  billingAddress: {
    name: 'David Jaison',
    street: 'Flat 402, Zion Court, 12th Cross',
    locality: 'Indiranagar 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  },
  items: [
    {
      id: 'prod_7',
      name: 'Spirit Being Cap',
      color: 'Black',
      size: 'One Size',
      price: 499,
      quantity: 1,
      image: '/products/bestsellers/SpiritBeing cap.png',
      hsnCode: '65050090',
      fabricSpecs: 'Custom 6-Panel Distressed Twill • Embroidered Script Logo',
    },
    {
      id: 'prod_9',
      name: 'Chosen Ones Vintage Canvas Tote',
      color: 'Natural Canvas',
      size: 'One Size',
      price: 699,
      quantity: 1,
      image: '/assets/Collections/Rectangle 255730.png',
      hsnCode: '42022290',
      fabricSpecs: '14oz Raw Organic Cotton Duck Canvas • Reinforced Handles',
    },
  ],
  pricing: {
    subtotal: 1198,
    discountAmount: 0,
    shippingFee: 0,
    cgst: 32.10,
    sgst: 32.10,
    total: 1198,
  },
};

const ALL_ORDERS = [MOCK_ACTIVE_ORDER, MOCK_PAST_ORDER];

interface CustomerOrdersHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  initialTab?: 'active' | 'history';
}

export const CustomerOrdersHubModal: React.FC<CustomerOrdersHubModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'active',
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [viewingInvoiceFor, setViewingInvoiceFor] = useState<DetailedOrder | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  
  const modalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setViewingInvoiceFor(null);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleWheelCapture = (e: WheelEvent) => {
      e.stopPropagation();
    };

    const containerEl = modalContainerRef.current;
    if (containerEl) {
      containerEl.addEventListener('wheel', handleWheelCapture, { passive: false });
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (containerEl) {
        containerEl.removeEventListener('wheel', handleWheelCapture);
      }
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handlePrint = () => {
    const invoiceEl = document.getElementById('printable-tax-invoice');
    if (!invoiceEl) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spirit Being Tax Invoice - #${viewingInvoiceFor?.orderId}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background: #ffffff;
              color: #1b1c1c;
              padding: 32px;
              font-size: 12px;
              line-height: 1.5;
            }
            .font-anton {
              font-family: 'Anton', Impact, sans-serif;
              letter-spacing: 0.05em;
            }
            .font-mono {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
              margin-bottom: 16px;
            }
            th, td {
              padding: 10px 6px;
            }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-b-2 { border-bottom: 2px solid #1b1c1c; }
            .border-t-2 { border-top: 2px solid #1b1c1c; }
            .border-t { border-top: 1px solid #e5e7eb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .font-bold { font-weight: 700; }
            .uppercase { text-transform: uppercase; }
            .text-xs { font-size: 11px; }
            .text-sm { font-size: 13px; }
            .text-2xl { font-size: 26px; }
            .text-gray-400 { color: #9ca3af; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-emerald-600 { color: #059669; }
            .text-blue-600 { color: #2040FF; }
            .bg-black { background-color: #000000; color: #ffffff; }
            .rounded { border-radius: 4px; }
            .py-1 { padding-top: 4px; padding-bottom: 4px; }
            .px-2 { padding-left: 8px; padding-right: 8px; }
            .grid { display: flex; justify-content: space-between; gap: 32px; }
            .grid > div { flex: 1; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .space-y-1 > * + * { margin-top: 4px; }
            .space-y-1\\.5 > * + * { margin-top: 6px; }
            .space-y-6 > * + * { margin-top: 24px; }
            .mt-0\\.5 { margin-top: 2px; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .mb-1 { margin-bottom: 4px; }
            .pb-6 { padding-bottom: 24px; }
            .pt-4 { padding-top: 16px; }
            .pt-2 { padding-top: 8px; }
            .italic { font-style: italic; }
            .tracking-wide { letter-spacing: 0.05em; }
            .tracking-widest { letter-spacing: 0.1em; }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
          </style>
        </head>
        <body class="font-mono">
          ${invoiceEl.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 250);
  };

  const activeOrder = MOCK_ACTIVE_ORDER;

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl transition-all duration-300"
      data-lenis-prevent="true"
      style={{ overscrollBehavior: 'contain' }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-[#fbf9f9] text-[#1b1c1c] w-full max-w-4xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[92vh] border border-black/10 transition-all duration-300"
        role="dialog"
        aria-modal="true"
        data-lenis-prevent="true"
        style={{ overscrollBehavior: 'contain' }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Editorial Top Bar with Brand Aura */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/10 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-display tracking-wider text-sm shadow-md">
              SB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base tracking-wider uppercase text-black">
                  SPIRIT BEING
                </h3>
                <span className="font-serif italic text-xs text-neutral-400">
                  not of this world.
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-[#2040FF]/10 text-[#2040FF] px-2 py-0.5 rounded-full border border-[#2040FF]/20 uppercase ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2040FF] animate-pulse"></span>
                  Shopify Storefront Connected
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                Member: <strong className="text-black">{currentUser?.name || activeOrder.customer.name}</strong> • {currentUser?.email || activeOrder.customer.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Navigation Subheader (Shopify Customer Account Standard) */}
        {!viewingInvoiceFor ? (
          <div className="flex items-center justify-between border-b border-black/10 px-6 sm:px-8 bg-neutral-50/70 shrink-0">
            <div className="flex items-center gap-2 py-2.5">
              <button
                className={`py-2 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'active'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-transparent text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                }`}
                onClick={() => setActiveTab('active')}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'}`}></span>
                Active Shipment ({activeOrder.orderId})
              </button>
              <button
                className={`py-2 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-transparent text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Purchase Archive ({ALL_ORDERS.length})
              </button>
            </div>
            <span className="hidden md:inline-block text-[11px] font-mono text-neutral-400 uppercase">
              Shopify Secure Checkout
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between border-b border-black/10 px-6 sm:px-8 py-3 bg-[#2040FF]/5 shrink-0 transition-all duration-300">
            <button
              onClick={() => setViewingInvoiceFor(null)}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#2040FF] hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Hub
            </button>
            <span className="font-mono text-xs text-neutral-700 font-semibold">
              Official Tax Invoice • Order #{viewingInvoiceFor.orderId}
            </span>
            <button
              onClick={handlePrint}
              className="py-1.5 px-3.5 rounded-xl bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice
            </button>
          </div>
        )}

        {/* Smooth-Scrolling Interior Body Container */}
        <div 
          className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 overscroll-contain scroll-smooth"
          data-lenis-prevent="true"
          style={{ 
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
          onWheel={(e) => e.stopPropagation()}
        >

          {/* ========================================================================= */}
          {/* VIEW: OFFICIAL TAX INVOICE (Shopify Standard GST Layout)                  */}
          {/* ========================================================================= */}
          {viewingInvoiceFor ? (
            <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-4">
              <div 
                id="printable-tax-invoice"
                className="bg-white p-8 md:p-12 rounded-3xl border border-black/10 shadow-lg font-mono text-xs text-neutral-800 space-y-7"
              >
                {/* Brand Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-black/15 pb-6">
                  <div>
                    <h1 className="font-display text-3xl uppercase tracking-wider text-black">
                      SPIRIT BEING
                    </h1>
                    <p className="font-serif italic text-xs text-neutral-400 mt-0.5">not of this world.</p>
                    <div className="text-[11px] text-neutral-600 mt-3 space-y-0.5">
                      <p className="font-bold text-black">Spirit Being Apparels Private Limited</p>
                      <p>GSTIN: 29AABCU9603R1ZX • CIN: U18101KA2026PTC089421</p>
                      <p>Kingdom Studio, Indiranagar, Bengaluru, KA - 560038, India</p>
                      <p>Official Storefront: spiritbeing.in • support@spiritbeing.in</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <span className="inline-block px-3 py-1 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-lg">
                      ORIGINAL TAX INVOICE
                    </span>
                    <p className="font-bold text-sm text-black mt-2">Invoice: {viewingInvoiceFor.invoiceNumber}</p>
                    <p className="text-neutral-500">Shopify Ref: {viewingInvoiceFor.shopifyOrderNumber}</p>
                    <p className="text-neutral-500">Invoice Date: {viewingInvoiceFor.date}</p>
                    <p className="text-neutral-500">
                      Payment Status: <strong className="text-emerald-600 uppercase font-bold">{viewingInvoiceFor.payment.status}</strong>
                    </p>
                  </div>
                </div>

                {/* Billed To / Shipped To Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-black/15 pb-6">
                  <div className="bg-neutral-50/70 p-4 rounded-2xl border border-black/5">
                    <h5 className="font-bold uppercase text-neutral-400 text-[10px] tracking-widest mb-1.5">
                      BILLED TO (BUYER):
                    </h5>
                    <p className="font-bold text-black text-sm">{viewingInvoiceFor.billingAddress.name}</p>
                    <p>{viewingInvoiceFor.billingAddress.street}</p>
                    <p>{viewingInvoiceFor.billingAddress.locality}</p>
                    <p>{viewingInvoiceFor.billingAddress.city}, {viewingInvoiceFor.billingAddress.state} - {viewingInvoiceFor.billingAddress.pincode}</p>
                    <p className="text-neutral-500 mt-2">Phone: {viewingInvoiceFor.customer.phone}</p>
                    <p className="text-neutral-500">Email: {viewingInvoiceFor.customer.email}</p>
                  </div>

                  <div className="bg-neutral-50/70 p-4 rounded-2xl border border-black/5">
                    <h5 className="font-bold uppercase text-neutral-400 text-[10px] tracking-widest mb-1.5">
                      SHIPPED TO (DELIVERY ADDRESS):
                    </h5>
                    <p className="font-bold text-black text-sm">{viewingInvoiceFor.shippingAddress.name}</p>
                    <p>{viewingInvoiceFor.shippingAddress.street}</p>
                    <p>{viewingInvoiceFor.shippingAddress.locality}</p>
                    <p>{viewingInvoiceFor.shippingAddress.city}, {viewingInvoiceFor.shippingAddress.state} - {viewingInvoiceFor.shippingAddress.pincode}</p>
                    <p className="text-neutral-500 mt-2">Carrier: {viewingInvoiceFor.courier}</p>
                    <p className="text-neutral-500 font-bold">Waybill (AWB): {viewingInvoiceFor.trackingNumber}</p>
                  </div>
                </div>

                {/* Itemized Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black/20 text-neutral-500 text-[10px] uppercase tracking-wider">
                        <th className="py-2.5">Item Description &amp; Specifications</th>
                        <th className="py-2.5 text-center">HSN</th>
                        <th className="py-2.5 text-center">Qty</th>
                        <th className="py-2.5 text-right">Unit Price</th>
                        <th className="py-2.5 text-right">Total (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {viewingInvoiceFor.items.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <span className="font-bold text-black block text-sm">{item.name}</span>
                            <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                              Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong>
                            </span>
                            {item.fabricSpecs && (
                              <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">
                                {item.fabricSpecs}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-center text-neutral-600">{item.hsnCode}</td>
                          <td className="py-3.5 text-center text-neutral-600 font-bold">{item.quantity}</td>
                          <td className="py-3.5 text-right text-neutral-600">₹{item.price.toLocaleString('en-IN')}.00</td>
                          <td className="py-3.5 text-right font-bold text-black">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Tax Split Section */}
                <div className="border-t-2 border-black/20 pt-5 flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="space-y-1.5 text-[11px] text-neutral-500 max-w-sm">
                    <p className="font-bold text-black uppercase tracking-wider">Statutory Tax Declaration:</p>
                    <p>1. Computer-generated tax invoice issued in accordance with GST Rule 46.</p>
                    <p>2. Reverse Charge Applicable: No.</p>
                    <p>3. Settled via {viewingInvoiceFor.payment.method}. Transaction Reference: {viewingInvoiceFor.payment.transactionId}</p>
                  </div>

                  <div className="w-full sm:w-72 space-y-2 text-xs text-right bg-neutral-50 p-4 rounded-2xl border border-black/5">
                    <div className="flex justify-between text-neutral-600">
                      <span>Item Subtotal:</span>
                      <span>₹{viewingInvoiceFor.pricing.subtotal.toLocaleString('en-IN')}.00</span>
                    </div>
                    {viewingInvoiceFor.pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({viewingInvoiceFor.pricing.discountCode}):</span>
                        <span>-₹{viewingInvoiceFor.pricing.discountAmount.toLocaleString('en-IN')}.00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Express Shipping:</span>
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-[11px] pt-1.5 border-t border-neutral-200">
                      <span>CGST (6%):</span>
                      <span>₹{viewingInvoiceFor.pricing.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-[11px]">
                      <span>SGST (6%):</span>
                      <span>₹{viewingInvoiceFor.pricing.sgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-black border-t border-black/20 pt-2.5 mt-2">
                      <span>Total Invoice Value:</span>
                      <span className="text-base text-[#2040FF]">₹{viewingInvoiceFor.pricing.total.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-5 text-center text-[11px] text-neutral-400 font-mono">
                  Spirit Being Studio • Handcrafted Heavyweight Streetwear • Built for the Chosen Ones.
                </div>
              </div>
            </div>
          ) : activeTab === 'active' ? (

            /* ========================================================================= */
            /* TAB 1: CURRENT ACTIVE SHIPMENT (EDITORIAL STREETWEAR PRESENTATION)         */
            /* ========================================================================= */
            <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-6">
              {/* Order Status Banner */}
              <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Live Delivery Progress
                    </span>
                  </div>
                  <h2 className="text-2xl font-display uppercase tracking-wider text-black mt-1">
                    {activeOrder.status}
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 mt-1">
                    Courier: <strong className="text-black">{activeOrder.courier}</strong> • Placed on {activeOrder.date} at {activeOrder.time}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl border border-black/10">
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">Waybill (AWB)</p>
                    <p className="text-xs font-mono font-bold text-black">{activeOrder.trackingNumber}</p>
                  </div>
                  <button
                    onClick={() => handleCopyTracking(activeOrder.trackingNumber)}
                    className="p-2 rounded-lg hover:bg-white text-neutral-500 hover:text-black transition-all cursor-pointer shadow-none hover:shadow-sm"
                    title="Copy Tracking Number"
                  >
                    {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secure Delivery OTP Verification Notice */}
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Doorstep Delivery OTP Verification
                    </h4>
                    <span className="text-[9px] bg-emerald-600/15 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-mono text-emerald-900/90 mt-1.5 leading-relaxed">
                    To prevent misdelivery, a unique 4-digit Delivery OTP is automatically transmitted to your registered mobile number: <strong className="text-black">{activeOrder.customer.phone}</strong> when the courier executive arrives.
                  </p>
                  <p className="text-[11px] font-mono text-emerald-800 mt-2 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Handover occurs only after the delivery rider validates your OTP.
                  </p>
                </div>
              </div>

              {/* 2-Column Grid: Garment Details + Billing & Logistics Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (7 cols): Garments & Payment Confirmation */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm space-y-4">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Selected Pieces ({activeOrder.items.length})</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Shopify SKU: SB-TSHIRT-01</span>
                    </h4>

                    <div className="divide-y divide-neutral-100">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 group">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/10">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-display text-sm uppercase tracking-wide text-black truncate">
                              {item.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-mono bg-neutral-100 text-black px-2 py-0.5 rounded font-bold">
                                Size: {item.size}
                              </span>
                              <span className="text-[10px] font-mono bg-neutral-100 text-black px-2 py-0.5 rounded font-bold">
                                Color: {item.color}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                HSN: {item.hsnCode}
                              </span>
                            </div>
                            {item.fabricSpecs && (
                              <p className="text-[10px] font-mono text-neutral-500 mt-1.5 line-clamp-1">
                                {item.fabricSpecs}
                              </p>
                            )}
                            <p className="text-xs font-mono text-neutral-500 mt-2">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}.00
                            </p>
                          </div>
                          <span className="font-mono text-sm font-bold text-black shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Verification Card */}
                  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-400" />
                      Payment Clearance Confirmation
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Payment Method</span>
                        <span className="font-semibold text-black">{activeOrder.payment.method}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Payment Status</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {activeOrder.payment.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Transaction Reference</span>
                        <span className="text-neutral-700 font-mono text-[11px]">{activeOrder.payment.transactionId}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase">Settlement Time</span>
                        <span className="text-neutral-700">{activeOrder.payment.paidAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Destination Address & Price Summary */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400" /> Delivery Destination
                    </h4>
                    <div className="text-xs font-mono space-y-1.5 text-neutral-700">
                      <p className="font-bold text-black text-sm">{activeOrder.shippingAddress.name}</p>
                      <p>{activeOrder.shippingAddress.street}</p>
                      <p>{activeOrder.shippingAddress.locality}</p>
                      <p>
                        {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
                      </p>
                      <p className="text-neutral-400">{activeOrder.shippingAddress.country}</p>
                      <div className="pt-2 flex items-center gap-2 text-neutral-600 border-t border-neutral-100 mt-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{activeOrder.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{activeOrder.customer.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm font-mono text-xs space-y-2.5">
                    <h4 className="font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      Billing Summary
                    </h4>
                    <div className="flex justify-between text-neutral-600">
                      <span>Cart Subtotal</span>
                      <span>₹{activeOrder.pricing.subtotal.toLocaleString('en-IN')}.00</span>
                    </div>
                    {activeOrder.pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({activeOrder.pricing.discountCode})</span>
                        <span>-₹{activeOrder.pricing.discountAmount.toLocaleString('en-IN')}.00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Express Courier Shipping</span>
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-[11px] pt-1.5 border-t border-neutral-100">
                      <span>Includes CGST (6%) + SGST (6%)</span>
                      <span>₹{(activeOrder.pricing.cgst + activeOrder.pricing.sgst).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-black pt-2.5 border-t border-black/10">
                      <span>Total Amount Settled</span>
                      <span className="text-base text-[#2040FF]">₹{activeOrder.pricing.total.toLocaleString('en-IN')}.00</span>
                    </div>

                    {/* Prominent Action to flip into Invoice */}
                    <div className="pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => setViewingInvoiceFor(activeOrder)}
                        className="w-full py-3 px-4 rounded-xl bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                      >
                        <FileText className="w-4 h-4" /> View &amp; Print Official Tax Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (

            /* ========================================================================= */
            /* TAB 2: ORDER HISTORY ARCHIVE (Shopify Customer Account Standard)           */
            /* ========================================================================= */
            <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Recorded Transactions ({ALL_ORDERS.length})
                </h4>
                <span className="text-xs font-mono text-neutral-500 font-bold">
                  Total Member Spend: ₹2,547.00
                </span>
              </div>

              {ALL_ORDERS.map((ord) => (
                <div 
                  key={ord.orderId} 
                  className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm space-y-4 hover:border-black/25 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-display text-base tracking-wide text-black uppercase">
                          Order #{ord.orderId}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          ord.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                            : 'bg-[#2040FF]/10 text-[#2040FF] border border-[#2040FF]/20'
                        }`}>
                          {ord.status === 'Delivered' ? 'Delivered ✓' : ord.status}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        Placed on {ord.date} at {ord.time} • Shopify Ref: {ord.shopifyOrderNumber}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-base font-mono font-bold text-black">
                        ₹{ord.pricing.total.toLocaleString('en-IN')}.00
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        {ord.payment.method.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      {ord.items.map((i) => (
                        <div key={i.id} className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 shrink-0">
                          <img 
                            src={i.image} 
                            alt={i.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      ))}
                      <div>
                        <p className="font-display text-sm text-black uppercase tracking-wide">
                          {ord.items[0].name} {ord.items.length > 1 ? `+ ${ord.items.length - 1} more` : ''}
                        </p>
                        <p className="font-mono text-xs text-neutral-500 mt-0.5">
                          {ord.items[0].size} • {ord.items[0].color} • Carrier: {ord.courier}
                        </p>
                        <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
                          AWB: {ord.trackingNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => setViewingInvoiceFor(ord)}
                        className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-black hover:text-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Tax Invoice
                      </button>
                      
                      {ord.status !== 'Delivered' && (
                        <button
                          onClick={() => setActiveTab('active')}
                          className="py-2.5 px-4 rounded-xl bg-[#2040FF] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1a33cc] transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                        >
                          Track Shipment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
