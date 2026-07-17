import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Store as StoreIcon, Activity, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { STORES, SALES_CHART_DATA, type Store } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>(STORES);

  const handleVerifyStore = (storeId: string) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, isVerified: true } : s))
    );
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(prev => prev.filter(s => s.id !== storeId));
  };

  const pendingApprovals = stores.filter(s => !s.isVerified).length;

  return (
    <div className="pb-32 pt-6 px-4 md:px-8 lg:px-12 w-full max-w-none space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-textSecondary text-xs uppercase tracking-widest block font-medium">Enterprise Control</span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Platform Operations
            <ShieldCheck className="w-5 h-5 text-primary" />
          </h1>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Platform Volume', val: '$68,420.00', change: '+22.4%', icon: ArrowUpRight, color: 'text-primary' },
          { label: 'Registered Stores', val: stores.length.toString(), change: `${pendingApprovals} pending verification`, icon: StoreIcon, color: 'text-secondary' },
          { label: 'Active Consumers', val: '1,240', change: '+8% this month', icon: Users, color: 'text-success' },
          { label: 'System Health', val: '99.98%', change: 'All nodes healthy', icon: Activity, color: 'text-info' }
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
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{kpi.val}</h3>
                <span className="text-[9px] text-textSecondary block">{kpi.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid: approvals and system graph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Approvals Queue */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Vendor Verification Queue</h4>
            <span className="text-[10px] text-textSecondary">Requires manual audit of business records</span>
          </div>

          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="p-4 bg-white/5 border border-black/[0.04] rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={store.logoUrl}
                    alt={store.storeName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      {store.storeName}
                      {store.isVerified && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-success/15 text-success rounded-full uppercase">
                          Verified
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-textSecondary line-clamp-1">{store.address}</p>
                    <span className="text-[9px] text-primary font-semibold mt-1 block">
                      Range: {store.deliveryRadiusKm}km Radius
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!store.isVerified && (
                    <button
                      onClick={() => handleVerifyStore(store.id)}
                      className="p-2 bg-success/10 hover:bg-success/20 text-success rounded-xl transition-all cursor-pointer"
                      title="Verify Vendor"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="p-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-xl transition-all cursor-pointer"
                    title="Remove Vendor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Transaction Logs</h4>
            <span className="text-[10px] text-textSecondary">Aggregated processing volume</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="adminChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '10px', color: '#1D1D1F' }} />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#adminChart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
