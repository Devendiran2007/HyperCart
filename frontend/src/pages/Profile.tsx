import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Heart, Box, CheckCircle, Truck, Package, LogOut } from 'lucide-react';
import { MOCK_ORDERS, PRODUCTS } from '../data/mockData';

interface ProfileProps {
  onSignOut: () => void;
  userName: string;
  userRole: string;
}

export const Profile: React.FC<ProfileProps> = ({ onSignOut, userName, userRole }) => {
  const wishlistItems = PRODUCTS.filter(p => p.rating >= 4.9).slice(0, 2);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'OutForDelivery': return <Truck className="w-5 h-5 text-primary" />;
      case 'Pending': return <Package className="w-5 h-5 text-warning" />;
      default: return <Box className="w-5 h-5 text-textSecondary" />;
    }
  };

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="pb-32 pt-6 px-4 md:px-8 lg:px-12 w-full max-w-none space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl font-black text-slate-800">
              {initials}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {userName}
            </h1>
            <p className="text-xs text-textSecondary">
              Platform Role: <span className="capitalize font-bold text-primary">{userRole}</span>
            </p>
            <button
              onClick={onSignOut}
              className="mt-2 px-3 py-1.5 bg-danger/10 hover:bg-danger/20 text-danger rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-[10px] text-textSecondary uppercase block">Orders</span>
            <span className="text-lg font-bold text-slate-800">{MOCK_ORDERS.length}</span>
          </div>
          <div className="glass-panel px-4 py-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-[10px] text-textSecondary uppercase block">Refunds</span>
            <span className="text-lg font-bold text-slate-800">0</span>
          </div>
          <div className="glass-panel px-4 py-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-[10px] text-textSecondary uppercase block">Eco Savings</span>
            <span className="text-lg font-bold text-success">15.4kg</span>
          </div>
        </div>
      </motion.div>

      {/* Grid: Order History & Saved Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Order History Timeline */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders Timeline
          </h3>

          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-5 rounded-2xl border border-black/[0.04] space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block font-mono">{order.orderNumber}</span>
                    <span className="text-[10px] text-textSecondary">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/[0.02] px-3 py-1 rounded-xl border border-black/[0.04]">
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-bold text-slate-700">{order.status}</span>
                  </div>
                </div>

                {/* Items breakdown list */}
                <div className="space-y-2 pl-1 border-l-2 border-slate-200 py-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-textSecondary">
                      <span>
                        {item.productName} <span className="text-slate-800 font-semibold">x{item.quantity}</span>
                      </span>
                      <span className="text-slate-800">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-black/[0.04] text-xs">
                  <span className="text-textSecondary">Total Paid via {order.paymentMethod}</span>
                  <span className="font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Wishlist / Saved Addresses */}
        <div className="space-y-6">
          {/* Saved Addresses */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Saved Locations
            </h3>
            <div className="glass-panel p-4 rounded-2xl border border-black/[0.04] space-y-3">
              <div>
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block">Home</span>
                <p className="text-xs text-slate-800 font-medium mt-0.5">100 Infinity Loop</p>
                <p className="text-[10px] text-textSecondary">Cupertino, California</p>
              </div>
              <div className="w-full h-[1px] bg-black/[0.04]" />
              <div>
                <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Work HQ</span>
                <p className="text-xs text-slate-800 font-medium mt-0.5">1 Infinite Loop</p>
                <p className="text-[10px] text-textSecondary">Cupertino, California</p>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-danger animate-pulse" /> Wishlist (Saved Items)
            </h3>
            <div className="space-y-3">
              {wishlistItems.map((prod) => (
                <div key={prod.id} className="glass-panel p-3 rounded-2xl border border-black/[0.04] flex items-center gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                    <span className="text-xs font-semibold text-primary">${prod.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
