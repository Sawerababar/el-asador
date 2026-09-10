import React, { useState } from 'react';
import { CateringInquiry } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { X, CheckCircle, Users, Calendar, Phone, Mail, Sparkles } from 'lucide-react';

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CateringModal: React.FC<CateringModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CateringInquiry>({
    fullName: '',
    email: '',
    phone: '',
    guestCount: 25,
    eventDate: '',
    eventType: 'Family Fiesta / Birthday',
    notes: '',
  });

  const [submittedInquiry, setSubmittedInquiry] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedInquiry(true);
  };

  const handleReset = () => {
    setSubmittedInquiry(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E3DACD] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#171412] text-white p-6 border-b border-[#2F2823] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold uppercase tracking-wider mb-2">
            
            <span>Parrillada Catering & Events</span>
          </div>

          <h3 className="font-serif text-2xl font-bold">
            Bring the Mesquite Fire to Your Event
          </h3>
          <p className="text-xs text-[#B5A89C] mt-1">
            Austin backyard barbecues, weddings, corporate events & patio buyouts.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedInquiry ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">
                Inquiry Received!
              </h4>
              <p className="text-sm text-[#5A5046] max-w-md mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Our catering coordinator will contact you at <strong>{formData.phone}</strong> within 24 hours with custom menu proposals and pricing.
              </p>

              <div className="p-4 rounded-xl bg-[#F3EDE2] border border-[#E3DACD] text-xs text-[#6E645A] max-w-sm mx-auto">
                For immediate event inquiries, feel free to call our main line at{' '}
                <a href={`tel:${RESTAURANT_INFO.rawPhone}`} className="text-[#C85227] font-semibold underline">
                  {RESTAURANT_INFO.phone}
                </a>.
              </div>

              <button
                onClick={handleReset}
                className="w-full max-w-xs mx-auto py-3 rounded-xl bg-[#C85227] text-white font-bold text-sm shadow-md block mt-4"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  >
                    <option value="Family Fiesta / Birthday">Family Fiesta / Birthday</option>
                    <option value="Corporate Gathering / Lunch">Corporate Gathering / Lunch</option>
                    <option value="Wedding / Rehearsal Dinner">Wedding / Rehearsal Dinner</option>
                    <option value="Patio Buyout at El Asador">Patio Buyout at El Asador</option>
                    <option value="Tailgate / Austin Festival">Tailgate / Austin Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    required
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                  Target Event Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(512) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                  Event Details & Menu Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your event: parrillada stations, live taco comal, margarita bar, dietary needs..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-bold text-sm shadow-md transition-all"
              >
                Send Catering Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
