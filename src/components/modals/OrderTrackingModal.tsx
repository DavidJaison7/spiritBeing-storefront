import React from 'react';
import { X, Package, ShieldCheck, MapPin, ExternalLink, KeyRound } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetails {
  orderId: string;
  date: string;
  status: 'Order Placed' | 'Packed & Dispatched' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  courier: string;
  registeredPhone: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  totalAmount: number;
}

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderDetails;
}

const DEFAULT_MOCK_ORDER: OrderDetails = {
  orderId: 'SB-10492',
  date: 'Sept 2, 2026',
  status: 'Out for Delivery',
  trackingNumber: 'BD-98402194IN',
  courier: 'BlueDart Express',
  registeredPhone: '+91 98765 43210',
  items: [
    {
      id: 'prod_1',
      name: 'Spirit Gives Life Tee',
      color: 'Electric Blue',
      size: 'XL',
      price: 1499,
      quantity: 1,
      image: '/products/bestsellers/ Spirit Gives Life Tee.png',
    },
  ],
  shippingAddress: {
    name: 'David Jaison',
    street: '42 Kingdom Avenue, Streetwear Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  },
  totalAmount: 1499,
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order = DEFAULT_MOCK_ORDER,
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

  // The 4 authentic milestones with no fake future delivery dates or times
  const steps = [
    { title: 'Order Placed', time: 'Sept 2, 09:30 AM', done: true },
    { title: 'Packed & Dispatched', time: 'Sept 2, 02:15 PM', done: true },
    { title: 'Out for Delivery', time: 'Sept 2, 08:00 AM', done: true, active: true },
    { title: 'Delivered', time: 'Awaiting Handover & OTP', done: false },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      data-lenis-prevent="true"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div 
        className="bg-white text-[#1b1c1c] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative border border-gray-100"
        role="dialog"
        aria-modal="true"
        data-lenis-prevent="true"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fbf9f9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2040FF]/10 text-[#2040FF] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-[#1b1c1c]">
                Order #{order.orderId}
              </h3>
              <p className="text-[11px] font-mono text-gray-500">Placed on {order.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          className="p-6 overflow-y-auto space-y-6 overscroll-contain"
          data-lenis-prevent="true"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Status Alert Banner */}
          <div className="bg-[#2040FF]/5 border border-[#2040FF]/20 rounded-xl p-4 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-[#2040FF] animate-pulse mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#2040FF] uppercase tracking-wider">
                  Current Status: {order.status}
                </span>
                <span className="text-[10px] font-mono font-medium text-gray-500">
                  {order.courier}
                </span>
              </div>
              <div className="mt-2 text-[11px] font-mono text-gray-600 flex items-center justify-between">
                <span>Waybill No: <strong className="text-gray-900">{order.trackingNumber}</strong></span>
                <a
                  href={`https://www.bluedart.com/tracking`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#2040FF] hover:underline font-semibold"
                >
                  Courier Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Secure OTP Verification Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-mono text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Secure OTP Delivery Verification
                </h4>
                <span className="text-[9px] font-mono bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  Active
                </span>
              </div>
              <p className="text-[11px] font-mono text-emerald-800/90 mt-1 leading-relaxed">
                A 4-digit Delivery OTP is automatically sent via SMS to your registered number (<strong>{order.registeredPhone}</strong>) when the courier partner arrives at your address.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-700 bg-white/70 p-2 rounded-lg border border-emerald-200/50 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>The package is handed over only after the delivery executive validates your OTP.</span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Live Shipment Progress
            </h4>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div 
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step.active 
                        ? 'bg-[#2040FF] text-white ring-4 ring-[#2040FF]/20' 
                        : step.done 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-mono text-xs ${step.active ? 'font-bold text-[#2040FF]' : step.done ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Items in this Order ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg bg-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-mono text-xs font-bold text-[#1b1c1c] uppercase truncate">
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                        Size: <strong className="text-black">{item.size}</strong>
                      </span>
                      <span className="text-[11px] font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                        Color: <strong className="text-black">{item.color}</strong>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#1b1c1c]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Shipping Address
            </h4>
            <p className="font-mono text-xs font-bold text-[#1b1c1c]">{order.shippingAddress.name}</p>
            <p className="font-mono text-xs text-gray-600 mt-0.5">{order.shippingAddress.street}</p>
            <p className="font-mono text-xs text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="font-mono text-xs">
            <span className="text-gray-500">Total Paid: </span>
            <strong className="text-sm text-[#1b1c1c]">₹{order.totalAmount.toLocaleString('en-IN')}.00</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
