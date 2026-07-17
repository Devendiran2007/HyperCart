import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Sun, Clock, Navigation, Store as StoreIcon, ArrowRight, Percent, Shirt, Sofa, Apple, Croissant } from 'lucide-react';
import { CATEGORIES, STORES, PRODUCTS, type Product } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { InteractiveMap } from '../components/InteractiveMap';

interface HomeProps {
  onSelectStore: (storeId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({
  onSelectStore,
  onAddToCart,
  onQuickView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Filter stores based on search query or category
  const filteredStores = STORES.filter((store) => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasCategoryProducts = !selectedCategory || 
      PRODUCTS.some(p => p.vendorId === store.id && p.categoryId === selectedCategory);

    return matchesSearch && hasCategoryProducts;
  });

  // Categorize products into Amazon-style shelves
  const dailyDeals = PRODUCTS.filter(p => p.price < 10).slice(0, 4);
  const fashionProducts = PRODUCTS.filter(p => p.categoryId === 'cat-7');
  const furnitureProducts = PRODUCTS.filter(p => p.categoryId === 'cat-8');
  const freshGroceries = PRODUCTS.filter(p => p.categoryId === 'cat-1' || p.categoryId === 'cat-3');
  const bakeryTreats = PRODUCTS.filter(p => p.categoryId === 'cat-2' || p.categoryId === 'cat-5');

  return (
    <div className="pb-32 pt-6 px-4 md:px-8 lg:px-12 w-full max-w-none space-y-10">
      
      {/* 1. Good Morning / Location Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <span className="text-textSecondary text-xs uppercase tracking-widest block font-bold">Hyperlocal Distribution</span>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            Good Morning, Devendiran
            <Sun className="w-6 h-6 text-warning animate-pulse" />
          </h1>
          <div className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer hover:text-slate-800 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span>100 Infinity Loop, Cupertino • Delivering to Cupertino Hub</span>
          </div>
        </div>

        {/* Quick ETA pill */}
        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <span className="text-[10px] text-textSecondary uppercase block font-bold">Average ETA</span>
            <span className="text-sm font-bold text-slate-800">18-25 Mins</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Apple-Style Premium Promos Carousel Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="w-full glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-lg border border-black/[0.04] bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent"
      >
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Cupertino Prime Delivery
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">
            Handcrafted Linen Shirts & Oak Work Desks, Delivered in Minutes.
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Experience hyperlocal shopping. Order fresh organic cherries, boutique fashion, or Scandinavian loft desks from local workshops.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setShowMap(true)}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              Open Radar Radar
            </button>
            <span className="text-xs font-bold text-slate-700">Explore 8 Local Merchants</span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_70%_70%,rgba(0,113,227,0.08),transparent_70%)] hidden md:block" />
      </motion.div>

      {/* 3. Search and Map Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 w-full"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search our vast catalog (linen shirts, desks, whole milk, sourdough batards...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-surface border border-black/[0.04] rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-primary transition-all shadow-lg"
          />
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className={`p-3.5 rounded-2xl border transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
            showMap
              ? 'bg-primary/20 border-primary text-primary font-semibold'
              : 'bg-surface border-black/[0.04] text-textSecondary hover:text-slate-800'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs hidden md:inline">Radar Map</span>
        </button>
      </motion.div>

      {/* 4. Map Radar section */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden w-full"
          >
            <InteractiveMap onSelectStore={onSelectStore} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Animated Category Pills */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Browse Departments</h3>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 select-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-md'
                : 'glass-panel text-textSecondary hover:text-slate-800'
            }`}
          >
            All Departments
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'glass-panel text-textSecondary hover:text-slate-800'
              }`}
            >
              <span>{cat.imageUrl}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Dynamic Catalog Content shelves */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          // Full Amazon Home page layout shelves
          <motion.div
            key="home-shelves"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Shelf A: Today's Lightning Deals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Percent className="w-4 h-4 text-warning" />
                  Today's Lightning Deals
                </h3>
                <span className="text-[10px] text-warning font-black uppercase tracking-wider">Ends in 04h 12m</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dailyDeals.map(prod => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            </div>

            {/* Shelf B: Best Sellers in Fashion & Wear */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-primary" />
                  Best Sellers in Fashion & Apparel
                </h3>
                <span className="text-[10px] text-primary font-bold flex items-center gap-1 cursor-pointer hover:underline">
                  See more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fashionProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            </div>

            {/* Shelf C: Modern Home & Scandinavian Furniture */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Sofa className="w-4 h-4 text-secondary" />
                  Home Makeover & Scandinavian Furniture
                </h3>
                <span className="text-[10px] text-secondary font-bold flex items-center gap-1 cursor-pointer hover:underline">
                  Browse Loft <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {furnitureProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            </div>

            {/* Shelf D: Farm Fresh Produce & Organic Dairy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Apple className="w-4 h-4 text-success" />
                  Fresh Produce & Organic Dairy
                </h3>
                <span className="text-[10px] text-success font-bold flex items-center gap-1 cursor-pointer hover:underline">
                  Visit Farm <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {freshGroceries.map(prod => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            </div>

            {/* Shelf E: Gourmet Bakeries & Sweet Treats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Croissant className="w-4 h-4 text-orange-500" />
                  Gourmet Bakeries & Sweet Treats
                </h3>
                <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                  See bakery <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {bakeryTreats.map(prod => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Filtered list of products when category selected
          <motion.div
            key="category-products"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="border-b border-black/[0.04] pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                Filtered Category Results
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => p.categoryId === selectedCategory).map(prod => (
                <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Nearby Stores List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-primary" />
            Featured Local Merchants
          </h3>
        </div>

        {filteredStores.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-3xl">
            <p className="text-sm text-textSecondary">No stores found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <motion.div
                key={store.id}
                whileHover={{ y: -4 }}
                onClick={() => onSelectStore(store.id)}
                className="glass-panel rounded-3xl overflow-hidden cursor-pointer shadow-lg group relative flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={store.coverUrl}
                    alt={store.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35" />
                  
                  <div className="absolute bottom-3 left-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-lg text-white">
                      ★ {store.rating}
                    </span>
                    <span className="bg-primary/95 text-xs font-bold px-2.5 py-1 rounded-lg text-white">
                      {store.distanceKm} km
                    </span>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <img
                    src={store.logoUrl}
                    alt={store.storeName}
                    className="w-12 h-12 rounded-xl object-cover border border-black/[0.04]"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
                      {store.storeName}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        store.isOpen ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                      }`}>
                        {store.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </h4>
                    <p className="text-xs text-textSecondary line-clamp-1">{store.description}</p>
                    <p className="text-[10px] text-textSecondary">{store.address}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default Home;
