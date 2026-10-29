import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Check, 
  SlidersHorizontal, 
  AlertCircle,
  Soup,
  Cookie,
  Coffee,
  IceCream,
  SunMedium,
  Utensils
} from 'lucide-react';
import { Category, MenuItem, CartItem, DietaryType } from '../types';

interface MenuSectionProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  searchQuery: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  menuItems,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  searchQuery,
}) => {
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'Veg' | 'Vegan' | 'High-Protein'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'prep_time'>('popular');
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
      return false;
    }
    // Search query match
    if (
      searchQuery.trim() &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Dietary filter
    if (dietaryFilter !== 'all') {
      if (!item.dietary_labels.includes(dietaryFilter as DietaryType)) {
        return false;
      }
    }
    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'price_asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price_desc') {
      return b.price - a.price;
    }
    if (sortBy === 'prep_time') {
      return a.preparation_time_minutes - b.preparation_time_minutes;
    }
    return 0;
  });

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'meals':
        return <Soup className="w-4 h-4" />;
      case 'snacks':
        return <Cookie className="w-4 h-4" />;
      case 'beverages':
        return <Coffee className="w-4 h-4" />;
      case 'desserts':
        return <IceCream className="w-4 h-4" />;
      case 'breakfast':
        return <SunMedium className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar (Segmented Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-800 text-white shadow-sm shadow-amber-950/20'
                  : 'bg-white text-slate-700 hover:bg-amber-50/70 border border-amber-900/10'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-amber-900/10 shadow-xs">
        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Diet:
          </span>
          {(['all', 'Veg', 'Vegan', 'High-Protein'] as const).map((diet) => (
            <button
              key={diet}
              onClick={() => setDietaryFilter(diet)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                dietaryFilter === diet
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {diet === 'all' ? 'All Diets' : diet}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <label htmlFor="sort-select" className="text-xs text-slate-500">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-amber-50/60 border border-amber-900/15 text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="prep_time">Fastest Preparation</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Item Counter / Filter Feedback */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-semibold text-slate-800">{sortedItems.length}</span> canteen items
          {searchQuery && (
            <span>
              {' '}
              matching &ldquo;<span className="text-amber-800 font-medium">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>
        <div className="hidden sm:block">
          Orders prepared fresh on student token call
        </div>
      </div>

      {/* Menu Grid */}
      {sortedItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-amber-900/10">
          <AlertCircle className="w-10 h-10 text-amber-600/70 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No matching items found</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
            Try adjusting your search keywords, category, or dietary filters to view available kitchen items.
          </p>
          <button
            onClick={() => {
              setDietaryFilter('all');
              onSelectCategory('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => {
            const cartItem = cartItems.find((ci) => ci.menuItem.id === item.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            const isSoldOut = !item.is_available || item.stock_quantity <= 0;
            const hasImageError = imageErrorMap[item.id];

            return (
              <div
                key={item.id}
                className={`flex flex-col bg-white rounded-2xl border border-amber-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  isSoldOut ? 'opacity-70 grayscale-[20%]' : ''
                }`}
              >
                {/* Product Image Slot with Fallback */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {!hasImageError ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 p-4 text-center">
                      <Soup className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                  )}

                  {/* Dietary Marker (Top Left) */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
                    {item.dietary_labels.includes('Veg') ? (
                      <span className="flex items-center gap-1 text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Veg
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-800">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        Non-Veg
                      </span>
                    )}
                  </div>

                  {/* Prep Time & Counter Marker (Top Right) */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>~{item.preparation_time_minutes}m</span>
                  </div>

                  {/* Sold Out Overlay */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">
                        Sold Out for Today
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span>Counter {item.counter_number}</span>
                      <span aria-hidden="true">·</span>
                      {item.calories && (
                        <>
                          <span className="font-mono tabular-nums">{item.calories} kcal</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span>{item.dietary_labels.join(', ')}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price and Cart Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Price</span>
                      <div className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                        ₹{item.price.toFixed(0)}
                      </div>
                    </div>

                    <div>
                      {isSoldOut ? (
                        <span className="text-xs text-slate-400 font-medium italic">
                          Unavailable
                        </span>
                      ) : quantityInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-amber-900 flex items-center justify-center hover:bg-amber-100 shadow-2xs transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono tabular-nums text-amber-950">
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-amber-700 text-white flex items-center justify-center hover:bg-amber-800 shadow-2xs transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Tray</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
