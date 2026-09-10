import React, { useState } from 'react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle, Clock, MapPin, Sparkles } from 'lucide-react';

interface OrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const OrderCartDrawer: React.FC<OrderCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    subtotal: number;
    tax: number;
    total: number;
    items: CartItem[];
    customerName: string;
    pickupTime: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const tax = Number((subtotal * 0.0825).toFixed(2)); // Texas state + Austin local sales tax
  const total = Number((subtotal + tax).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderId = `ASADOR-PK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const pickupTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCompletedOrder({
      orderId,
      subtotal,
      tax,
      total,
      items: [...items],
      customerName: customerName || 'Guest Diner',
      pickupTime,
    });

    onClearCart();
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#E3DACD] flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="bg-[#171412] text-white p-5 border-b border-[#2F2823] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D9822B]" />
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight">
                  {completedOrder ? 'Order Confirmed' : 'Pickup Order'}
                </h3>
                <span className="text-xs text-[#A89C8E]">
                  2617 E 7th St, East Austin
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {completedOrder ? (
              /* Receipt View */
              <div className="py-4 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">
                    Order Received!
                  </h4>
                  <p className="text-xs text-[#6E645A] mt-1">
                    The asador grill team is firing up your order now.
                  </p>
                </div>

                <div className="bg-[#F3EDE2] rounded-2xl p-5 text-left border border-[#E3DACD] space-y-3 font-serif text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-[#E3DACD]">
                    <span className="text-xs uppercase font-bold text-[#8C7E72]">Order ID</span>
                    <span className="font-mono font-bold text-base text-[#C85227]">
                      {completedOrder.orderId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#2E5A44] font-semibold bg-[#2E5A44]/10 p-2.5 rounded-lg">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Ready for Pickup by approximately {completedOrder.pickupTime} (25-35 mins)</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-[#5A5046] pt-1">
                    <MapPin className="w-4 h-4 text-[#C85227] shrink-0 mt-0.5" />
                    <span>Pickup at the Host Stand: 2617 E 7th St, Austin, TX 78702</span>
                  </div>

                  {/* Items List in Receipt */}
                  <div className="pt-3 border-t border-[#E3DACD] space-y-2">
                    <span className="text-xs font-bold text-[#1F1A17] block">Items in Order:</span>
                    {completedOrder.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs text-[#5A5046]">
                        <span>{it.quantity}x {it.menuItem.name}</span>
                        <span className="font-semibold text-[#1F1A17]">${(it.menuItem.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E3DACD] flex justify-between font-bold text-base text-[#1F1A17]">
                    <span>Total Paid</span>
                    <span className="text-[#C85227]">${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-bold text-sm shadow-md transition-all"
                >
                  Close Receipt
                </button>
              </div>
            ) : items.length === 0 ? (
              /* Empty Cart View */
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#B5A89C] mx-auto mb-3 stroke-1" />
                <h4 className="font-serif text-lg font-bold text-[#1F1A17]">Your Cart is Empty</h4>
                <p className="text-xs text-[#8C7E72] mt-1 max-w-xs mx-auto">
                  Add items from the Mesquite Grill, Tacos, or Cantina to start your pickup order.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#C85227] text-white font-semibold text-xs shadow"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              /* Cart Items View */
              <div className="space-y-6">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E3DACD] shadow-sm flex gap-3 items-start"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 rounded-lg object-cover bg-[#2A231E] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-bold text-sm text-[#1F1A17] truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="font-serif font-bold text-sm text-[#C85227] ml-2">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {item.selectedOption && (
                          <span className="inline-block text-[11px] text-[#8C7E72] bg-[#F3EDE2] px-2 py-0.5 rounded mt-1">
                            {item.selectedOption}
                          </span>
                        )}

                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#A8401C] italic mt-0.5">
                            Note: {item.specialInstructions}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2 border border-[#DCD1C0] rounded-lg px-2 py-1 bg-[#FAF7F2]">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="text-[#5A5046] hover:text-[#1F1A17]"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-[#1F1A17] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-[#5A5046] hover:text-[#1F1A17]"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8C7E72] hover:text-red-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Details Form */}
                <form onSubmit={handleCheckout} id="cart-checkout-form" className="space-y-3 pt-4 border-t border-[#E3DACD]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F1A17] block">
                    Pickup Details
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5046] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Maria Hernandez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5046] mb-1">
                      Mobile Phone (for SMS ready alert) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(512) 000-0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5046] mb-1">
                      Pickup Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Car make/model for curbside or specific pickup time"
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {!completedOrder && items.length > 0 && (
            <div className="p-5 bg-[#F3EDE2] border-t border-[#E3DACD] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5A5046]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1A17]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Austin & Texas Sales Tax (8.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F1A17] pt-2 border-t border-[#E3DACD]">
                  <span>Total</span>
                  <span className="text-[#C85227] text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="cart-checkout-form"
                className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Place Pickup Order • ${total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7E72]">
                <Clock className="w-3 h-3 text-[#2E5A44]" />
                <span>Estimated ready time: 25-35 minutes</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
