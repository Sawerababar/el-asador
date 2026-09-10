import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  ShoppingBag,
  Calendar,
  Menu as MenuIcon,
  X,
  Search,
  Plus,
  Minus,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Info,
  Sun,
  Flame,
  Wine,
  GlassWater,
  PartyPopper,
  Instagram,
  Facebook,
  MessageCircle,
  Share2
} from 'lucide-react';
import { RESTAURANT_INFO, MENU_CATEGORIES, MENU_ITEMS, GUEST_REVIEWS, GALLERY_ITEMS } from './data/restaurantData';
import type { MenuItem, MenuCategory, DietaryTag, CartItem, ReservationDetails, CateringInquiry } from './types';

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function App() {
  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isOpenToday, setIsOpenToday] = useState(true);

  // Menu Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<DietaryTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Ordering State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderCompleted, setOrderCompleted] = useState<{ orderId: string; name: string; total: number } | null>(null);

  // Customization Modal State
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reservation Modal State
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationForm, setReservationForm] = useState<ReservationDetails>({
    fullName: '',
    email: '',
    phone: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '6:30 PM',
    seatingPreference: 'rustic-patio',
    specialOccasion: '',
  });
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationDetails | null>(null);

  // Catering Modal State
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [cateringForm, setCateringForm] = useState<CateringInquiry>({
    fullName: '',
    email: '',
    phone: '',
    guestCount: 25,
    eventDate: '',
    eventType: 'Backyard Parrillada Fiesta',
    notes: '',
  });
  const [cateringSubmitted, setCateringSubmitted] = useState(false);

  // Gallery Lightbox State
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate live hours status
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
    const hour = now.getHours() + now.getMinutes() / 60;

    if (day === 1) {
      setIsOpenToday(false); // Monday closed
    } else if (day === 0) {
      setIsOpenToday(hour >= 10.5 && hour <= 19); // Sun 10:30 AM - 7 PM
    } else if (day === 5 || day === 6) {
      setIsOpenToday(hour >= 10.5 && hour <= 22); // Fri-Sat 10:30 AM - 10 PM
    } else if (day === 2) {
      setIsOpenToday(hour >= 12 && hour <= 20); // Tue 12 PM - 8 PM
    } else {
      setIsOpenToday(hour >= 10.5 && hour <= 20); // Wed-Thu 10:30 AM - 8 PM
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => setToastMessage(msg);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTag = selectedTag === 'all' || item.tags.includes(selectedTag);
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.spanishName && item.spanishName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTag && matchSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  // Cart Management
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartTax = cartSubtotal * 0.0825;
  const cartTotal = cartSubtotal + cartTax;

  const handleOpenDish = (dish: MenuItem) => {
    setActiveDish(dish);
    setSelectedOption(dish.options ? dish.options[0] : '');
    setSpecialInstructions('');
  };

  const handleAddToCartDirect = (dish: MenuItem, option?: string, instructions?: string) => {
    const itemOption = option || (dish.options ? dish.options[0] : undefined);
    const cartItemId = `${dish.id}-${itemOption || 'standard'}-${instructions || ''}`;

    setCart((prev) => {
      const existing = prev.find((x) => x.id === cartItemId);
      if (existing) {
        return prev.map((x) => (x.id === cartItemId ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [
        ...prev,
        {
          id: cartItemId,
          menuItem: dish,
          quantity: 1,
          selectedOption: itemOption,
          specialInstructions: instructions,
        },
      ];
    });

    showToast(`Added ${dish.name} to order`);
    setActiveDish(null);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName || !customerPhone) return;

    const generatedId = `ASADOR-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCompleted({
      orderId: generatedId,
      name: customerName,
      total: cartTotal,
    });
    setCart([]);
  };

  // Reservation Submission
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `EA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedReservation({
      ...reservationForm,
      confirmationCode: code,
    });
  };

  // Catering Submission
  const handleCateringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCateringSubmitted(true);
  };

  const navLinks = [
    { label: 'The Menu', href: '#menu' },
    { label: 'Mesquite Grill', href: '#asador' },
    { label: 'Cantina & Margaritas', href: '#cantina' },
    { label: 'Patio & Vibe', href: '#experience' },
    { label: 'Our Story', href: '#story' },
    { label: 'Visit & Hours', href: '#location' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A17] flex flex-col selection:bg-[#C85227] selection:text-white">
      {/* 1. TOP UTILITY STATUS BAR */}
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
              <span className="hidden sm:inline">{RESTAURANT_INFO.address}, East Austin, TX</span>
              <span className="sm:hidden">2617 E 7th St</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 border-l border-[#2C2621] pl-4">
              <Clock className="w-3.5 h-3.5 text-[#C85227]" />
              <span className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${isOpenToday ? 'bg-emerald-500' : 'bg-amber-600'}`} />
                {isOpenToday ? 'Open Today for Dine-In & Pickup' : 'Closed Today (Opens Tuesday at 12 PM)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${RESTAURANT_INFO.rawPhone}`}
              className="flex items-center gap-1.5 hover:text-[#D9822B] font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9822B]" />
              <span>{RESTAURANT_INFO.phone}</span>
            </a>
            <span className="hidden lg:inline text-[#7D7166]">•</span>
            <span className="hidden lg:inline text-[#A89C8E]">Authentic Tamaulipas Wood Fire</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-md py-3 border-b border-[#E8DFC8]'
              : 'bg-[#FAF7F2] py-4 border-b border-[#E8DFC8]/60'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 focus:outline-none">
              <div className="flex flex-col text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold uppercase tracking-wide text-xl sm:text-2xl text-[#1F1A17]">
                    El Asador
                  </span>
                  <span className="text-[#C85227] font-semibold text-xs">•</span>
                </div>
                <span className="font-serif font-semibold uppercase mt-0.5 text-[10px] tracking-[0.22em] text-[#C85227]">
                  Margarita Ranch Grill
                </span>
                <span className="font-serif font-medium uppercase mt-0.5 tracking-wider text-[9px] text-[#7D7166]">
                  East Austin, Texas
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
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

            {/* Desktop Action CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  setIsReservationOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#C85227] text-[#C85227] hover:bg-[#C85227] hover:text-white transition-all text-xs font-semibold uppercase tracking-[0.08em]"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Table</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
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

            {/* Mobile Nav Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
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
                onClick={() => setNavOpen(!navOpen)}
                className="p-2 rounded-lg bg-[#F3EDE2] text-[#1F1A17] border border-[#E3DACD]"
                aria-label="Toggle menu"
              >
                {navOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {navOpen && (
            <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E3DACD] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="py-2 px-3 rounded-md text-sm font-semibold uppercase tracking-[0.08em] text-[#2A231E] hover:bg-[#F3EDE2] hover:text-[#C85227] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="pt-3 border-t border-[#E3DACD] flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setNavOpen(false);
                      setConfirmedReservation(null);
                      setIsReservationOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#C85227] text-[#C85227] font-semibold uppercase tracking-[0.08em] text-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book a Table</span>
                  </button>
                  <button
                    onClick={() => {
                      setNavOpen(false);
                      setIsCartOpen(true);
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

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#171412] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=85"
            alt="Mesquite live-fire cooking at El Asador Margarita Ranch Grill East Austin"
            className="w-full h-full object-cover object-center opacity-40 scale-[1.02] transform transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171412] via-[#171412]/85 to-[#171412]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-[#171412]/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
                <span>East Austin, TX • Tamaulipas Firecraft</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                True Mesquite Fire. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9822B] via-[#E8A35C] to-[#C85227]">
                  Authentic Ranch Grill.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#D8CFBF] max-w-2xl font-normal leading-relaxed mb-8">
                At <strong className="text-white font-semibold">El Asador</strong>, we cook over glowing Texas mesquite hardwood embers. Experience prime Rib-Eye Platters, tender beef ribs, $5 tacos al carbón, and artisanal margarita flights served beneath our covered pergola patio on East 7th Street.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
                <a
                  href="#menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C85227] hover:bg-[#B3451E] text-white font-semibold uppercase tracking-[0.08em] text-xs shadow-lg shadow-black/30 hover:shadow-xl transition-all"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </a>

                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    setIsReservationOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2A231E]/80 hover:bg-[#2A231E] text-white border border-[#483C34] hover:border-[#D9822B] font-semibold uppercase tracking-[0.08em] text-xs backdrop-blur-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#D9822B]" />
                  <span>Reserve a Table</span>
                </button>
              </div>

              {/* Trust Badges */}
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

            {/* Right Featured Dish Spotlight */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#3A3029] bg-[#221C18] shadow-2xl p-2 sm:p-3">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                    alt="Mesquite-grilled Rib-Eye Steak Premium Platter with charro beans, Mexican rice, and cebollitas"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#483C34] flex items-center gap-1.5 text-xs text-[#D9822B] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9822B]" />
                    <span>Chef's Signature Platter</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-[#171412]/95 backdrop-blur-md p-4 rounded-xl border border-[#3A3029]">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                          Rib-Eye Steak Premium Platter
                        </h2>
                        <p className="text-xs text-[#B5A89C]">
                          Served in Mexican clay pottery with charro beans, rice, cebollitas & chiles toreados
                        </p>
                      </div>
                      <span className="font-serif text-lg font-bold text-[#D9822B]">$25</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2C241E] text-[11px] text-[#A89C8E]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C85227]" />
                      <span>Complimentary house charro beans included with all entrées</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Badge */}
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

      {/* 4. BRAND RIBBON */}
      <div className="bg-[#983D27] text-[#FFF4DF] py-4 px-4 overflow-hidden border-y border-[#762E1B]">
        <div className="max-w-7xl mx-auto flex justify-around items-center gap-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em]">
          <span>DEL ASADOR A TU MESA</span>
          <span className="text-amber-300">✳</span>
          <span>TAMAULIPAS WOOD FIRE</span>
          <span className="text-amber-300">✳</span>
          <span>ARTISAN MARGARITA CANTINA</span>
          <span className="text-amber-300 hidden sm:inline">✳</span>
          <span className="hidden sm:inline">EAST AUSTIN, TEXAS</span>
        </div>
      </div>

      {/* 5. SIGNATURE DISHES FROM THE MESQUITE HEARTH */}
      <section id="asador" className="py-20 sm:py-24 bg-[#F3EDE2] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
                <Flame className="w-3.5 h-3.5 text-[#C85227]" />
                <span>Live Mesquite Wood Fire Hearth</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
                Crafted Over Texas Mesquite
              </h2>
              <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
                Generous carnes asadas and sizzling platters seasoned simply with sea salt, Mexican oregano, and the pure kiss of hardwood smoke.
              </p>
            </div>

            <a
              href="#menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2A231E] text-[#1F1A17] hover:bg-[#2A231E] hover:text-white font-semibold text-xs uppercase tracking-[0.08em] transition-colors self-start md:self-auto shrink-0"
            >
              <span>View Full Menu & Prices</span>
              <span>→</span>
            </a>
          </div>

          {/* 4 Feature Dish Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              MENU_ITEMS.find((x) => x.id === 'ribeye-steak-premium')!,
              MENU_ITEMS.find((x) => x.id === 'skirt-steak-platter')!,
              MENU_ITEMS.find((x) => x.id === 'northern-beef-ribs')!,
              MENU_ITEMS.find((x) => x.id === 'taco-ribeye')!,
            ].map((dish) => (
              <div
                key={dish.id}
                className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] hover:border-[#C85227]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#2A231E]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-serif font-bold text-sm shadow">
                      ${dish.price}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-[#1F1A17] group-hover:text-[#C85227] transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    {dish.spanishName && (
                      <p className="text-xs text-[#8C7E72] italic mt-0.5">{dish.spanishName}</p>
                    )}
                    <p className="text-xs sm:text-sm text-[#5A5046] mt-3 leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[#E8DFC8]/60 flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-medium text-[#7D7166]">
                    {dish.category === 'asador' ? 'Includes beans, rice & tortillas' : 'Made fresh to order'}
                  </span>

                  <button
                    onClick={() => handleOpenDish(dish)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white text-xs font-semibold uppercase tracking-[0.08em] transition-transform active:scale-95 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Complimentary Charro Beans Banner */}
          <div className="mt-12 bg-[#171412] text-white rounded-2xl p-6 sm:p-8 border border-[#2F2823] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C85227]/20 border border-[#C85227]/40 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-6 h-6 text-[#D9822B]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Every Asador Platter Includes House Frijoles Charros
                </h3>
                <p className="text-xs sm:text-sm text-[#A89C8E] mt-1">
                  Our beans are simmered for 12 hours with smoked bacon, chorizo, serrano peppers, and garden cilantro. Served in warm clay pottery bowls.
                </p>
              </div>
            </div>
            <a
              href="#menu"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D9822B] hover:bg-[#C07020] text-[#171412] font-semibold text-xs uppercase tracking-[0.08em] shrink-0 text-center transition-colors"
            >
              Explore Full Menu
            </a>
          </div>
        </div>
      </section>

      {/* 6. OUR HERITAGE & STORY */}
      <section id="story" className="py-20 sm:py-24 bg-[#EBE6DB] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#8C4318] text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Our Heritage & Traditions</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight leading-tight mb-6">
                Mexican Soul. <br />
                <span className="text-[#C85227]">Austin Spirit.</span>
              </h2>
              <p className="text-base sm:text-lg text-[#5A5046] leading-relaxed mb-6">
                There’s something about a meal gathered around the grill. El Asador Margarita Ranch Grill brings northeastern Tamaulipas-style barbecue traditions to the heart of East Austin.
              </p>
              <p className="text-sm sm:text-base text-[#6E645A] leading-relaxed mb-8">
                The word <em className="font-serif font-bold text-[#1F1A17]">asador</em> means the grill at the center of the gathering. We keep the hearth burning at 700°F with seasoned Texas mesquite, press tortillas hot to order, and pour real agave margaritas beneath our string-lit covered pergola patio.
              </p>
              <a
                href="#location"
                className="inline-flex items-center gap-2 text-[#C85227] hover:text-[#1F1A17] font-semibold text-xs uppercase tracking-[0.08em] transition-colors"
              >
                <span>Find Us on East 7th Street</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#2A231E]">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                    alt="Live mesquite charcoal hearth at El Asador"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3DACD]">
                  <span className="block font-serif text-2xl font-bold text-[#C85227]">700°F</span>
                  <span className="text-xs text-[#5A5046]">Direct mesquite wood sear for perfect crust</span>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3DACD]">
                  <span className="block font-serif text-2xl font-bold text-[#D9822B]">12 Hours</span>
                  <span className="text-xs text-[#5A5046]">Slow-simmered pinto charro beans in clay pots</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#2A231E]">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                    alt="Covered pergola outdoor patio at El Asador Austin"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPLETE VERIFIED MENU SECTION */}
      <section id="menu" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#E3DACD] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Authentic Food & Cantina Menu • Austin, TX</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
              Our Complete Menu
            </h2>
            <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
              From mesquite-grilled rib-eyes and $5 tacos al carbón to artisan margarita flights. Prepared fresh to order with complimentary house charro beans.
            </p>
          </div>

          {/* Search & Dietary Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#F3EDE2] p-3 sm:p-4 rounded-2xl border border-[#E3DACD]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rib-eye, tacos, margaritas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#DCD1C0] focus:outline-none focus:border-[#C85227] text-sm text-[#1F1A17] placeholder:text-[#8C7E72]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7E72] hover:text-[#1F1A17]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { tag: 'all', label: 'All Items' },
                { tag: 'chef-special', label: '★ Signature' },
                { tag: 'gluten-free', label: 'Gluten-Free' },
                { tag: 'spicy', label: 'Spicy' },
                { tag: 'vegetarian', label: 'Vegetarian' },
              ].map((opt) => (
                <button
                  key={opt.tag}
                  onClick={() => setSelectedTag(opt.tag as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedTag === opt.tag
                      ? 'bg-[#C85227] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#5A5046] hover:bg-[#E8DFC8] border border-[#DCD1C0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E3DACD] scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl font-serif text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#171412] text-[#D9822B] shadow'
                  : 'bg-transparent text-[#5A5046] hover:text-[#1F1A17] hover:bg-[#F3EDE2]'
              }`}
            >
              All Categories ({MENU_ITEMS.length})
            </button>
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-serif text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#171412] text-[#D9822B] shadow'
                    : 'bg-transparent text-[#5A5046] hover:text-[#1F1A17] hover:bg-[#F3EDE2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Category Banner */}
          {selectedCategory !== 'all' && (
            <div className="mb-8 p-4 rounded-xl bg-[#F3EDE2] border-l-4 border-[#C85227] text-[#4A4036] text-sm">
              <p>{MENU_CATEGORIES.find((c) => c.id === selectedCategory)?.description}</p>
            </div>
          )}

          {/* Menu Items Grid */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-[#F3EDE2] rounded-2xl border border-[#E3DACD]">
              <Info className="w-8 h-8 text-[#8C7E72] mx-auto mb-2" />
              <p className="font-serif text-lg font-bold text-[#1F1A17]">No dishes found</p>
              <p className="text-sm text-[#6E645A] mt-1">Try clearing your search query or dietary filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#C85227] text-white text-xs font-semibold rounded-lg uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E3DACD] hover:border-[#C85227]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#2A231E]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-3 right-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-serif font-bold text-sm shadow">
                        ${item.price}
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                        {item.tags.includes('chef-special') && (
                          <span className="inline-flex items-center gap-1 bg-[#C85227] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            <Sparkles className="w-2.5 h-2.5" />
                            Signature
                          </span>
                        )}
                        {item.tags.includes('gluten-free') && (
                          <span className="bg-[#2E5A44] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            GF
                          </span>
                        )}
                        {item.tags.includes('spicy') && (
                          <span className="bg-[#8C2318] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Spicy
                          </span>
                        )}
                        {item.tags.includes('vegetarian') && (
                          <span className="bg-[#487346] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Vegetarian
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-[#1F1A17] group-hover:text-[#C85227] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      {item.spanishName && (
                        <p className="text-xs text-[#8C7E72] italic mt-0.5">{item.spanishName}</p>
                      )}
                      <p className="text-xs sm:text-sm text-[#5A5046] mt-3 leading-relaxed">
                        {item.description}
                      </p>

                      {item.options && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8C7E72]">
                          <SlidersHorizontal className="w-3 h-3 text-[#C85227]" />
                          <span>Choices: {item.options.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-[#F3EDE2] flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-[#8C7E72]">
                      {item.category === 'asador' ? 'Includes Beans & Rice' : 'Fresh Prepared'}
                    </span>

                    <button
                      onClick={() => handleOpenDish(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white text-xs font-semibold uppercase tracking-[0.08em] transition-all shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{item.options ? 'Customize & Add' : 'Add to Order'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. ATMOSPHERE & PATIO EXPERIENCE */}
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
              Relax on our string-lit covered pergola patio with wooden picnic tables set over lush lawn, or sip artisan agave margaritas in the warm Texas evening air.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {/* Card 1: Patio */}
            <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Covered pergola outdoor patio with picnic tables and string lights"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">The Patio</span>
                  <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">Covered Pergola & Lawn</h3>
                  <p className="text-sm text-[#5A5046] leading-relaxed">
                    Dine outdoors beneath cedar pergola beams with wooden picnic tables set on green lawn, glowing string festoon lights, and a welcoming East Austin vibe.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                  Covered Outdoor Seating & Dog-Friendly
                </div>
              </div>
            </div>

            {/* Card 2: Live Fire */}
            <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                  alt="Live Texas mesquite charcoal coals grilling steaks"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">The Grill</span>
                  <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">Texas Mesquite Firecraft</h3>
                  <p className="text-sm text-[#5A5046] leading-relaxed">
                    Real northeastern Mexican barbecue cooked over live mesquite hardwood embers at 700°F. Savor crisp smoky edges and rich, juicy centers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                  Rib-Eyes, Ribs, Sausage & $5 Tacos
                </div>
              </div>
            </div>

            {/* Card 3: Clay Pottery */}
            <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"
                  alt="Authentic Mexican clay pottery with charro beans and carnes asadas"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C85227]">Tradition</span>
                  <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-1 mb-2">Platos y Cazuelas de Barro</h3>
                  <p className="text-sm text-[#5A5046] leading-relaxed">
                    Food served the authentic way in Mexican hand-painted earthenware with complimentary 12-hour simmered frijoles charros and grilled cebollitas.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DFC8] text-xs font-semibold text-[#8C7E72]">
                  Authentic Tamaulipas Ranch Tradition
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Callout */}
          <div className="bg-[#FAF7F2] border border-[#E3DACD] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">Planning a Visit with Family & Friends?</h3>
              <p className="text-sm text-[#6E645A] mt-1">
                We gladly welcome walk-ins and reservations for both our covered pergola patio and indoor seating area.
              </p>
            </div>
            <button
              onClick={() => {
                setConfirmedReservation(null);
                setIsReservationOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md transition-all shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Table Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. CANTINA & MARGARITA SPOTLIGHT */}
      <section id="cantina" className="py-20 sm:py-24 bg-[#171412] text-white relative overflow-hidden">
        <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-[#C85227]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-[#D9822B]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column Image */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-[#3A3029] bg-[#221C18] p-3 sm:p-4 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=80"
                    alt="The Famous Asador 4-Pour Margarita Flight"
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
                        <p className="text-xs text-[#B5A89C]">Four 3oz pours • Lime, Mango-Habanero, Hibiscus & Prickly Pear</p>
                      </div>
                      <span className="font-serif text-xl font-bold text-[#D9822B] shrink-0 ml-3">$22</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#A89C8E] px-1">
                  <span>Made with 100% Blue Agave Tequila & Mezcal</span>
                  <button
                    onClick={() => handleAddToCartDirect(MENU_ITEMS.find((x) => x.id === 'famous-margarita-flight')!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order Flight</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Narrative */}
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
                At El Asador Margarita Ranch Grill, our cantina program matches the intensity of our mesquite fire. We squeeze fresh limes daily, use 100% blue agave tequilas, and pour artisanal mezcales alongside refreshing Mexican sodas.
              </p>

              <div className="space-y-4 w-full mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                  <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">The Four-Glass Margarita Flight ($22)</h3>
                    <p className="text-xs text-[#A89C8E] mt-0.5">
                      Classic Smoked Sea Salt, Tangy Mango-Habanero, Smoky Ruby Hibiscus, and Texas Cactus Pear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                  <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">Margarita Ranchera Clásica ($13)</h3>
                    <p className="text-xs text-[#A89C8E] mt-0.5">
                      100% Agave Tequila Blanco, organic agave nectar, fresh lime, and chili-lime salt rim.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#221C18] border border-[#3A3029]">
                  <span className="w-8 h-8 rounded-lg bg-[#C85227]/20 flex items-center justify-center shrink-0 text-[#D9822B] font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">Mexican Coke, Jarritos & Fresh Lemonade</h3>
                    <p className="text-xs text-[#A89C8E] mt-0.5">
                      Glass-bottle Mexican Coke ($5), Jarritos Mandarina ($4), and fresh homemade lemonade with 2 refills ($6).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    setIsReservationOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#D9822B] hover:bg-[#C07020] text-[#171412] font-semibold text-xs uppercase tracking-[0.08em] shadow transition-colors"
                >
                  Reserve Table at Cantina
                </button>
                <button
                  onClick={() => handleAddToCartDirect(MENU_ITEMS.find((x) => x.id === 'margarita-ranchera-clasica')!)}
                  className="px-5 py-3 rounded-xl border border-[#483C34] hover:border-[#D9822B] text-white text-xs font-semibold uppercase tracking-[0.08em] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#D9822B]" />
                  <span>Order Margarita Clásica ($13)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PHOTO GALLERY */}
      <section id="gallery" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#E3DACD] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
                <span>Atmosphere & Dish Gallery</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
                Fire. Flavor. Feeling.
              </h2>
            </div>
            <p className="text-[#6E645A] text-sm sm:text-base max-w-md">
              A glimpse into the covered pergola patio, live mesquite charcoal grill, and authentic Mexican clay pottery platters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_ITEMS.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveGalleryIndex(index)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2A231E] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="font-serif font-bold text-white text-base">{item.title}</span>
                  <span className="text-xs text-[#D8CFBF] mt-0.5">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. GUEST REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-[#F3EDE2] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#8C4318] text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Verified Guest Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
              Loved by Austin Locals
            </h2>
            <p className="text-[#6E645A] text-base sm:text-lg mt-3">
              Rated 4.7 ★ on Google by over 140 Austin diners and barbecue enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GUEST_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FAF7F2] rounded-2xl p-7 border border-[#E3DACD] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C85227] mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-[#382F28] text-sm sm:text-base leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8DFC8] flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#1F1A17] block">{rev.author}</span>
                    <span className="text-xs text-[#8C7E72]">{rev.location}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#C85227] bg-[#F3EDE2] px-2.5 py-1 rounded-full border border-[#E3DACD]">
                    {rev.dish}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. LOCATION, HOURS & GOOGLE MAP */}
      <section id="location" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#C85227]" />
              <span>Visit Us in East Austin</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
              Location, Hours & Directions
            </h2>
            <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
              Conveniently located at 2617 E 7th Street with on-site parking and friendly hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Hours & Contact */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DACD] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#F3EDE2] mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C7E72] block">Current Status</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${isOpenToday ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'}`} />
                      <span className="font-serif font-bold text-lg text-[#1F1A17]">
                        {isOpenToday ? 'Open Now for Dining & Pickup' : 'Currently Closed'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C7E72] bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E3DACD]">
                    Austin (CT) Time
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#1F1A17] uppercase tracking-wider text-xs mb-3">
                  Weekly Operating Schedule
                </h3>

                <div className="space-y-2 mb-8">
                  {RESTAURANT_INFO.hours.map((item) => (
                    <div
                      key={item.day}
                      className="flex justify-between items-center py-1.5 border-b border-[#F3EDE2] text-sm"
                    >
                      <span className="font-medium text-[#382F28]">{item.day}</span>
                      <span className={item.closed ? 'text-[#C85227] font-semibold' : 'text-[#5A5046] font-semibold'}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C85227] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-[#1F1A17] text-sm">{RESTAURANT_INFO.fullAddress}</span>
                      <span className="text-xs text-[#8C7E72]">East Austin • On-site Parking Lot</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D9822B] shrink-0" />
                    <a href={`tel:${RESTAURANT_INFO.rawPhone}`} className="text-sm font-semibold text-[#1F1A17] hover:text-[#C85227]">
                      {RESTAURANT_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

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
                  onClick={() => {
                    setConfirmedReservation(null);
                    setIsReservationOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2A231E] text-[#1F1A17] hover:bg-[#2A231E] hover:text-white font-semibold text-xs uppercase tracking-[0.08em] transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#C85227]" />
                  <span>Reserve Table</span>
                </button>
              </div>
            </div>

            {/* Right Map */}
            <div className="lg:col-span-6 bg-white rounded-3xl overflow-hidden border border-[#E3DACD] shadow-sm flex flex-col justify-between min-h-[380px]">
              <div className="relative w-full flex-1 min-h-[300px] bg-[#2A231E]">
                <iframe
                  title="El Asador Margarita Ranch Grill Location Map"
                  src="https://maps.google.com/maps?q=30.2603903,-97.7119911&hl=en&z=16&output=embed"
                  className="w-full h-full border-0 filter contrast-105 min-h-[300px]"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[#171412]/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-white border border-[#3A3029] shadow-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C85227] animate-ping" />
                  <div className="leading-tight">
                    <span className="block font-serif font-bold text-xs text-white">El Asador Margarita Ranch Grill</span>
                    <span className="block text-[10px] text-[#D8CFBF]">2617 E 7th St, East Austin</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#FAF7F2] border-t border-[#E3DACD] flex items-center justify-between">
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
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-[#171412] text-white border-t border-[#2A231E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#2C241E]">
            {/* Brand (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex flex-col text-left leading-none">
                <span className="font-serif font-bold uppercase tracking-wide text-2xl text-white">
                  El Asador
                </span>
                <span className="font-serif font-semibold uppercase mt-0.5 text-xs tracking-[0.22em] text-[#D9822B]">
                  Margarita Ranch Grill
                </span>
                <span className="font-serif font-medium uppercase mt-0.5 tracking-wider text-[10px] text-[#B5A89C]">
                  East Austin, Texas
                </span>
              </div>
              <p className="text-sm text-[#A89C8E] leading-relaxed max-w-sm pt-2">
                Authentic Tamaulipas-style mesquite firewood barbecue, carnes asadas, handmade tortillas, and artisan cantina margaritas in East Austin.
              </p>
              <div className="pt-2 text-xs text-[#8C7E72] space-y-1">
                <p>• 700°F Raw Texas Mesquite Coals</p>
                <p>• 12-Hour Simmered Charro Beans with Entrées</p>
                <p>• 100% Blue Agave Craft Margaritas & Flights</p>
              </div>

              {/* Social Channels */}
              <div className="pt-3 flex items-center gap-3">
                <a
                  href={RESTAURANT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-[#241D18] hover:bg-[#C85227] text-[#D8CFBF] hover:text-white transition-colors border border-[#3A3029]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={RESTAURANT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full bg-[#241D18] hover:bg-[#C85227] text-[#D8CFBF] hover:text-white transition-colors border border-[#3A3029]"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={RESTAURANT_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="p-2 rounded-full bg-[#241D18] hover:bg-[#25D366] text-[#D8CFBF] hover:text-white transition-colors border border-[#3A3029]"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={RESTAURANT_INFO.socials.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linktree & Menu"
                  className="px-3 py-1.5 rounded-full bg-[#241D18] hover:bg-[#D9822B] text-xs font-semibold text-[#D8CFBF] hover:text-white transition-colors border border-[#3A3029] flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Linktree</span>
                </a>
              </div>
            </div>

            {/* Location (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider text-xs">
                Location & Contact
              </h4>
              <div className="space-y-3 text-sm text-[#D8CFBF]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C85227] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">{RESTAURANT_INFO.fullAddress}</span>
                    <span className="text-xs text-[#8C7E72]">East Austin • On-site Parking</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D9822B] shrink-0" />
                  <a href={`tel:${RESTAURANT_INFO.rawPhone}`} className="hover:text-[#D9822B] transition-colors">
                    {RESTAURANT_INFO.phone}
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

            {/* Quick Links (2 cols) */}
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
                  <a href="#cantina" className="hover:text-white transition-colors">Margarita Cantina</a>
                </li>
                <li>
                  <a href="#experience" className="hover:text-white transition-colors">Patio & Vibe</a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setIsReservationOpen(true);
                    }}
                    className="text-left text-[#D9822B] hover:underline font-medium"
                  >
                    Reserve a Table
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCateringSubmitted(false);
                      setIsCateringOpen(true);
                    }}
                    className="text-left text-[#C85227] hover:underline font-medium"
                  >
                    Parrillada Catering
                  </button>
                </li>
              </ul>
            </div>

            {/* Hours (3 cols) */}
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
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D7166]">
            <span>© {new Date().getFullYear()} El Asador Margarita Ranch Grill. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#menu" className="hover:text-white transition-colors">Menu</a>
              <span>•</span>
              <a href="#location" className="hover:text-white transition-colors">Location & Hours</a>
              <span>•</span>
              <a href="#experience" className="hover:text-white transition-colors">Patio Dining</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 14. MOBILE BOTTOM FIXED BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171412]/95 backdrop-blur-lg border-t border-[#2F2823] px-3 py-2 text-white shadow-2xl">
        <div className="grid grid-cols-4 gap-1.5 items-center">
          <a
            href="#menu"
            className="flex flex-col items-center justify-center py-1 rounded-lg text-center text-[#D8CFBF]"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#D9822B]" />
            <span className="text-[10px] font-semibold mt-1">Menu</span>
          </a>

          <a
            href={RESTAURANT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 rounded-lg text-center text-[#D8CFBF]"
          >
            <MapPin className="w-4 h-4 text-[#C85227]" />
            <span className="text-[10px] font-semibold mt-1">Directions</span>
          </a>

          <button
            onClick={() => {
              setConfirmedReservation(null);
              setIsReservationOpen(true);
            }}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-center text-[#D8CFBF]"
          >
            <Calendar className="w-4 h-4 text-[#D9822B]" />
            <span className="text-[10px] font-semibold mt-1">Reserve</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 rounded-lg bg-[#C85227] text-center text-white shadow"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold mt-1">
              Cart {cartCount > 0 && `(${cartCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* 15. DISH CUSTOMIZATION MODAL */}
      {activeDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E3DACD] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          >
            <div className="relative aspect-[16/9] bg-[#2A231E]">
              <img src={activeDish.image} alt={activeDish.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setActiveDish(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#171412]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white font-serif font-bold text-base shadow">
                ${activeDish.price}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1F1A17]">{activeDish.name}</h3>
                {activeDish.spanishName && (
                  <p className="text-xs text-[#8C7E72] italic mt-0.5">{activeDish.spanishName}</p>
                )}
                <p className="text-sm text-[#5A5046] mt-2 leading-relaxed">{activeDish.description}</p>
              </div>

              {activeDish.options && activeDish.options.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                    Select Your Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeDish.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                          selectedOption === opt
                            ? 'bg-[#171412] text-[#D9822B] border-[#171412] shadow-sm'
                            : 'bg-white text-[#382F28] border-[#DCD1C0] hover:border-[#C85227]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="E.g., extra salsa, dressing on side..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                />
              </div>

              <button
                onClick={() => handleAddToCartDirect(activeDish, selectedOption, specialInstructions)}
                className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Order • ${activeDish.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. ORDER CART & PICKUP DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl border-l border-[#E3DACD] flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E3DACD] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C85227]" />
                <h3 className="font-serif text-lg font-bold text-[#1F1A17]">Your Pickup Order</h3>
                <span className="bg-[#F3EDE2] text-[#C85227] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderCompleted(null);
                }}
                className="p-2 rounded-full hover:bg-[#F3EDE2] text-[#5A5046]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 overflow-y-auto flex-1">
              {orderCompleted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">Order Received!</h4>
                  <p className="text-sm text-[#5A5046]">
                    Thank you, <strong>{orderCompleted.name}</strong>. Your pickup order has been sent to the kitchen.
                  </p>
                  <div className="bg-[#F3EDE2] rounded-2xl p-5 text-left border border-[#E3DACD] space-y-3 font-serif text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-[#E3DACD]">
                      <span className="text-xs uppercase font-bold text-[#8C7E72]">Order ID</span>
                      <span className="font-mono font-bold text-base text-[#C85227]">
                        {orderCompleted.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Pickup Location:</span>
                      <strong className="text-[#1F1A17]">2617 E 7th St, Austin</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Estimated Ready Time:</span>
                      <strong className="text-emerald-700">25–35 Minutes</strong>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-[#E3DACD]">
                      <span>Total Amount:</span>
                      <strong className="text-[#C85227] text-sm">${orderCompleted.total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <a
                    href={`tel:${RESTAURANT_INFO.rawPhone}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2A231E] text-white text-xs font-semibold uppercase tracking-[0.08em]"
                  >
                    <Phone className="w-4 h-4 text-[#D9822B]" />
                    <span>Call Restaurant: {RESTAURANT_INFO.phone}</span>
                  </a>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 text-[#8C7E72]">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#DCD1C0]" />
                  <p className="font-serif text-lg font-bold text-[#1F1A17]">Your cart is empty</p>
                  <p className="text-xs text-[#8C7E72] mt-1">Explore the menu and add dishes to order pickup.</p>
                  <a
                    href="#menu"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#C85227] text-white text-xs font-semibold uppercase tracking-[0.08em]"
                  >
                    Browse Menu
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border border-[#E3DACD] flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-sm text-[#1F1A17]">{item.menuItem.name}</h4>
                          {item.selectedOption && (
                            <span className="text-[11px] text-[#C85227] block">{item.selectedOption}</span>
                          )}
                          {item.specialInstructions && (
                            <span className="text-[10px] text-[#8C7E72] italic block">
                              Note: {item.specialInstructions}
                            </span>
                          )}
                          <span className="font-serif font-bold text-xs text-[#1F1A17] mt-1 block">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-[#DCD1C0] rounded-lg overflow-hidden bg-[#FAF7F2]">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-[#E8DFC8] text-[#5A5046]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#1F1A17]">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-[#E8DFC8] text-[#5A5046]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Contact Form */}
                  <form id="pickup-form" onSubmit={handleCheckout} className="pt-4 border-t border-[#E3DACD] space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F1A17] block">
                      Pickup Contact Info
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5A5046] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Maria Hernandez"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5A5046] mb-1">Phone Number (for ready alert) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(512) 000-0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {!orderCompleted && cart.length > 0 && (
              <div className="p-5 bg-[#F3EDE2] border-t border-[#E3DACD] space-y-3">
                <div className="space-y-1.5 text-xs text-[#5A5046]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1F1A17]">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Texas Sales Tax (8.25%)</span>
                    <span>${cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1F1A17] pt-2 border-t border-[#E3DACD]">
                    <span>Total</span>
                    <span className="text-[#C85227] text-base">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="pickup-form"
                  className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Place Pickup Order • ${cartTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7E72]">
                  <Clock className="w-3 h-3 text-[#2E5A44]" />
                  <span>Estimated ready time: 25-35 minutes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 17. TABLE RESERVATION MODAL */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E3DACD] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          >
            <div className="bg-[#171412] text-white p-6 border-b border-[#2F2823] relative">
              <button
                onClick={() => setIsReservationOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#C85227]" />
                <span>Table Reservations</span>
              </div>

              <h3 className="font-serif text-2xl font-bold">Reserve Your Table</h3>
              <p className="text-xs text-[#B5A89C] mt-1">
                Join us for carnes asadas and margaritas on East 7th Street.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {confirmedReservation ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">Reservation Confirmed!</h4>
                  <p className="text-sm text-[#5A5046]">
                    We look forward to hosting you, <strong>{confirmedReservation.fullName}</strong>.
                  </p>

                  <div className="bg-[#F3EDE2] rounded-2xl p-6 text-left border border-[#E3DACD] space-y-3 font-serif text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-[#E3DACD]">
                      <span className="text-xs uppercase font-bold text-[#8C7E72]">Confirmation Code</span>
                      <span className="font-mono text-base font-bold text-[#C85227]">
                        {confirmedReservation.confirmationCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[#5A5046]">Date & Time:</span>
                      <span className="font-semibold text-[#1F1A17]">{confirmedReservation.date} at {confirmedReservation.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[#5A5046]">Party Size:</span>
                      <span className="font-semibold text-[#1F1A17]">{confirmedReservation.partySize} Guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[#5A5046]">Seating Area:</span>
                      <span className="font-semibold text-[#1F1A17] capitalize">{confirmedReservation.seatingPreference.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsReservationOpen(false)}
                    className="w-full py-3 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Guests</label>
                      <select
                        value={reservationForm.partySize}
                        onChange={(e) => setReservationForm({ ...reservationForm, partySize: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={reservationForm.date}
                        onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Time</label>
                      <select
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      >
                        {['11:30 AM', '12:00 PM', '1:00 PM', '2:30 PM', '5:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'].map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1.5">Seating Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rustic-patio', label: 'Covered Patio' },
                        { id: 'main-dining', label: 'Main Dining' },
                        { id: 'cantina-bar', label: 'Cantina High Top' },
                      ].map((area) => (
                        <button
                          type="button"
                          key={area.id}
                          onClick={() => setReservationForm({ ...reservationForm, seatingPreference: area.id as any })}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            reservationForm.seatingPreference === area.id
                              ? 'bg-[#171412] text-[#D9822B] border-[#171412]'
                              : 'bg-white text-[#382F28] border-[#DCD1C0]'
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={reservationForm.fullName}
                        onChange={(e) => setReservationForm({ ...reservationForm, fullName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(512) 000-0000"
                        value={reservationForm.phone}
                        onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md transition-all"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 18. CATERING INQUIRY MODAL */}
      {isCateringOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E3DACD] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          >
            <div className="bg-[#171412] text-white p-6 border-b border-[#2F2823] relative">
              <button
                onClick={() => setIsCateringOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85227]/20 border border-[#C85227]/40 text-[#D9822B] text-xs font-semibold uppercase tracking-wider mb-2">
                <PartyPopper className="w-3.5 h-3.5 text-[#C85227]" />
                <span>Parrillada Catering & Events</span>
              </div>
              <h3 className="font-serif text-2xl font-bold">Bring the Mesquite Fire to Your Event</h3>
              <p className="text-xs text-[#B5A89C] mt-1">
                Backyard barbecue feasts, weddings, corporate events & patio buyouts.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {cateringSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 border border-[#2E5A44]/30 flex items-center justify-center mx-auto text-[#2E5A44]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F1A17]">Inquiry Received!</h4>
                  <p className="text-sm text-[#5A5046]">
                    Thank you, <strong>{cateringForm.fullName}</strong>. Our catering coordinator will contact you at <strong>{cateringForm.phone}</strong> with custom menu proposals and pricing.
                  </p>
                  <button
                    onClick={() => setIsCateringOpen(false)}
                    className="w-full max-w-xs mx-auto py-3 rounded-xl bg-[#C85227] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md block mt-4"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCateringSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Event Type</label>
                      <select
                        value={cateringForm.eventType}
                        onChange={(e) => setCateringForm({ ...cateringForm, eventType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      >
                        <option value="Backyard Parrillada Fiesta">Backyard Parrillada Fiesta</option>
                        <option value="Corporate Gathering / Lunch">Corporate Gathering / Lunch</option>
                        <option value="Wedding / Rehearsal Dinner">Wedding / Rehearsal Dinner</option>
                        <option value="Patio Buyout at El Asador">Patio Buyout at El Asador</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Estimated Guests</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        required
                        value={cateringForm.guestCount}
                        onChange={(e) => setCateringForm({ ...cateringForm, guestCount: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={cateringForm.fullName}
                        onChange={(e) => setCateringForm({ ...cateringForm, fullName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(512) 000-0000"
                        value={cateringForm.phone}
                        onChange={(e) => setCateringForm({ ...cateringForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={cateringForm.email}
                      onChange={(e) => setCateringForm({ ...cateringForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-1">Event Details & Requests</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your event: carnes asadas, taco bar, margarita setup..."
                      value={cateringForm.notes}
                      onChange={(e) => setCateringForm({ ...cateringForm, notes: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-xs uppercase tracking-[0.08em] shadow-md transition-all"
                  >
                    Send Catering Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 19. LIGHTBOX GALLERY MODAL */}
      {activeGalleryIndex !== null && (
        <div
          onClick={() => setActiveGalleryIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              onClick={() => setActiveGalleryIndex(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#D9822B] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={GALLERY_ITEMS[activeGalleryIndex].image}
              alt={GALLERY_ITEMS[activeGalleryIndex].title}
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-center">
              <h4 className="font-serif text-xl font-bold text-white">
                {GALLERY_ITEMS[activeGalleryIndex].title}
              </h4>
              <p className="text-xs text-[#D8CFBF] mt-1">{GALLERY_ITEMS[activeGalleryIndex].subtitle}</p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) =>
                    prev === 0 ? GALLERY_ITEMS.length - 1 : (prev as number) - 1
                  )
                }
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-[#8C7E72]">
                {activeGalleryIndex + 1} / {GALLERY_ITEMS.length}
              </span>
              <button
                onClick={() =>
                  setActiveGalleryIndex((prev) =>
                    prev === GALLERY_ITEMS.length - 1 ? 0 : (prev as number) + 1
                  )
                }
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#171412] text-white border border-[#3A3029] px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C85227]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
