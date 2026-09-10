import React, { useState } from 'react';
import { ReservationDetails } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, X, Phone, Utensils } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ReservationDetails>({
    fullName: '',
    email: '',
    phone: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    seatingPreference: 'rustic-patio',
    specialOccasion: '',
    dietaryNotes: '',
  });

  const [confirmedBooking, setConfirmedBooking] = useState<ReservationDetails | null>(null);

  if (!isOpen) return null;

  const availableTimeSlots = [
    '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmation = `ASADOR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBooking({
      ...formData,
      confirmationCode: confirmation,
    });
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E3DACD] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#171412] text-white p-6 relative border-b border-[#2F2823]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Table Booking</span>
          </div>

          <h3 className="font-serif text-2xl font-bold">
            Reserve Your Table at El Asador
          </h3>
          <p className="text-xs text-[#B5A89C] mt-1">
            2617 E 7th St, Austin, TX • Tuesday through Sunday
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {confirmedBooking ? (
            /* Confirmation Ticket View */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">
                  Reservation Confirmed!
                </h4>
                <p className="text-sm text-[#6E645A] mt-1">
                  We have saved your table under <strong className="text-[#1F1A17]">{confirmedBooking.fullName}</strong>. A confirmation has been logged.
                </p>
              </div>

              {/* Receipt Ticket Card */}
              <div className="bg-[#F3EDE2] rounded-2xl p-6 text-left border border-[#E3DACD] space-y-3 font-sans text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-[#E3DACD]">
                  <span className="text-xs uppercase font-bold text-[#8C7E72]">Confirmation Code</span>
                  <span className="font-mono text-base font-bold text-[#C85227]">
                    {confirmedBooking.confirmationCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-[#5A5046]">
                  <div>
                    <span className="block text-[#8C7E72]">Date</span>
                    <span className="font-semibold text-[#1F1A17] text-sm">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="block text-[#8C7E72]">Time</span>
                    <span className="font-semibold text-[#1F1A17] text-sm">{confirmedBooking.time}</span>
                  </div>
                  <div>
                    <span className="block text-[#8C7E72]">Guests</span>
                    <span className="font-semibold text-[#1F1A17] text-sm">{confirmedBooking.partySize} Guests</span>
                  </div>
                  <div>
                    <span className="block text-[#8C7E72]">Seating</span>
                    <span className="font-semibold text-[#1F1A17] text-sm capitalize">
                      {confirmedBooking.seatingPreference.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {confirmedBooking.specialOccasion && (
                  <div className="pt-2 border-t border-[#E3DACD] text-xs">
                    <span className="text-[#8C7E72]">Occasion: </span>
                    <span className="font-semibold text-[#1F1A17]">{confirmedBooking.specialOccasion}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-[#8C7E72]">
                Need to modify or cancel? Call us directly at{' '}
                <a href={`tel:${RESTAURANT_INFO.rawPhone}`} className="text-[#C85227] font-semibold underline">
                  {RESTAURANT_INFO.phone}
                </a>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-bold text-sm shadow-md transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Party Size, Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1.5">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.partySize}
                      onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm font-semibold text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    >
                      {availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1.5">
                  Seating Area
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'rustic-patio', label: 'Covered Patio', desc: 'String lights & breeze' },
                    { id: 'main-dining', label: 'Main Dining', desc: 'Warm ranch interior' },
                    { id: 'cantina-bar', label: 'Cantina High Top', desc: 'Near the bar' },
                  ].map((area) => (
                    <button
                      type="button"
                      key={area.id}
                      onClick={() => setFormData({ ...formData, seatingPreference: area.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.seatingPreference === area.id
                          ? 'border-[#C85227] bg-[#F3EDE2] text-[#C85227]'
                          : 'border-[#E3DACD] bg-white text-[#5A5046] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="block font-bold text-xs">{area.label}</span>
                      <span className="block text-[10px] text-[#8C7E72] mt-0.5 leading-tight">{area.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-[#E3DACD]">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Carlos Rodriguez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                    Special Requests / Occasion (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Birthday, Anniversary, High chair, Dietary note..."
                    value={formData.specialOccasion}
                    onChange={(e) => setFormData({ ...formData, specialOccasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Confirm Table Reservation
              </button>

              <p className="text-[11px] text-center text-[#8C7E72]">
                No cancellation fees. For parties larger than 12, please call us directly at {RESTAURANT_INFO.phone}.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
