import React from 'react';
import { Sun, Users, Music, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  onOpenReservation: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onOpenReservation }) => {
  return (
    <section id="experience" className="py-20 sm:py-24 bg-[#F3EDE2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#8C4318] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sun className="w-3.5 h-3.5 text-[#C85227]" />
            <span>The East Austin Atmosphere</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
            Rustic Ranch Heart. Funky Austin Vibe.
          </h2>
          <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
            Whether you’re catching up over a sizzling parrillada on our string-lit patio or enjoying craft margaritas at the cantina bar, El Asador is built for lingering with family and friends.
          </p>
        </div>

        {/* 3-Column Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Card 1: Patio */}
          <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
            <div className="h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Outdoor rustic patio dining in Austin"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">The Patio</span>
                <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">Breezy Outdoor Dining</h3>
                <p className="text-sm text-[#5A5046] leading-relaxed">
                  Relax under Texas evening skies with warm string lights, gentle breezes, and communal wooden tables. Dog-friendly and family-ready.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                Patio Seating Available Daily
              </div>
            </div>
          </div>

          {/* Card 2: Live Fire Aroma */}
          <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
            <div className="h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                alt="Live mesquite coals in the asador hearth"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">The Kitchen</span>
                <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">The Aroma of Texas Mesquite</h3>
                <p className="text-sm text-[#5A5046] leading-relaxed">
                  The moment you walk up to 2617 E 7th St, the unmistakable sweet fragrance of hardwood smoke greets you. Watch the flame master at work.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                Open Kitchen & Mesquite Hearth
              </div>
            </div>
          </div>

          {/* Card 3: Family Gatherings */}
          <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
            <div className="h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Table sharing a parrillada feast"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">Community</span>
                <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">Parrilladas for the Whole Table</h3>
                <p className="text-sm text-[#5A5046] leading-relaxed">
                  Food in Tamaulipas is made for sharing. Sizzling platters of skirt steak, chorizo, charro beans, and warm tortillas invite everyone to build their own tacos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                Feeds 2-6 Guests Family-Style
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Callout Banner */}
        <div className="bg-[#FAF7F2] border border-[#E3DACD] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">Planning a Weekend Dinner?</h3>
            <p className="text-sm text-[#6E645A] mt-1">
              Weekends fill up quickly with local families and food enthusiasts. We gladly accept reservations for both our indoor dining room and covered patio.
            </p>
          </div>
          <button
            onClick={onOpenReservation}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-sm shadow-md transition-all shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Table Now</span>
          </button>
        </div>

      </div>
    </section>
  );
};
