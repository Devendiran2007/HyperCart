import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Info, ShoppingBag } from 'lucide-react';
import { type Store, STORES } from '../data/mockData';

interface InteractiveMapProps {
  onSelectStore: (storeId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectStore }) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Simulated coordinate positions on a 1000x600 canvas coordinate grid
  // User is at (500, 300)
  const mapWidth = 1000;
  const mapHeight = 500;

  const getStoreCoords = (storeId: string) => {
    switch (storeId) {
      case 'store-1': return { x: 420, y: 210 }; // Organic Oasis
      case 'store-2': return { x: 620, y: 160 }; // Boulangerie
      case 'store-3': return { x: 330, y: 380 }; // Neptunes Sea
      case 'store-4': return { x: 550, y: 390 }; // Dairy Queen
      case 'store-5': return { x: 260, y: 190 }; // Gourmet Glazes
      case 'store-6': return { x: 740, y: 280 }; // Greenery Juices
      case 'store-7': return { x: 480, y: 130 }; // Threads Boutique
      case 'store-8': return { x: 700, y: 380 }; // Nordic Furniture
      default: return { x: 500, y: 300 };
    }
  };

  return (
    <div className="relative w-full h-[360px] md:h-[450px] rounded-3xl overflow-hidden border border-white/10 bg-[#0A0F1C] shadow-2xl">
      {/* HUD Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="glass-panel px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 text-primary">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          Hyperlocal Radar Active
        </div>
      </div>

      {/* Vector SVG Map Container */}
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full select-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, #0E1629 0%, #070B14 100%)' }}
      >
        {/* Radar Rings Grid */}
        <circle cx="500" cy="250" r="100" fill="none" stroke="rgba(79, 124, 255, 0.05)" strokeWidth="1" />
        <circle cx="500" cy="250" r="220" fill="none" stroke="rgba(79, 124, 255, 0.03)" strokeWidth="1.5" />
        <circle cx="500" cy="250" r="350" fill="none" stroke="rgba(79, 124, 255, 0.02)" strokeWidth="2" strokeDasharray="5,5" />

        {/* Radar Sweeper Line */}
        <motion.line
          x1="500"
          y1="250"
          x2="500"
          y2="-100"
          stroke="url(#radarSweepGrad)"
          strokeWidth="3"
          style={{ originX: '500px', originY: '250px' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        />

        {/* Linear Gradients Definition */}
        <defs>
          <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 124, 255, 0)" />
            <stop offset="80%" stopColor="rgba(79, 124, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(79, 124, 255, 0.7)" />
          </linearGradient>
          <radialGradient id="userGlowGrad">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
        </defs>

        {/* Simulated Streets (High tech glow lines) */}
        <path d="M 100 250 L 900 250" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
        <path d="M 500 50 L 500 450" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
        <path d="M 250 100 L 750 400" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
        <path d="M 200 400 L 800 100" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />

        {/* User Delivery Radius Rings and User Node */}
        <circle cx="500" cy="250" r="160" fill="rgba(139, 92, 246, 0.02)" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx="500" cy="250" r="40" fill="url(#userGlowGrad)" />
        <circle cx="500" cy="250" r="6" fill="#8B5CF6" stroke="#ffffff" strokeWidth="2.5" />

        {/* Pulsing Vendor Nodes & Radius Coverages */}
        {STORES.map((store) => {
          const coords = getStoreCoords(store.id);
          const isSelected = selectedStore?.id === store.id;

          return (
            <g key={store.id} className="cursor-pointer" onClick={() => setSelectedStore(store)}>
              {/* Vendor Delivery Range Circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={store.deliveryRadiusKm * 32}
                fill="none"
                stroke={isSelected ? 'rgba(79, 124, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={isSelected ? 1.5 : 1}
                strokeDasharray="6,4"
                className="transition-colors duration-300"
              />

              {/* Pulsing Glow */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="18"
                fill="rgba(79, 124, 255, 0.15)"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />

              {/* Pin Center */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? 10 : 8}
                fill={store.isOpen ? '#4F7CFF' : '#475569'}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="transition-all duration-300 hover:scale-125"
              />
            </g>
          );
        })}
      </svg>

      {/* Selected Store Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="absolute bottom-4 left-4 right-4 z-20 glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <img
                src={selectedStore.logoUrl}
                alt={selectedStore.storeName}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  {selectedStore.storeName}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    selectedStore.isOpen ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                  }`}>
                    {selectedStore.isOpen ? 'Open' : 'Closed'}
                  </span>
                </h4>
                <p className="text-xs text-textSecondary line-clamp-1">{selectedStore.address}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-textSecondary">
                  <span className="flex items-center gap-1 text-primary">
                    <Navigation className="w-3 h-3" /> {selectedStore.distanceKm} km away
                  </span>
                  <span>•</span>
                  <span>Est. {selectedStore.estimatedDeliveryTimeMinutes} mins</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedStore(null)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => onSelectStore(selectedStore.id)}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Visit Store
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setSelectedStore(null)}
          className="p-2 glass-panel hover:bg-white/10 rounded-xl text-white cursor-pointer active:scale-95 transition-transform"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default InteractiveMap;
