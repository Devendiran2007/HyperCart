import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, ShieldAlert } from 'lucide-react';
import { type Product } from '../data/mockData';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transform: 'scale(1)', transformOrigin: '0% 0%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      display: 'none',
      transform: 'scale(1)',
      transformOrigin: '0% 0%'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto"
        >
          {/* Close button floating */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-transform active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image gallery */}
          <div className="p-6 flex flex-col gap-4 border-r border-white/5 bg-surface/30">
            {/* Zoomable main frame */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden cursor-crosshair border border-white/5 bg-surface"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={{
                  transform: zoomStyle.transform,
                  transformOrigin: zoomStyle.transformOrigin
                }}
              />
            </div>

            {/* Gallery thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-colors ${
                      activeImage === url ? 'border-primary' : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information details */}
          <div className="p-8 flex flex-col justify-between overflow-y-auto bg-surface/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Verified Local
                </span>
                {product.stock <= 5 && (
                  <span className="text-[10px] uppercase font-bold tracking-widest text-warning bg-warning/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Low Stock
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-bold mt-3 text-white leading-tight">
                {product.name}
              </h2>

              {/* Rating and price */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-warning gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold text-white">{product.rating}</span>
                </div>
                <span className="text-white/20">|</span>
                <span className="text-xs text-textSecondary">{product.stock} units available</span>
              </div>

              <div className="text-2xl font-black text-white mt-4">
                ${product.price.toFixed(2)}
              </div>

              <div className="w-full h-[1px] bg-white/5 my-5" />

              <p className="text-sm text-textSecondary leading-relaxed">
                {product.description}
              </p>

              {/* AI Recommendation insights */}
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5">
                <h5 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  AI Companion Recommendation
                </h5>
                <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                  "Perfect choice! Customers who bought this often pair it with our freshly baked croissants or organic valley milk."
                </p>
              </div>
            </div>

            {/* Quick Buy CTA */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  product.stock === 0
                    ? 'bg-white/5 text-white/25 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/95 text-white shadow-lg'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Shopping Bag
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ProductDetailsModal;
