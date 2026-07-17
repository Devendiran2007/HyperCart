import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Eye, AlertTriangle } from 'lucide-react';
import { type Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Stock status checks
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="glass-panel rounded-3xl overflow-hidden shadow-lg group relative flex flex-col justify-between"
    >
      {/* Product Image section with Zoom Hover */}
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-surface" onClick={() => onQuickView(product)}>
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover origin-center transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Floating overlays: Favorite & Quick View */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md transition-all active:scale-90 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all active:scale-75 cursor-pointer ${
              isFavorite ? 'bg-danger/25 text-danger' : 'bg-black/60 hover:bg-black/80 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Low Stock Warning Banner */}
        {isLowStock && (
          <div className="absolute bottom-3 left-3 bg-warning/90 backdrop-blur-md text-black text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Only {product.stock} left
          </div>
        )}

        {/* Out Of Stock Banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-danger/25 text-danger text-xs font-bold px-3 py-1.5 rounded-xl border border-danger/30">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => onQuickView(product)}>
            {product.name}
          </h4>
          <p className="text-xs text-textSecondary line-clamp-2 mt-1 min-h-[32px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-[10px] text-textSecondary uppercase tracking-widest block">Price</span>
            <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`p-3 rounded-2xl shadow-md flex items-center justify-center transition-all ${
              isOutOfStock 
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white cursor-pointer active:scale-95'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
