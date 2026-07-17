import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Navigation, Star } from 'lucide-react';
import { type Store as StoreType, type Product, PRODUCTS, CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

interface StoreProps {
  store: StoreType;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const Store: React.FC<StoreProps> = ({
  store,
  onBack,
  onAddToCart,
  onQuickView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products by vendor and optional category
  const storeProducts = PRODUCTS.filter((p) => {
    const isVendorProduct = p.vendorId === store.id;
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    return isVendorProduct && matchesCategory;
  });

  // Unique categories of products available in this store
  const storeProductCategoryIds = Array.from(
    new Set(PRODUCTS.filter(p => p.vendorId === store.id).map(p => p.categoryId))
  );

  const storeCategories = CATEGORIES.filter(cat => storeProductCategoryIds.includes(cat.id));

  return (
    <div className="pb-32">
      {/* Store Cover Banner Section */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden bg-surface">
        <img
          src={store.coverUrl}
          alt={store.storeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35" />

        {/* Float Controls */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={onBack}
            className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md transition-all active:scale-90 flex items-center gap-1.5 cursor-pointer shadow-lg font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Stores</span>
          </button>
        </div>
      </div>

      {/* Store Details Box */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
            <img
              src={store.logoUrl}
              alt={store.storeName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-background shadow-md"
            />
            <div className="space-y-1.5">
              <h1 className="text-xl md:text-2xl font-black text-white leading-tight flex items-center justify-center md:justify-start gap-2">
                {store.storeName}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  store.isOpen ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                }`}>
                  {store.isOpen ? 'Open' : 'Closed'}
                </span>
              </h1>
              <p className="text-xs text-textSecondary">{store.description}</p>
              <p className="text-[11px] text-textSecondary flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {store.address}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">Rating</span>
              <div className="flex items-center gap-1 justify-center text-warning">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-white">{store.rating}</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">ETA</span>
              <div className="flex items-center gap-1 justify-center text-primary">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold text-white">{store.estimatedDeliveryTimeMinutes}m</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-textSecondary uppercase tracking-widest block mb-0.5">Distance</span>
              <div className="flex items-center gap-1 justify-center text-secondary">
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-bold text-white">{store.distanceKm}km</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category filtering section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 select-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-white shadow-md'
                  : 'glass-panel text-textSecondary hover:text-white'
              }`}
            >
              All Products
            </button>
            {storeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'glass-panel text-textSecondary hover:text-white'
                }`}
              >
                <span>{cat.imageUrl}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {storeProducts.length === 0 ? (
              <div className="col-span-full glass-panel p-10 text-center rounded-3xl">
                <p className="text-sm text-textSecondary">No products found in this category.</p>
              </div>
            ) : (
              storeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Store;
