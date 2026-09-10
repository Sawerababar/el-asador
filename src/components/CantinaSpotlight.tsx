import React from 'react';
import { Sparkles, Wine, GlassWater, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/restaurantData';

interface CantinaSpotlightProps {
  onAddToCart: (item: MenuItem) => void;
  onOpenReservation: () => void;
}

export const CantinaSpotlight: React.FC<CantinaSpotlightProps> = ({
  onAddToCart,
  onOpenReservation,
}) => {
  const flightItem = MENU_ITEMS.find(item => item.id === 'famous-margarita-flight') || MENU_ITEMS[0];
  const clasicaItem = MENU_ITEMS.find(item => item.id === 'margarita-ranchera-clasica') || MENU_ITEMS[1];

  return (
    <section id="cantina" className="py-20 sm:py-24 bg-[#171412] text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-[#C85227]/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-[#D9822B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Spotlight */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-[#3A3029] bg-[#221C18] p-3 sm:p-4 shadow-2xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=80"
                  alt="Famous Margarita Flight at El Asador Margarita Ranch Grill"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-transparent opacity-70" />

                <div className="absolute top-3 left-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#483C34] text-xs text-[#D9822B] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cantina Crowd Favorite</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-[#171412]/95 backdrop-blur-md p-4 rounded-xl border border-[#3A3029]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">The Famous Asador Margarita Flight</h3>
                      <p className="text-xs text-[#B5A89C]">Four 3oz artisanal pours • Lime, Mango-Habanero, Hibiscus Mezcal & Prickly Pear</p>
                    </div>
                    <span className="font-serif text-xl font-bold text-[#D9822B] shrink-0 ml-3">$22</span>
                  </div>
                </div>
              </div>

              {/* Quick Action under image */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#A89C8E] px-1">
                <span>Made with 100% Blue Agave Tequila & Mezcal</span>
                <button
                  onClick={() => onAddToCart(flightItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs shadow transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Flight for Pickup</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Cantina Narrative & Elements */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold tracking-wider uppercase mb-4">
              <GlassWater className="w-3.5 h-3.5 text-[#C85227]" />
              <span>Full Tequila & Mezcal Cantina</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              Hand-Shaken Agave & <br />
              <span className="text-[#D9822B]">The Legend of the Margarita Flight</span>
            </h2>

            <p className="text-base sm:text-lg text-[#D8CFBF] leading-relaxed mb-6 font-normal">
              At El Asador Margarita Ranch Grill, our cantina program matches the intensity of our mesquite fire. We squeeze fresh Texas Hill Country limes daily, never touch bottled sweet-and-sour mix, and pour 100% blue agave tequilas and artisanal Oaxaca mezcales.
            </p>

            {/* Cantina Features Breakdown */}
            <div className="space-y-4 w-full mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                  1
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">The Four-Glass Margarita Flight</h3>
                  <p className="text-xs text-[#A89C8E] mt-0.5">
                    Taste four distinct profiles side-by-side: Classic Smoked Sea Salt, Tangy Mango-Habanero, Smoky Ruby Hibiscus Mezcalita, and Sweet Cactus Pear.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                  2
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Pure 100% Blue Agave Spirits</h3>
                  <p className="text-xs text-[#A89C8E] mt-0.5">
                    Curated selection of small-batch blancos, reposados, anejos, and wild-harvested mezcales with volcanic salt and orange slices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                  3
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">Austin Ranch Waters & Cold Cervezas</h3>
                  <p className="text-xs text-[#A89C8E] mt-0.5">
                    Ice-cold Modelo, Pacifico, Victoria, and Texas craft drafts, alongside Topo Chico ranch waters prepared with fresh lime and reposado.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenReservation}
                className="px-6 py-3 rounded-xl bg-[#D9822B] hover:bg-[#C07020] text-[#171412] font-bold text-sm shadow transition-colors"
              >
                Reserve a Table at the Cantina
              </button>
              <button
                onClick={() => onAddToCart(clasicaItem)}
                className="px-5 py-3 rounded-xl border border-[#483C34] hover:border-[#D9822B] text-white text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#D9822B]" />
                <span>Order Margarita Clásica ($13)</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
