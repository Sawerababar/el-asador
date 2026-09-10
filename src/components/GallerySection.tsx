import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { Camera, X, Eye } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-[#C85227]" />
              <span>Life at El Asador</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
              Moments Around the Fire
            </h2>
          </div>
          <p className="text-sm text-[#8C7E72] max-w-xs">
            A glimpse into our kitchen, cantina, and East Austin gathering space.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2A231E] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9822B]">
                  {item.category}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold">
                  {item.title}
                </h3>
                <p className="text-xs text-[#D8CFBF] mt-0.5 hidden sm:block">
                  {item.subtitle}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white/80">
                  <Eye className="w-3.5 h-3.5" />
                  View Photo
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#171412] rounded-2xl overflow-hidden shadow-2xl border border-[#3A3029] animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#2F2823]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9822B]">
                  {activeImage.category}
                </span>
                <h3 className="font-serif text-xl font-bold mt-0.5">
                  {activeImage.title}
                </h3>
                <p className="text-sm text-[#A89C8E] mt-1">
                  {activeImage.subtitle}
                </p>
              </div>

              <div className="text-xs text-[#8C7E72]">
                El Asador • 2617 E 7th St, Austin TX
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
