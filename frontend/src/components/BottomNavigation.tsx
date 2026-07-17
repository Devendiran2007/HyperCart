import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User, BarChart2, Shield } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  userRole: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  userRole
}) => {
  // Dynamically filter tabs based on role
  const navItems = [];
  if (userRole === 'user') {
    navItems.push(
      { id: 'home', label: 'Home', icon: Home },
      { id: 'search', label: 'Search', icon: Search },
      { id: 'profile', label: 'Profile', icon: User }
    );
  } else if (userRole === 'vendor') {
    navItems.push(
      { id: 'vendor', label: 'Dashboard', icon: BarChart2 },
      { id: 'profile', label: 'Profile', icon: User }
    );
  } else if (userRole === 'admin') {
    navItems.push(
      { id: 'admin', label: 'Admin Ops', icon: Shield },
      { id: 'profile', label: 'Profile', icon: User }
    );
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="glass-panel px-6 py-3 rounded-3xl flex items-center justify-between gap-6 pointer-events-auto shadow-2xl max-w-md w-full"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative p-2 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                  transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                />
              )}
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-primary scale-110' : 'text-textSecondary group-hover:text-slate-800'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-textSecondary'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Shopping bag floating trigger - only visible to user persona */}
        {userRole === 'user' && (
          <>
            <div className="w-[1px] h-8 bg-black/10" />
            <button
              onClick={openCart}
              className="relative p-3 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95 pointer-events-auto flex-shrink-0"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background"
                >
                  {cartCount}
                </motion.div>
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};
export default BottomNavigation;
