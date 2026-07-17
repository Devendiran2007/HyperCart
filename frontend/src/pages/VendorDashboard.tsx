import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp, BarChart2, Plus } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PRODUCTS, SALES_CHART_DATA, type Product } from '../data/mockData';

export const VendorDashboard: React.FC = () => {
  const [vendorProducts, setVendorProducts] = useState<Product[]>(PRODUCTS.filter(p => p.vendorId === 'store-1'));
  const [newStockMap, setNewStockMap] = useState<{ [key: string]: number }>({});

  const totalRevenue = 14820.50;
  const totalOrders = 345;
  const averageValue = totalRevenue / totalOrders;
  const activeProducts = vendorProducts.filter(p => p.isAvailable).length;

  const handleUpdateStock = (productId: string) => {
    const amt = newStockMap[productId];
    if (amt === undefined || isNaN(amt)) return;
    
    setVendorProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: amt } : p))
    );
    alert('Stock updated successfully!');
  };

  return (
    <div className="pb-32 pt-6 px-4 max-w-5xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-textSecondary text-xs uppercase tracking-widest block font-medium">Merchant Console</span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Organic Oasis Analytics
            <TrendingUp className="w-5 h-5 text-success" />
          </h1>
        </div>

        {/* Real-time sync badge */}
        <div className="glass-panel px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 text-success animate-pulse">
          <span className="w-2 h-2 rounded-full bg-success" />
          Live Telemetry Connected
        </div>
      </motion.div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: `$${totalRevenue.toLocaleString()}`, change: '+18.4% this month', icon: DollarSign, color: 'text-success' },
          { label: 'Total Orders', val: totalOrders.toString(), change: '+12.6% this week', icon: ShoppingCart, color: 'text-primary' },
          { label: 'Avg Order Value', val: `$${averageValue.toFixed(2)}`, change: '+4.2% since Jan', icon: BarChart2, color: 'text-secondary' },
          { label: 'Active Products', val: `${activeProducts}/${vendorProducts.length}`, change: '4 items low stock', icon: Package, color: 'text-warning' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-5 rounded-3xl space-y-2 relative overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-textSecondary uppercase tracking-widest">{kpi.label}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{kpi.val}</h3>
                <span className="text-[9px] text-textSecondary block">{kpi.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Monthly Revenue Trends ($)</h4>
            <span className="text-[10px] text-textSecondary">Calculated from past sales receipts</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '12px', color: '#1D1D1F' }} />
                <Area type="monotone" dataKey="revenue" stroke="#0071E3" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Volume of Orders</h4>
            <span className="text-[10px] text-textSecondary">Fulfillment order counts per month</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_CHART_DATA}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '12px', color: '#1D1D1F' }} />
                <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inventory Health & Management Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Inventory Health Panel</h4>
            <span className="text-[10px] text-textSecondary">Realtime stock counts and availability flags</span>
          </div>
          <button className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/[0.04] text-textSecondary font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Status</th>
                <th className="pb-3 pr-2 text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {vendorProducts.map((prod) => {
                const isLow = prod.stock < 10 && prod.stock > 0;
                const isOut = prod.stock === 0;

                return (
                  <tr key={prod.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="py-4 pl-2 font-semibold text-slate-800 flex items-center gap-3">
                      <img src={prod.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      {prod.name}
                    </td>
                    <td className="py-4 text-textSecondary">Fresh Produce</td>
                    <td className="py-4 font-mono text-slate-800">${prod.price.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        isOut ? 'bg-danger/15 text-danger' : isLow ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Good'}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <input
                          type="number"
                          placeholder={prod.stock.toString()}
                          onChange={(e) => setNewStockMap({ ...newStockMap, [prod.id]: parseInt(e.target.value) })}
                          className="w-14 px-2 py-1 bg-black/5 border border-black/[0.04] rounded-lg text-center font-mono text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateStock(prod.id)}
                          className="px-2.5 py-1 bg-black/5 hover:bg-black/10 border border-black/[0.04] hover:border-black/[0.08] rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default VendorDashboard;
