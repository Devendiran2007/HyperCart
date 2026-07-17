import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Sun, Clock, Sparkles, Navigation, Store as StoreIcon } from 'lucide-react';
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

  const aiRecommendations = PRODUCTS.filter(p => p.rating >= 4.8).slice(0, 4);

  return (
    <div className="pb-32 pt-6 px-4 max-w-5xl mx-auto space-y-8">
      {/* Good Morning / Location Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <span className="text-textSecondary text-xs uppercase tracking-widest block font-medium">Hyperlocal Hub</span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Good Morning, Devendiran
            <Sun className="w-5 h-5 text-warning animate-pulse" />
          </h1>
          <div className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer hover:text-slate-800 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>100 Infinity Loop, Cupertino</span>
          </div>
        </div>

        {/* Quick ETA pill */}
        <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] text-textSecondary uppercase block">Average ETA</span>
            <span className="text-xs font-bold text-slate-800">18-25 Mins</span>
          </div>
        </div>
      </motion.div>

      {/* Floating/Sticky Search and Map Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search stores, sourdough, fresh apples..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-black/[0.04] rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-primary transition-all shadow-lg"
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

      {/* Interactive Map Radar section */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <InteractiveMap onSelectStore={onSelectStore} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Category Pills */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Explore Categories</h3>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 select-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-md'
                : 'glass-panel text-textSecondary hover:text-slate-800'
            }`}
          >
            All Items
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

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI Tailored Recommendations
          </h3>
          <span className="text-[10px] text-secondary uppercase font-semibold">Updated Realtime</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aiRecommendations.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </motion.div>

      {/* Featured Stores */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <StoreIcon className="w-4 h-4 text-primary" />
          Featured Nearby Stores
        </h3>
        {filteredStores.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-3xl">
            <p className="text-sm text-textSecondary">No stores found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredStores.map((store) => (
              <motion.div
                key={store.id}
                whileHover={{ y: -4 }}
                onClick={() => onSelectStore(store.id)}
                className="glass-panel rounded-3xl overflow-hidden cursor-pointer shadow-lg group relative flex flex-col justify-between"
              >
                {/* Store Cover Frame */}
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={store.coverUrl}
                    alt={store.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35" />
                  
                  {/* Rating / Distance Floating Badge */}
                  <div className="absolute bottom-3 left-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-lg text-white">
                      ★ {store.rating}
                    </span>
                    <span className="bg-primary/95 text-xs font-bold px-2.5 py-1 rounded-lg text-white">
                      {store.distanceKm} km
                    </span>
                  </div>
                </div>

                {/* Store Info */}
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
