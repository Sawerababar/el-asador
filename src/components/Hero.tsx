import React from 'react';
import { Sparkles, MapPin, Calendar, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeroProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation, onExploreMenu }) => {
  return (
    <section className="relative overflow-hidden bg-[#171412] text-white">
      {/* Background Photography with atmospheric gradient and ember tint */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=85"
          alt="Sizzling mesquite wood-fired Mexican grill at El Asador Margarita Ranch Grill Austin"
          className="w-full h-full object-cover object-center opacity-40 scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171412] via-[#171412]/85 to-[#171412]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-[#171412]/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Statement & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Location & Heritage Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              
              <span>East Austin, TX • Tamaulipas Firecraft</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              True Mesquite Fire. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9822B] via-[#E8A35C] to-[#C85227]">
                Authentic Ranch Grill.
              </span>
            </h1>

            {/* Short Supporting Statement */}
            <p className="text-lg sm:text-xl text-[#D8CFBF] max-w-2xl font-normal leading-relaxed mb-8">
              At <strong className="text-white font-semibold">El Asador</strong>, we cook over glowing Texas mesquite hardwood. Experience our signature Rib-Eye Steak Platters, northern style beef ribs, $5 tacos al carbón, and artisanal margarita flights served under our covered pergola patio in East Austin.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onExploreMenu}
                id="hero-view-menu-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C85227] hover:bg-[#B3451E] text-white font-semibold uppercase tracking-[0.08em] text-xs shadow-lg shadow-black/30 hover:shadow-xl transition-all"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={onOpenReservation}
                id="hero-reserve-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2A231E]/80 hover:bg-[#2A231E] text-white border border-[#483C34] hover:border-[#D9822B] font-semibold uppercase tracking-[0.08em] text-xs backdrop-blur-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-[#D9822B]" />
                <span>Reserve a Table</span>
              </button>
            </div>

            {/* Trust & Craft Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-[#2F2823]">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#D9822B]">700°F</span>
                <span className="text-xs text-[#A89C8E] mt-0.5">Mesquite Wood Coals</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white">$5</span>
                <span className="text-xs text-[#A89C8E] mt-0.5">Tacos al Carbón</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#D9822B]">12-Hour</span>
                <span className="text-xs text-[#A89C8E] mt-0.5">Clay Pot Charro Beans</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-[#A89C8E] mt-0.5">Blue Agave Spirits</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Dish Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#3A3029] bg-[#221C18] shadow-2xl p-2 sm:p-3">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                  alt="Mesquite-grilled Rib-Eye Steak Platter with charro beans, Mexican rice, and grilled cebollitas"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-transparent opacity-80" />
                
                {/* Floating Tag */}
                <div className="absolute top-3 left-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#483C34] flex items-center gap-1.5 text-xs text-[#D9822B] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9822B]" />
                  <span>Chef's Signature Platter</span>
                </div>

                {/* Bottom Card Info */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#171412]/95 backdrop-blur-md p-4 rounded-xl border border-[#3A3029]">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-white">Rib-Eye Steak Premium Platter</h2>
                      <p className="text-xs text-[#B5A89C]">Served in Mexican clay pottery with charro beans, rice, cebollitas & chiles toreados</p>
                    </div>
                    <span className="font-serif text-lg font-bold text-[#D9822B]">$25</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2C241E] text-[11px] text-[#A89C8E]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C85227]" />
                    <span>Complimentary house charro beans with all entrées</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Corner Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#C85227] text-white p-3 rounded-xl shadow-xl items-center gap-2.5 border border-white/10">
              <MapPin className="w-4 h-4 text-amber-200" />
              <div className="text-left leading-tight">
                <span className="block text-xs font-semibold">2617 E 7th St</span>
                <span className="block text-[10px] text-amber-100">East Austin • Free Parking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
