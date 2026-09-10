import React, { useState, useMemo } from 'react';
import { MenuItem, MenuCategory, DietaryTag } from '../types';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/restaurantData';
import { Search, Plus, Sparkles, Check, SlidersHorizontal, Info } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedOption?: string, specialInstructions?: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<DietaryTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization modal state for items with options
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Tag match
      const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);

      // Search match
      const matchesSearch = 
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.spanishName && item.spanishName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const handleItemClick = (item: MenuItem) => {
    if (item.options && item.options.length > 0) {
      setActiveItemForCustomization(item);
      setSelectedOption(item.options[0]);
      setSpecialInstructions('');
    } else {
      onAddToCart(item);
      showAddedToast(item.name);
    }
  };

  const handleConfirmCustomization = () => {
    if (activeItemForCustomization) {
      onAddToCart(activeItemForCustomization, selectedOption, specialInstructions);
      showAddedToast(activeItemForCustomization.name);
      setActiveItemForCustomization(null);
    }
  };

  const showAddedToast = (name: string) => {
    setAddedNotification(`Added ${name} to order`);
    setTimeout(() => {
      setAddedNotification(null);
    }, 2500);
  };

  const dietaryFilterOptions: { tag: DietaryTag | 'all'; label: string }[] = [
    { tag: 'all', label: 'All Dishes' },
    { tag: 'chef-special', label: "Chef's Specials" },
    { tag: 'gluten-free', label: 'Gluten-Free' },
    { tag: 'spicy', label: 'Spicy' },
    { tag: 'vegetarian', label: 'Vegetarian' },
  ];

  return (
    <section id="menu" className="py-20 sm:py-24 bg-[#FAF7F2] relative">
      {/* Toast Notification */}
      {addedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171412] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#C85227] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-6 h-6 rounded-full bg-[#2E5A44] flex items-center justify-center text-xs">
            <Check className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-sm font-medium">{addedNotification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#E3DACD] text-[#C85227] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Authentic Menu • Austin TX</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
            Our Food & Cantina Menu
          </h2>
          <p className="text-[#6E645A] text-base sm:text-lg mt-3 leading-relaxed">
            From live-fire parrilladas to hand-squeezed agave margaritas. Prepared fresh to order with house-simmered charro beans and hot heirloom tortillas.
          </p>
        </div>

        {/* Search & Dietary Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#F3EDE2] p-3 sm:p-4 rounded-2xl border border-[#E3DACD]">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, tacos, margaritas..."
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

          {/* Dietary Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {dietaryFilterOptions.map((opt) => (
              <button
                key={opt.tag}
                onClick={() => setSelectedTag(opt.tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E3DACD] scrollbar-none">
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

        {/* Category Description Banner if single category chosen */}
        {selectedCategory !== 'all' && (
          <div className="mb-8 p-4 rounded-xl bg-[#F3EDE2] border-l-4 border-[#C85227] text-[#4A4036] text-sm flex items-center justify-between">
            <p>
              {MENU_CATEGORIES.find(c => c.id === selectedCategory)?.description}
            </p>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#F3EDE2] rounded-2xl border border-[#E3DACD]">
            <Info className="w-8 h-8 text-[#8C7E72] mx-auto mb-2" />
            <p className="font-serif text-lg font-bold text-[#1F1A17]">No items found</p>
            <p className="text-sm text-[#6E645A] mt-1">Try changing your search or dietary filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#C85227] text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E3DACD] hover:border-[#C85227]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#2A231E]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-[#171412]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-serif font-bold text-sm shadow">
                      ${item.price}
                    </div>

                    {/* Dietary Badges */}
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
                        <span className="inline-flex items-center gap-0.5 bg-[#8C2318] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          
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

                  {/* Body Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1F1A17] group-hover:text-[#C85227] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        {item.spanishName && (
                          <p className="text-xs text-[#8C7E72] italic mt-0.5">
                            {item.spanishName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-[#5A5046] mt-3 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {item.options && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8C7E72]">
                        <SlidersHorizontal className="w-3 h-3 text-[#C85227]" />
                        <span>Options available: {item.options.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-2 border-t border-[#F3EDE2] flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-[#8C7E72]">
                    {item.category === 'asador' ? 'Beans & Tortillas Included' : 'Fresh Prepared'}
                  </span>

                  <button
                    onClick={() => handleItemClick(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85227] hover:bg-[#A8401C] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{item.options ? 'Customize & Add' : 'Add to Order'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dietary Transparency Notice */}
        <div className="mt-14 p-6 rounded-2xl bg-[#F3EDE2] border border-[#E3DACD] text-xs text-[#6E645A] leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            * <strong className="text-[#1F1A17]">Dietary & Allergy Notice:</strong> Please inform our staff of any allergies or dietary restrictions. Many of our grilled items can be prepared gluten-free. Free homemade charro beans and handmade tortillas are included with all grill entrées.
          </p>
          <a
            href="#location"
            className="shrink-0 text-xs font-bold text-[#C85227] hover:underline"
          >
            Questions? Call (512) 645-1237
          </a>
        </div>

      </div>

      {/* Item Customization Modal */}
      {activeItemForCustomization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E3DACD] animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C85227] font-semibold">Customize Order</span>
                <h3 className="font-serif text-xl font-bold text-[#1F1A17] mt-0.5">
                  {activeItemForCustomization.name}
                </h3>
                <span className="text-sm font-serif font-bold text-[#C85227]">
                  ${activeItemForCustomization.price}
                </span>
              </div>
              <button
                onClick={() => setActiveItemForCustomization(null)}
                className="text-[#8C7E72] hover:text-[#1F1A17] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Option Choices */}
            {activeItemForCustomization.options && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                  Select Your Preference:
                </label>
                <div className="space-y-2">
                  {activeItemForCustomization.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                        selectedOption === option
                          ? 'border-[#C85227] bg-[#F3EDE2] font-semibold text-[#C85227]'
                          : 'border-[#E3DACD] bg-white text-[#4A4036] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="item-option"
                          checked={selectedOption === option}
                          onChange={() => setSelectedOption(option)}
                          className="accent-[#C85227]"
                        />
                        {option}
                      </span>
                      {selectedOption === option && <Check className="w-4 h-4 text-[#C85227]" />}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#1F1A17] uppercase tracking-wider mb-2">
                Special Requests / Notes:
              </label>
              <textarea
                rows={2}
                placeholder="E.g., Extra spicy salsa on the side, no cilantro, extra lime..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#DCD1C0] text-sm text-[#1F1A17] focus:outline-none focus:border-[#C85227]"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveItemForCustomization(null)}
                className="w-1/2 py-2.5 rounded-xl border border-[#DCD1C0] text-[#5A5046] font-semibold text-sm hover:bg-[#F3EDE2]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCustomization}
                className="w-1/2 py-2.5 rounded-xl bg-[#C85227] hover:bg-[#A8401C] text-white font-semibold text-sm shadow-md"
              >
                Add to Cart • ${activeItemForCustomization.price}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
