import React from 'react';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Photography Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-[#E3DACD]">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"
                alt="Open flame mesquite cooking at El Asador Austin"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D9822B] font-semibold">El Fuego y La Tradición</span>
                <p className="font-serif text-xl font-bold mt-1">Live Texas Mesquite Fireplace</p>
                <p className="text-sm text-[#D8CFBF] mt-0.5">Where Northern Mexican ranch barbecue meets East Austin warmth.</p>
              </div>
            </div>

            {/* Inset Secondary Image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 z-20 w-52 rounded-xl overflow-hidden shadow-2xl border-4 border-[#FAF7F2]">
              <img
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"
                alt="Fresh hand-pressed tortillas and tacos"
                className="w-full h-40 object-cover"
              />
              <div className="bg-[#171412] p-2.5 text-center text-white">
                <span className="text-[11px] font-semibold text-[#D9822B] block">Handmade Tortillas</span>
                <span className="text-[9px] text-[#A89C8E]">Pressed fresh to order</span>
              </div>
            </div>

            {/* Heritage Badge */}
            <div className="absolute -top-4 -left-4 z-20 bg-[#171412] text-white p-4 rounded-xl shadow-lg border border-[#3A3029] hidden sm:flex items-center gap-3">
              
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#A89C8E]">Specialty</span>
                <span className="block text-sm font-bold font-serif text-[#D9822B]">Tamaulipas-Style Barbecue</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#8C4318] text-xs font-semibold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 text-[#C85227]" />
              <span>Family-Owned & Rooted in Austin</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight leading-tight mb-6">
              The Soul of the Asador: <br />
              <span className="text-[#C85227]">Honoring Northern Mexico’s Hearth</span>
            </h2>

            <p className="text-base sm:text-lg text-[#5A5046] leading-relaxed mb-6 font-normal">
              In the ranch country of Tamaulipas and Northern Mexico, an <em>asador</em> is not merely a cooking grate—it is the gathering place of family and community. Great barbecue requires patience, pure wood coals, and reverence for quality cuts of meat.
            </p>

            <p className="text-base text-[#5A5046] leading-relaxed mb-8">
              At <strong>El Asador Margarita Ranch Grill</strong> on East 7th Street, we bring this authentic tradition to Austin. We don’t use gas broilers or liquid smoke; every steak, tomahawk pork chop, and sausage is seared over glowing Texas mesquite logs. From our 12-hour simmered charro beans to comal-blistered tortillas, everything is made from scratch with genuine pride.
            </p>

            {/* Craft Pillars Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3EDE2] border border-[#E3DACD]">
                <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F1A17]">100% Texas Mesquite Fire</h3>
                  <p className="text-xs text-[#6E645A] mt-0.5">Sear at high heat for authentic crust and deep wood smoke aroma.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3EDE2] border border-[#E3DACD]">
                <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F1A17]">Heirloom Masa Tortillas</h3>
                  <p className="text-xs text-[#6E645A] mt-0.5">Stone-ground corn and soft northern flour tortillas pressed to order.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3EDE2] border border-[#E3DACD]">
                <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F1A17]">Clay Pot Charro Beans</h3>
                  <p className="text-xs text-[#6E645A] mt-0.5">Simmered with bacon, chorizo, and fresh herbs — served with every entrée.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3EDE2] border border-[#E3DACD]">
                <CheckCircle2 className="w-5 h-5 text-[#2E5A44] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F1A17]">Artisan Agave Cantina</h3>
                  <p className="text-xs text-[#6E645A] mt-0.5">Fresh-squeezed Hill Country citrus and premium tequilas & mezcales.</p>
                </div>
              </div>
            </div>

            {/* Owner Quote / Sign-off */}
            <div className="border-l-4 border-[#C85227] pl-4 py-1 text-sm text-[#4A4036] italic">
              "When you sit down at our ranch tables, you're not just eating dinner—you're sharing our family’s hearth."
              <span className="block not-italic font-semibold text-xs text-[#1F1A17] mt-1">— The El Asador Family, Austin TX</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
