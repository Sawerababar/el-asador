import React, { useState, useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { MapPin, Phone, Clock, Navigation, Car, Bus, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface LocationHoursSectionProps {
  onOpenReservation: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ onOpenReservation }) => {
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState<boolean>(true);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, ...
    const hour = now.getHours() + now.getMinutes() / 60;
    
    // Map day to our hours array index: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    const mappedIndex = day === 0 ? 6 : day - 1;
    setCurrentDayIndex(mappedIndex);

    if (day === 1) {
      // Monday closed
      setIsCurrentlyOpen(false);
    } else if (day === 0) {
      // Sunday: 10:30 AM - 7:00 PM
      setIsCurrentlyOpen(hour >= 10.5 && hour <= 19);
    } else if (day === 5 || day === 6) {
      // Fri - Sat: 10:30 AM - 10:00 PM
      setIsCurrentlyOpen(hour >= 10.5 && hour <= 22);
    } else if (day === 2) {
      // Tue: 12:00 PM - 8:00 PM
      setIsCurrentlyOpen(hour >= 12 && hour <= 20);
    } else {
      // Wed - Thu: 10:30 AM - 8:00 PM
      setIsCurrentlyOpen(hour >= 10.5 && hour <= 20);
    }
  }, []);

  return (
    <section id="location" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#C85227]" />
            <span>Visit Us in East Austin</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
            Location, Hours & Directions
          </h2>
          <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
            Conveniently located at 2617 E 7th Street with on-site parking and authentic hospitality.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Hours & Contact Information */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DACD] shadow-sm flex flex-col justify-between">
            <div>
              {/* Live Status Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#F3EDE2] mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">Hours of Operation</h3>
                  <p className="text-xs text-[#8C7E72] mt-0.5">Central Time • Austin, TX</p>
                </div>
                
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isCurrentlyOpen 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen ? 'bg-emerald-500' : 'bg-amber-600'}`} />
                  {isCurrentlyOpen ? 'Open Right Now' : 'Currently Closed'}
                </div>
              </div>

              {/* Hours Table */}
              <div className="space-y-2.5 mb-8">
                {RESTAURANT_INFO.hours.map((schedule, idx) => {
                  const isToday = idx === currentDayIndex;
                  return (
                    <div
                      key={schedule.day}
                      className={`flex justify-between items-center py-2 px-3 rounded-xl text-sm transition-all ${
                        isToday
                          ? 'bg-[#F3EDE2] font-semibold text-[#1F1A17] border border-[#E3DACD]'
                          : 'text-[#5A5046] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {schedule.day}
                        {isToday && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85227] bg-[#FAF7F2] px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </span>
                      <span className={schedule.closed ? 'text-[#8C7E72] italic' : 'text-[#1F1A17]'}>
                        {schedule.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Address & Direct Phone Box */}
              <div className="space-y-4 pt-4 border-t border-[#F3EDE2]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EDE2] flex items-center justify-center shrink-0 text-[#C85227]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-[#8C7E72]">Address</span>
                    <strong className="text-base text-[#1F1A17]">{RESTAURANT_INFO.fullAddress}</strong>
                    <span className="block text-xs text-[#6E645A] mt-0.5">East Austin • Corner of E 7th & Pleasant Valley</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EDE2] flex items-center justify-center shrink-0 text-[#C85227]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-[#8C7E72]">Direct Telephone</span>
                    <a
                      href={`tel:${RESTAURANT_INFO.rawPhone}`}
                      className="text-base font-bold text-[#C85227] hover:underline"
                    >
                      {RESTAURANT_INFO.phone}
                    </a>
                    <span className="block text-xs text-[#6E645A] mt-0.5">Call for pickup orders, questions & large party reservations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#F3EDE2]">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenReservation}
                className="inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2A231E] text-[#1F1A17] hover:bg-[#2A231E] hover:text-white font-semibold text-xs uppercase tracking-[0.08em] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#C85227]" />
                <span>Reserve Table</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Map & Practical Details */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Map Visual Component */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E3DACD] shadow-sm relative flex-1 min-h-[340px] flex flex-col justify-between">
              {/* Map Canvas Frame */}
              <div className="relative w-full h-64 sm:h-72 bg-[#2A231E] overflow-hidden">
                {/* Styled static map background with marker */}
                <iframe
                  title="El Asador Margarita Ranch Grill Location Map"
                  src="https://maps.google.com/maps?q=30.2603903,-97.7119911&hl=en&z=16&output=embed"
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                />
                
                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 bg-[#171412]/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-white border border-[#3A3029] shadow-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C85227] animate-ping" />
                  <div className="leading-tight">
                    <span className="block font-serif font-bold text-xs text-white">El Asador Margarita Ranch Grill</span>
                    <span className="block text-[10px] text-[#D8CFBF]">2617 E 7th St, Austin</span>
                  </div>
                </div>
              </div>

              {/* Map Footer Info */}
              <div className="p-6 bg-[#FAF7F2] border-t border-[#E3DACD]">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#5A5046]">
                    <span className="font-bold text-[#1F1A17]">Coordinates:</span> 30.2604° N, 97.7120° W (East Austin)
                  </div>
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C85227] hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Parking & Transit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E3DACD] shadow-sm">
                <div className="flex items-center gap-2.5 text-[#C85227] font-bold text-sm mb-1.5">
                  <Car className="w-4 h-4" />
                  <span>Parking Information</span>
                </div>
                <p className="text-xs text-[#5A5046] leading-relaxed">
                  Dedicated on-site parking lot directly in front and beside the restaurant. Additional free street parking along East 7th Street.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E3DACD] shadow-sm">
                <div className="flex items-center gap-2.5 text-[#2E5A44] font-bold text-sm mb-1.5">
                  <Bus className="w-4 h-4" />
                  <span>Public Transit & Rideshare</span>
                </div>
                <p className="text-xs text-[#5A5046] leading-relaxed">
                  CapMetro bus routes stop directly on E 7th St. Dedicated rideshare drop-off zone at our main entrance.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
