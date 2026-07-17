import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Ticket, CreditCard, ChevronRight } from 'lucide-react';
import { type Product } from '../data/mockData';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'HYPER50') {
      setDiscountPercent(15);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon. Try HYPER50 for 15% off.');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal > 20 ? 0.00 : 3.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#0A0F1C] border-l border-white/5 flex flex-col justify-between shadow-2xl relative"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Shopping Bag
                    <span className="text-xs px-2 py-0.5 bg-primary/15 text-primary rounded-full">
                      {cartItems.length} items
                    </span>
                  </h2>
                  <p className="text-xs text-textSecondary mt-0.5">Cupertino Super-fast Delivery</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 text-white rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                      🛍️
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Your bag is empty</h3>
                      <p className="text-xs text-textSecondary mt-1">
                        Add items from nearby orchards or bakeries to begin checkout.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Browse Stores
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Wallet-style overlapping items layout */}
                    {cartItems.map((item, idx) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 relative group"
                        style={{
                          transform: `translateY(-${idx * 4}px)`,
                          zIndex: 10 + idx
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/5 bg-surface"
                          />
                          <div>
                            <h4 className="font-semibold text-xs text-white line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] text-textSecondary">
                              ${item.product.price.toFixed(2)} each
                            </span>
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 mt-2 bg-white/5 border border-white/5 rounded-lg p-0.5 w-fit">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/5 text-white/70 rounded cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/5 text-white/70 rounded cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className="text-xs font-bold text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1.5 hover:bg-danger/10 text-textSecondary hover:text-danger rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer summary and totals */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-[#080D1A] space-y-4">
                  {/* Coupon Area */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-2.5 w-4 h-4 text-textSecondary" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. HYPER50)"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {couponApplied && (
                    <div className="text-[11px] text-success font-semibold px-1">
                      ✓ Coupon Applied: 15% discount
                    </div>
                  )}

                  {/* Summary Breakdowns */}
                  <div className="space-y-1.5 text-xs text-textSecondary">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Delivery Fee</span>
                      <span className="text-white">
                        {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales Tax (8%)</span>
                      <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/5 my-2" />
                    <div className="flex justify-between text-sm font-bold text-white">
                      <span>Grand Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={onCheckout}
                    className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
