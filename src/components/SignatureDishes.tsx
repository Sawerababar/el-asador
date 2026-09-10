import React from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/restaurantData';
import { Plus, Sparkles, Check } from 'lucide-react';

interface SignatureDishesProps {
  onAddToCart: (item: MenuItem) => void;
  onExploreMenu: () => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({
  onAddToCart,
  onExploreMenu,
}) => {
  // Select top 4 signature items
  const signatureItems = MENU_ITEMS.filter(item => 
    item.tags.includes('chef-special') || item.id === 'parrillada-ranchera' || item.id === 'tomahawk-pork-chop'
  ).slice(0, 4);

  return (
    <section id="asador" className="py-20 sm:py-24 bg-[#F3EDE2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
              
              <span>Signatures from the Live Fire Hearth</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
              Crafted Over Texas Mesquite
            </h2>
            <p className="text-[#6E645A] text-base sm:text-lg mt-3">
              Every dish is seasoned simply with coarse sea salt, Mexican oregano, and the pure kiss of mesquite hardwood smoke.
            </p>
          </div>

          <button
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2A231E] text-[#1F1A17] hover:bg-[#2A231E] hover:text-white font-semibold text-xs uppercase tracking-[0.08em] transition-colors self-start md:self-auto shrink-0"
          >
            <span>View Full Menu & Prices</span>
            <span>→</span>
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureItems.map((dish) => (
            <div
              key={dish.id}
              className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] hover:border-[#C85227]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#2A231E]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Price Tag Pill */}
                  <div className="absolute top-3 right-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-serif font-bold text-sm">
                    ${dish.price}
                  </div>

                  {/* Tag Pill */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {dish.tags.includes('chef-special') && (
                      <span className="inline-flex items-center gap-1 bg-[#C85227] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        <Sparkles className="w-2.5 h-2.5" />
                        Signature
                      </span>
                    )}
                    {dish.tags.includes('gluten-free') && (
                      <span className="bg-[#2E5A44] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        GF
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-[#1F1A17] group-hover:text-[#C85227] transition-colors leading-snug">
                    {dish.name}
                  </h3>
                  {dish.spanishName && (
                    <p className="text-xs text-[#8C7E72] italic mt-0.5">
                      {dish.spanishName}
                    </p>
                  )}
                  <p className="text-xs text-[#5A5046] mt-3 line-clamp-3 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 pb-5 pt-2 border-t border-[#E8DFC8]/60 flex items-center justify-between mt-auto">
                <span className="text-[11px] font-medium text-[#7D7166]">
                  {dish.category === 'asador' ? 'Includes charro beans & tortillas' : 'Made fresh to order'}
                </span>

                <button
                  onClick={() => onAddToCart(dish)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white text-xs font-bold transition-transform active:scale-95 shadow-sm"
                  title="Add to online pickup order"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Charcoal Fire Note Banner */}
        <div className="mt-12 bg-[#171412] text-white rounded-2xl p-6 sm:p-8 border border-[#2F2823] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C85227]/20 border border-[#C85227]/40 flex items-center justify-center shrink-0">
              
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Every Asador Platter Includes House Frijoles Charros
              </h3>
              <p className="text-xs sm:text-sm text-[#A89C8E] mt-1">
                Our beans are simmered for 12 hours with smoked bacon, chorizo, serrano peppers, and garden cilantro. Served in warm clay bowls.
              </p>
            </div>
          </div>
          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D9822B] hover:bg-[#C07020] text-[#171412] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
          >
            Explore Menu Categories
          </button>
        </div>

      </div>
    </section>
  );
};
