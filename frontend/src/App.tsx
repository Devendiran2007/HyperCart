import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Search as SearchIcon, AlertTriangle } from 'lucide-react';
import { Store as StorePage } from './pages/Store';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BottomNavigation } from './components/BottomNavigation';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { type Product, STORES, PRODUCTS } from './data/mockData';
import { ProductCard } from './components/ProductCard';

const queryClient = new QueryClient();

interface CartItem {
  product: Product;
  quantity: number;
}

export const App: React.FC = () => {
  // Login Role States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'vendor' | 'admin'>('user');
  const [userName, setUserName] = useState('Guest');

  const [activeTab, setActiveTab] = useState('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Details Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active Store detail lookup
  const activeStore = STORES.find(s => s.id === selectedStoreId);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    // Stock validations
    const existing = cartItems.find(item => item.product.id === product.id);
    const targetQty = (existing?.quantity ?? 0) + 1;

    if (targetQty > product.stock) {
      toast.error(`Out of stock! Only ${product.stock} items left.`, {
        icon: <AlertTriangle className="text-warning w-4 h-4" />
      });
      return;
    }

    setCartItems(prev => {
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    toast.success(`${product.name} added to Shopping Bag`, {
      icon: <Sparkles className="text-primary w-4 h-4" />
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const item = cartItems.find(i => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      toast.error(`Cannot exceed available stock limit.`);
      return;
    }

    setCartItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
    toast.info('Item removed from Shopping Bag');
  };

  const handleConfirmOrder = (address: string, paymentMethod: string) => {
    setCartItems([]);
    toast.success(`Order successfully placed to ${address} using ${paymentMethod}!`);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Search filtering in search tab
  const searchResults = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserName('Guest');
  };

  // 1. Gateway Login Page
  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-slate-800 antialiased font-sans relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 text-center"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Platform Gateway
              </span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
                HYPERCART
              </h1>
              <p className="text-xs text-textSecondary">
                Connect to Cupertino's premium hyperlocal supply chain.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setUserRole('user');
                  setUserName('Devendiran K');
                  setIsLoggedIn(true);
                  setActiveTab('home');
                }}
                className="w-full py-4 px-6 glass-panel hover:bg-primary/5 border border-black/[0.04] rounded-2xl flex items-center justify-between group cursor-pointer transition-all active:scale-98"
              >
                <div className="text-left">
                  <span className="text-xs text-textSecondary uppercase tracking-widest block font-medium">Customer Persona</span>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-primary">Devendiran K</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  DK
                </div>
              </button>

              <button
                onClick={() => {
                  setUserRole('vendor');
                  setUserName('Organic Oasis Merchant');
                  setIsLoggedIn(true);
                  setActiveTab('vendor');
                }}
                className="w-full py-4 px-6 glass-panel hover:bg-secondary/5 border border-black/[0.04] rounded-2xl flex items-center justify-between group cursor-pointer transition-all active:scale-98"
              >
                <div className="text-left">
                  <span className="text-xs text-textSecondary uppercase tracking-widest block font-medium">Merchant Persona</span>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-secondary">Organic Oasis</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                  OO
                </div>
              </button>

              <button
                onClick={() => {
                  setUserRole('admin');
                  setUserName('Platform Administrator');
                  setIsLoggedIn(true);
                  setActiveTab('admin');
                }}
                className="w-full py-4 px-6 glass-panel hover:bg-slate-100 border border-black/[0.04] rounded-2xl flex items-center justify-between group cursor-pointer transition-all active:scale-98"
              >
                <div className="text-left">
                  <span className="text-xs text-textSecondary uppercase tracking-widest block font-medium">Admin Operator</span>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900">Enterprise Admin</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm">
                  AD
                </div>
              </button>
            </div>
            
            <p className="text-[10px] text-textSecondary">
              Secure hardware token check active.
            </p>
          </motion.div>
        </div>
      </QueryClientProvider>
    );
  }

  // 2. Authenticated Dashboard Layout
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-slate-800 antialiased font-sans relative">
        
        {/* Glow grid background effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        {/* Global sticky bar */}
        <header className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-black/[0.04] backdrop-blur-md">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedStoreId(null); if(userRole === 'user') setActiveTab('home'); }}>
            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
              HYPERCART
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary bg-black/5 px-2 py-0.5 rounded-full">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-textSecondary bg-black/5 px-3.5 py-1.5 rounded-full border border-black/[0.04]">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Cupertino Hub Active ({userName})
            </div>
          </div>
        </header>

        {/* Active Page View Coordinator */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {selectedStoreId && activeStore ? (
              // Store page overrides standard tabs
              <motion.div
                key={`store-${selectedStoreId}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StorePage
                  store={activeStore}
                  onBack={() => setSelectedStoreId(null)}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'home' && (
                  <Home
                    onSelectStore={setSelectedStoreId}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                )}

                {activeTab === 'search' && (
                  <div className="pb-32 pt-6 px-4 max-w-4xl mx-auto space-y-6">
                    <div>
                      <span className="text-textSecondary text-xs uppercase tracking-widest block font-medium">Catalog Index</span>
                      <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        Global Search Suggestions
                      </h1>
                    </div>

                    <div className="relative">
                      <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-textSecondary" />
                      <input
                        type="text"
                        placeholder="Search our hyperlocal ecosystem..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface border border-black/[0.04] rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-primary shadow-lg"
                      />
                    </div>

                    {/* Results / Empty state */}
                    {searchQuery.trim() === '' ? (
                      <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
                        <div className="text-4xl">🔍</div>
                        <div>
                          <h3 className="font-bold text-slate-800">Find anything nearby</h3>
                          <p className="text-xs text-textSecondary mt-1">
                            Type to query fresh cherries, sourdough loaves, salmon fillets, and dairy.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResults.map((prod) => (
                          <div
                            key={prod.id}
                            className="relative group"
                          >
                            <ProductCard
                              product={prod}
                              onAddToCart={handleAddToCart}
                              onQuickView={setQuickViewProduct}
                            />
                            {/* Float link to vendor store */}
                            <button
                              onClick={() => setSelectedStoreId(prod.vendorId)}
                              className="absolute top-3 left-3 bg-black/60 hover:bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Visit Merchant
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <Profile
                    onSignOut={handleSignOut}
                    userName={userName}
                    userRole={userRole}
                  />
                )}
                {activeTab === 'vendor' && <VendorDashboard />}
                {activeTab === 'admin' && <AdminDashboard />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global iOS-Style Tab Navigation */}
        <BottomNavigation
          activeTab={selectedStoreId ? '' : activeTab}
          setActiveTab={(tab) => {
            setSelectedStoreId(null);
            setActiveTab(tab);
          }}
          cartCount={cartCount}
          openCart={() => setIsCartOpen(true)}
          userRole={userRole}
        />

        {/* Shopping Bag Drawer Overlay */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Secure Checkout step wizard modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirmOrder={handleConfirmOrder}
          totalAmount={cartTotal}
        />

        {/* Zoomable quick detail view modal */}
        <ProductDetailsModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Toast Notifier configuration */}
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              color: '#1D1D1F',
              borderRadius: '16px',
              backdropFilter: 'blur(8px)'
            }
          }}
        />
      </div>
    </QueryClientProvider>
  );
};
export default App;
