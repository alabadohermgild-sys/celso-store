import React from 'react';
import { CONFIG } from '../../lib/config';

export default function Sidebar({ tab, setTab, activeCategory, setActiveCategory, categories, onAdmin, orders }) {
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const navItems = [
    { id: 'shop',   emoji: '🛒', label: 'Shop' },
    { id: 'gcash',  emoji: '💚', label: 'GCash Services' },
    { id: 'orders', emoji: '📦', label: 'My Orders', badge: orders.length },
  ];

  return (
    <aside className="w-64 bg-green-700 flex flex-col h-full flex-shrink-0 shadow-xl">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-green-600">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl flex items-center justify-center text-2xl shadow-md">🏪</div>
          <div>
            <h1 className="text-white font-900 text-lg leading-tight">{CONFIG.storeName}</h1>
            <p className="text-green-300 text-xs font-600">Convenience You Can Count On.</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 transition-all w-full text-left
              ${tab === item.id ? 'bg-white text-green-700 shadow-sm' : 'text-green-100 hover:bg-green-600'}`}>
            <span className="text-lg">{item.emoji}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className={`text-xs font-900 w-5 h-5 rounded-full flex items-center justify-center ${tab === item.id ? 'bg-green-600 text-white' : 'bg-amber-400 text-gray-900'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Categories (only on shop tab) */}
      {tab === 'shop' && (
        <div className="px-3 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-green-400 text-xs font-800 uppercase tracking-widest px-4 mb-2">Categories</p>
          <div className="flex flex-col gap-0.5">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-700 transition-all w-full text-left
                  ${activeCategory === cat.id ? 'bg-amber-400 text-gray-900' : 'text-green-100 hover:bg-green-600'}`}>
                <span className="text-base">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Admin button */}
      <div className="px-3 py-4 border-t border-green-600 mt-auto">
        {pendingOrders > 0 && (
          <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-xl px-4 py-2.5 mb-3">
            <span className="text-amber-300 text-sm">🔔</span>
            <span className="text-amber-200 text-xs font-700">{pendingOrders} pending order{pendingOrders > 1 ? 's' : ''}</span>
          </div>
        )}
        <button onClick={onAdmin}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 text-green-200 hover:bg-green-600 transition-all w-full">
          <span className="text-lg">⚙️</span>
          <span>Admin Panel</span>
        </button>
      </div>
    </aside>
  );
}
