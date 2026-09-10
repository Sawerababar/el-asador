import React from 'react';
import { Utensils, Calendar, ShoppingBag, MapPin, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface MobileBottomBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171412]/95 backdrop-blur-lg border-t border-[#2F2823] px-3 py-2 text-white shadow-2xl">
      <div className="grid grid-cols-4 gap-1.5 items-center">
        {/* Menu Anchor */}
        <a
          href="#menu"
          className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white/5 active:bg-white/10 text-center text-[#D8CFBF]"
        >
          <Utensils className="w-4 h-4 text-[#D9822B]" />
          <span className="text-[10px] font-semibold mt-1">Menu</span>
        </a>

        {/* Directions Link */}
        <a
          href={RESTAURANT_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white/5 active:bg-white/10 text-center text-[#D8CFBF]"
        >
          <MapPin className="w-4 h-4 text-[#C85227]" />
          <span className="text-[10px] font-semibold mt-1">Directions</span>
        </a>

        {/* Reserve Table */}
        <button
          onClick={onOpenReservation}
          className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white/5 active:bg-white/10 text-center text-[#D8CFBF]"
        >
          <Calendar className="w-4 h-4 text-[#D9822B]" />
          <span className="text-[10px] font-semibold mt-1">Reserve</span>
        </button>

        {/* Order Pickup Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-center text-white shadow"
        >
          <ShoppingBag className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold mt-1">
            Order {cartCount > 0 && `(${cartCount})`}
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#C85227] text-[10px] font-extrabold flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
