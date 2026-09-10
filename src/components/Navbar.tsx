import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Phone, MapPin, Clock, ShoppingBag, Calendar, Menu as MenuIcon, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpenToday, setIsOpenToday] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    // Calculate current open/close status
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
    const hour = now.getHours() + now.getMinutes() / 60;
    
    // Monday is closed (day === 1)
    if (day === 1) {
      setIsOpenToday(false);
    } else if (day === 0) {
      // Sunday: 10:30 AM - 7:00 PM
      setIsOpenToday(hour >= 10.5 && hour <= 19);
    } else if (day === 5 || day === 6) {
      // Fri - Sat: 10:30 AM - 10:00 PM
      setIsOpenToday(hour >= 10.5 && hour <= 22);
    } else if (day === 2) {
      // Tuesday: 12:00 PM - 8:00 PM
      setIsOpenToday(hour >= 12 && hour <= 20);
    } else {
      // Wed - Thu: 10:30 AM - 8:00 PM
      setIsOpenToday(hour >= 10.5 && hour <= 20);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Mesquite Grill', href: '#asador' },
    { label: 'Cantina & Margaritas', href: '#cantina' },
    { label: 'Our Story', href: '#story' },
    { label: 'The Ranch Vibe', href: '#experience' },
    { label: 'Visit & Hours', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-[#171412] text-[#D8CFBF] text-xs py-2 px-4 border-b border-[#2C2621]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <a 
              href={RESTAURANT_INFO.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D9822B] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C85227]" />
              <span className="hidden sm:inline">{RESTAURANT_INFO.address}, East Austin</span>
              <span className="sm:hidden">2617 E 7th St</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 border-l border-[#2C2621] pl-4">
              <Clock className="w-3.5 h-3.5 text-[#C85227]" />
              <span className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${isOpenToday ? 'bg-emerald-500' : 'bg-amber-600'}`} />
                {isOpenToday ? 'Open Today for Dine-In & Pickup' : 'Closed Today (Opens Tuesday at 11 AM)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a 
              href={`tel:${RESTAURANT_INFO.rawPhone}`}
              className="flex items-center gap-1.5 hover:text-[#D9822B] font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9822B]" />
              <span>{RESTAURANT_INFO.phone}</span>
            </a>
            <span className="hidden lg:inline text-[#7D7166]">•</span>
            <span className="hidden lg:inline text-[#A89C8E]">Authentic Tamaulipas Wood Fire</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-md py-3 border-b border-[#E8DFC8]' 
            : 'bg-[#FAF7F2] py-4 border-b border-[#E8DFC8]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="focus:outline-none">
            <Logo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#382F28]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#C85227] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C85227] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenReservation}
              id="nav-reserve-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#C85227] text-[#C85227] hover:bg-[#C85227] hover:text-white transition-all text-xs font-semibold uppercase tracking-[0.08em]"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Table</span>
            </button>

            <button
              onClick={onOpenCart}
              id="nav-order-btn"
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white shadow-sm hover:shadow transition-all text-xs font-semibold uppercase tracking-[0.08em]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Pickup</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#C85227] text-xs font-bold shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              id="mobile-nav-cart-btn"
              className="relative p-2 rounded-lg bg-[#F3EDE2] text-[#1F1A17] border border-[#E3DACD]"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#C85227]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C85227] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-nav-toggle-btn"
              className="p-2 rounded-lg bg-[#F3EDE2] text-[#1F1A17] border border-[#E3DACD]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E3DACD] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-md text-sm font-semibold uppercase tracking-[0.08em] text-[#2A231E] hover:bg-[#F3EDE2] hover:text-[#C85227] transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 border-t border-[#E3DACD] flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenReservation();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#C85227] text-[#C85227] font-semibold uppercase tracking-[0.08em] text-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Table</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#C85227] text-white font-semibold uppercase tracking-[0.08em] text-xs shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Pickup ({cartCount} items)</span>
                </button>
                <a
                  href={`tel:${RESTAURANT_INFO.rawPhone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F3EDE2] text-[#2A231E] font-semibold uppercase tracking-[0.08em] text-xs text-center"
                >
                  <Phone className="w-4 h-4 text-[#D9822B]" />
                  <span>Call {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
