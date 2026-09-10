import React, { useState } from 'react';
import { Logo } from './Logo';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { MapPin, Phone, Mail, Clock, ArrowRight, Check, Heart } from 'lucide-react';

interface FooterProps {
  onOpenReservation: () => void;
  onOpenCatering: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation, onOpenCatering }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#171412] text-white border-t border-[#2A231E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#2C241E]">
          
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" size="lg" />
            
            <p className="text-sm text-[#A89C8E] leading-relaxed max-w-sm pt-2">
              Authentic Tamaulipas-style mesquite firewood barbecue, parrilladas, hand-pressed tortillas, and craft cantina margaritas in East Austin.
            </p>

            <div className="pt-2 text-xs text-[#8C7E72] space-y-1">
              <p>• 700°F Raw Texas Mesquite Coals</p>
              <p>• 12-Hour Simmered Charro Beans with Entrées</p>
              <p>• 100% Blue Agave Craft Margaritas & Flights</p>
            </div>
          </div>

          {/* Column 2: Visit & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider text-xs">
              Location & Contact
            </h4>
            
            <div className="space-y-3 text-sm text-[#D8CFBF]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C85227] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">{RESTAURANT_INFO.fullAddress}</span>
                  <span className="text-xs text-[#8C7E72]">East Austin • On-site Parking Lot</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9822B] shrink-0" />
                <a 
                  href={`tel:${RESTAURANT_INFO.rawPhone}`}
                  className="hover:text-[#D9822B] transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C85227] shrink-0" />
                <a 
                  href={`mailto:${RESTAURANT_INFO.email}`}
                  className="hover:text-[#D9822B] transition-colors text-xs"
                >
                  {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9822B] hover:underline"
              >
                <span>Open Google Maps Directions</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Column 3: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider text-xs">
              Explore
            </h4>
            
            <ul className="space-y-2 text-sm text-[#A89C8E]">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">Food Menu</a>
              </li>
              <li>
                <a href="#asador" className="hover:text-white transition-colors">Mesquite Grill</a>
              </li>
              <li>
                <a href="#cantina" className="hover:text-white transition-colors">Margaritas & Agave</a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">Our Story</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">Patio & Vibe</a>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="text-left text-[#D9822B] hover:underline font-medium"
                >
                  Reserve a Table
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCatering}
                  className="text-left text-[#C85227] hover:underline font-medium"
                >
                  Parrillada Catering
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Notes from Kitchen (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider text-xs">
              Operating Hours
            </h4>
            
            <div className="text-xs text-[#A89C8E] space-y-1">
              <div className="flex justify-between py-0.5">
                <span>Tuesday</span>
                <span className="text-white font-medium">12:00 PM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Wed – Thu</span>
                <span className="text-white font-medium">10:30 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Fri – Sat</span>
                <span className="text-white font-medium">10:30 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Sunday</span>
                <span className="text-white font-medium">10:30 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5 text-[#C85227]">
                <span>Monday</span>
                <span className="font-semibold">Closed</span>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="pt-3">
              <span className="block text-xs font-semibold text-white mb-1.5">
                Occasional notes from the kitchen
              </span>
              
              {isSubscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                  <Check className="w-3.5 h-3.5" />
                  <span>Gracias! You're on the list for seasonal specials.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#221C18] border border-[#3A3029] text-xs text-white placeholder:text-[#6E645A] focus:outline-none focus:border-[#C85227]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Row: Legal & Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D7166]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} El Asador Margarita Ranch Grill. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Accessibility</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
