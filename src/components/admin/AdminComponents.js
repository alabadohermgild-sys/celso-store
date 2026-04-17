import React, { useState, useEffect } from 'react';
import { CONFIG, ORDER_STATUSES, STATUS_COLORS, ls, dbRead, dbUpdateOrderStatus, dbUpdateGcashStatus } from '../../lib/config';
import { StatusBadge, EmptyState } from '../shared/UI';

// shared product storage key - same key used by CustomerApp
const PROD_KEY = 'celso_products_custom';
const CAT_KEY  = 'celso_categories_custom';

export function loadCustomProducts() {
  try {
    const saved = localStorage.getItem(PROD_KEY);
    if (saved) return JSON.parse(saved);
    return null;
  } catch { return null; }
}

export function loadCustomCategories() {
  try {
    const saved = localStorage.getItem(CAT_KEY);
    if (saved) return JSON.parse(saved);
    return null;
  } catch { return null; }
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
export function AdminLogin({ onAuth, onBack }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const login = () => {
    if (pw === CONFIG.adminPassword) { onAuth(); }
    else { setErr('Incorrect password. Please try again.'); setPw(''); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-700 text-sm mb-6 hover:text-gray-900 transition-colors">
          ← Back to Store
        </button>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">🔐</div>
          <h2 className="text-2xl font-900 text-gray-900 text-center mb-1">Admin Panel</h2>
          <p className="text-gray-500 font-600 text-sm text-center mb-6">Enter your password to continue</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-800 text-gray-800 block mb-1.5">Password</label>
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 transition-colors">
                <input type={show ? 'text' : 'password'} placeholder="Enter password" value={pw}
                  onChange={e => { setPw(e.target.value); setErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && login()}
                  className="flex-1 px-4 py-3.5 text-base outline-none text-gray-900" />
                <button onClick={() => setShow(s => !s)} className="px-4 text-gray-500 hover:text-gray-800 text-sm font-700 transition-colors border-l border-gray-200">
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              {err && <p className="text-red-600 text-sm font-700 mt-1.5">{err}</p>}
            </div>
            <button onClick={login}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-800 py-4 rounded-xl text-base transition-all active:scale-95">
              🔐 Login to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
export function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [gcashReqs, setGcashReqs] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  const refreshData = async () => {
    try {
      const data = await dbRead();
      setOrders(data.orders || []);
      setGcashReqs(data.gcashRequests || []);
    } catch(e) { console.error('Admin refresh error:', e); }
    finally { setDbLoading(false); }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, []);
  const [loading, setLoading] = useState(true);

  // Load from shared DB on mount and every 15 seconds (live refresh)
  
  // Load base products, then merge with any custom ones saved
  const [products, setProducts] = useState(() => {
    const custom = loadCustomProducts();
    if (custom) return custom;
    try { return require('../../data/products').products; } catch { return []; }
  });

  const [categories, setCategories] = useState(() => {
    const custom = loadCustomCategories();
    if (custom) return custom;
    try { return require('../../data/products').categories; } catch { return []; }
  });

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewReceipt, setViewReceipt] = useState(null); // image url to view
  const [viewOrderReceipt, setViewOrderReceipt] = useState(null); // order with proof

  const pending = orders.filter(o => o.status === 'pending').length;
  const todaySales = orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString()).reduce((s, o) => s + (o.total || 0), 0);
  const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);

  const updateOrderStatus = async (id, status) => {
    // Optimistic update first (instant UI)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    // Then write to shared DB
    try { await dbUpdateOrderStatus(id, status); } catch(e) { console.error(e); }
  };

  const updateGcashStatus = async (id, status) => {
    setGcashReqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try { await dbUpdateGcashStatus(id, status); } catch(e) { console.error(e); }
  };

  // Save products to shared storage so CustomerApp can read them
  const saveProducts = (p) => {
    setProducts(p);
    localStorage.setItem(PROD_KEY, JSON.stringify(p));
    // Dispatch event so CustomerApp can reload
    window.dispatchEvent(new Event('celso_products_updated'));
  };

  const saveCategories = (c) => {
    setCategories(c);
    localStorage.setItem(CAT_KEY, JSON.stringify(c));
    window.dispatchEvent(new Event('celso_products_updated'));
  };

  const deleteProduct = (id) => { if (window.confirm('Delete this product?')) saveProducts(products.filter(p => p.id !== id)); };
  const toggleStock = (id) => saveProducts(products.map(p => p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p));
  const updateStock = (id, delta) => saveProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-xl">⚙️</div>
          <div>
            <h1 className="text-base font-900 text-white leading-tight">Admin Panel</h1>
            <p className="text-gray-300 text-xs font-700">{CONFIG.storeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pending > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 rounded-lg px-3 py-1.5">
              <span className="text-amber-300 text-sm">🔔</span>
              <span className="text-amber-200 text-xs font-800">{pending} pending order{pending > 1 ? 's' : ''}</span>
            </div>
          )}
          <button onClick={refreshData} title="Refresh orders"
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-xl text-sm font-800 text-white transition-all active:scale-95">
            🔄 Refresh
          </button>
          <button onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-800 text-white transition-all active:scale-95">
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Orders', value: pending, emoji: '🔔', bg: 'bg-amber-50', border: 'border-amber-200', num: 'text-amber-700', sub: 'text-amber-600' },
          { label: "Today's Sales",  value: '₱' + todaySales.toLocaleString(), emoji: '📈', bg: 'bg-green-50',  border: 'border-green-200', num: 'text-green-700', sub: 'text-green-600' },
          { label: 'Total Orders',   value: orders.length, emoji: '📦', bg: 'bg-blue-50',   border: 'border-blue-200',  num: 'text-blue-700',  sub: 'text-blue-600' },
          { label: 'Total Revenue',  value: '₱' + totalSales.toLocaleString(), emoji: '💰', bg: 'bg-purple-50', border: 'border-purple-200', num: 'text-purple-700', sub: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <p className={`text-2xl font-900 ${s.num}`}>{s.value}</p>
              <p className={`text-xs font-800 ${s.sub}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex border-b border-gray-300 mb-6">
          {[
            { id: 'orders', label: '📦 Orders', badge: pending },
            { id: 'gcash', label: '💚 GCash Requests' },
            { id: 'products', label: '🛍️ Products' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-800 text-sm border-b-2 transition-all ${tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {t.label}
              {t.badge > 0 && <span className="bg-red-500 text-white text-xs font-900 w-5 h-5 rounded-full flex items-center justify-center">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ─── ORDERS TAB ─── */}
        {tab === 'orders' && (
          <div className="pb-8">
            {loading && <div className="flex items-center gap-2 text-gray-400 text-sm font-700 mb-4"><div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />Loading orders from database...</div>}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm font-800 text-gray-700">Filter:</span>
              {['all', ...ORDER_STATUSES].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-800 transition-all capitalize border ${filterStatus === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>
                  {s}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0
              ? <EmptyState emoji="📦" title="No orders" subtitle={filterStatus !== 'all' ? `No ${filterStatus} orders` : 'Orders will appear here'} />
              : <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gray-100 border-b border-gray-200">
                      <div>
                        <span className="font-900 text-gray-900 text-sm">#{order.id}</span>
                        <span className="text-gray-600 text-xs font-700 ml-2">
                          {new Date(order.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="px-5 py-4 space-y-2">
                      <p className="font-800 text-gray-900 text-sm">{order.name} · {order.phone}</p>
                      {order.address && <p className="text-xs text-gray-600 font-700">📍 {order.address}</p>}
                      <p className="text-xs text-gray-700 font-700">
                        {order.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'} · {order.payMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}
                      </p>
                      {order.gcashRef && (
                        <p className="text-xs text-emerald-700 font-800 bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                          GCash Ref: {order.gcashRef}
                        </p>
                      )}

                      {/* View GCash receipt if customer uploaded one */}
                      {order.proofPreview && (
                        <button onClick={() => setViewOrderReceipt(order)}
                          className="flex items-center gap-1.5 text-xs font-800 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                          🖼️ View GCash Receipt
                        </button>
                      )}
                      {order.payMethod === 'gcash' && !order.proofPreview && (
                        <p className="text-xs text-amber-700 font-700 bg-amber-50 px-2 py-1 rounded-lg">⚠️ No receipt uploaded yet</p>
                      )}

                      <div className="flex flex-wrap gap-1 py-1">
                        {order.cart?.map(i => (
                          <span key={i.id} className="bg-gray-100 text-gray-700 text-xs font-700 px-2 py-0.5 rounded-lg">{i.emoji} {i.name} ×{i.qty}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-lg font-900 text-green-700">₱{order.total?.toLocaleString()}</span>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {ORDER_STATUSES.map(s => (
                            <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-800 capitalize transition-all border
                                ${order.status === s
                                  ? `${STATUS_COLORS[s]?.bg} ${STATUS_COLORS[s]?.text} border-transparent`
                                  : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* ─── GCASH TAB ─── */}
        {tab === 'gcash' && (
          <div className="pb-8">
            {gcashReqs.length === 0
              ? <EmptyState emoji="💚" title="No GCash requests" subtitle="GCash service requests will appear here" />
              : <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {gcashReqs.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gray-100 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className={`font-900 text-sm ${req.service === 'cashin' ? 'text-emerald-700' : 'text-red-600'}`}>
                          {req.service === 'cashin' ? '↓ Cash In' : '↑ Cash Out'}
                        </span>
                        <span className="text-gray-500 text-xs font-700">#{req.id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-800 uppercase ${req.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{req.status}</span>
                    </div>
                    <div className="px-5 py-4 space-y-2">
                      <p className="font-800 text-gray-900 text-sm">{req.name} · {req.number}</p>
                      <p className="text-xs text-gray-500 font-700">
                        {new Date(req.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm border border-gray-100">
                        <div className="flex justify-between"><span className="text-gray-600 font-700">Amount</span><span className="font-800 text-gray-900">₱{req.amount?.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600 font-700">Fee (3%)</span><span className="font-800 text-gray-900">₱{req.fee}</span></div>
                        <div className="flex justify-between border-t border-gray-200 pt-1.5">
                          <span className="font-800 text-gray-800">They {req.service === 'cashin' ? 'pay' : 'send'}</span>
                          <span className="font-900 text-green-700">₱{req.youPay?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* View uploaded proof */}
                      {req.proofPreview && (
                        <button onClick={() => setViewReceipt(req.proofPreview)}
                          className="flex items-center gap-1.5 text-xs font-800 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors w-full justify-center">
                          🖼️ View Payment Proof
                        </button>
                      )}

                      <div className="flex gap-2 pt-1">
                        {['pending', 'done'].map(s => (
                          <button key={s} onClick={() => updateGcashStatus(req.id, s)}
                            className={`flex-1 py-2 rounded-lg text-xs font-800 capitalize transition-all border
                              ${req.status === s
                                ? (s === 'done' ? 'bg-green-100 text-green-800 border-transparent' : 'bg-amber-100 text-amber-800 border-transparent')
                                : 'border-gray-300 text-gray-600 bg-white hover:border-gray-400'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* ─── PRODUCTS TAB ─── */}
        {tab === 'products' && (
          <div className="pb-8">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <p className="text-sm text-gray-600 font-800">{products.length} products · {categories.length - 1} categories</p>
              <div className="flex gap-2">
                <button onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 bg-white border-2 border-green-500 text-green-700 hover:bg-green-50 px-4 py-2.5 rounded-xl text-sm font-800 transition-all active:scale-95">
                  + Add Category
                </button>
                <button onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-800 transition-all active:scale-95">
                  + Add Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(p => (
                <div key={p.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${p.stock === 0 ? 'border-red-200' : 'border-gray-200'}`}>
                  <div className="bg-green-50 h-28 flex items-center justify-center relative overflow-hidden">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="text-4xl">{p.emoji}</span>
                    }
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-800 px-2 py-0.5 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-800 text-gray-900 leading-tight mb-1 line-clamp-2">{p.name}</p>
                    <p className="text-sm font-900 text-green-700 mb-1">₱{p.price}</p><p className="text-xs text-gray-500 font-700 mb-2">{p.unit || 'per piece'}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-600 font-800">{p.stock} in stock</span>
                      <div className="flex gap-1">
                        <button onClick={() => updateStock(p.id, -1)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm font-900 text-gray-700 transition-colors">−</button>
                        <button onClick={() => updateStock(p.id, 1)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm font-900 text-gray-700 transition-colors">+</button>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleStock(p.id)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-800 transition-all ${p.stock === 0 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {p.stock === 0 ? 'Restock' : 'Mark OOS'}
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-800 transition-all border border-red-200">🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddProduct(false)}
          onSave={(p) => { saveProducts([...products, p]); setShowAddProduct(false); }}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSave={(c) => { saveCategories([...categories, c]); setShowAddCategory(false); }}
        />
      )}

      {/* Receipt viewer - GCash service proof */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setViewReceipt(null)}>
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewReceipt(null)} className="absolute -top-10 right-0 text-white font-700 text-lg hover:text-gray-300">✕ Close</button>
            <img src={viewReceipt} alt="Payment proof" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* Order receipt viewer - GCash order proof */}
      {viewOrderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setViewOrderReceipt(null)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="font-900 text-gray-900">GCash Receipt</p>
                <p className="text-xs text-gray-500 font-700">Order #{viewOrderReceipt.id} · {viewOrderReceipt.name}</p>
                {viewOrderReceipt.gcashRef && <p className="text-xs text-emerald-700 font-800 mt-0.5">Ref: {viewOrderReceipt.gcashRef}</p>}
              </div>
              <button onClick={() => setViewOrderReceipt(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg hover:bg-gray-200">×</button>
            </div>
            <div className="p-4">
              <img src={viewOrderReceipt.proofPreview} alt="GCash proof" className="w-full rounded-xl" />
              <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-500 font-700">Amount</span><span className="font-900 text-green-700">₱{viewOrderReceipt.total?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-700">GCash Ref</span><span className="font-800 text-gray-800">{viewOrderReceipt.gcashRef || 'Not provided'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADD PRODUCT MODAL ─────────────────────────────────────────────────────────
function AddProductModal({ categories, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '', emoji: '📦', category: 'snacks', description: '', tags: [], image: '', unit: 'per piece' });
  const [imagePreview, setImagePreview] = useState(null);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImagePreview(ev.target.result);
      upd('image', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.name || !form.price || !form.stock) return;
    onSave({ ...form, id: Date.now(), price: parseFloat(form.price), stock: parseInt(form.stock) });
  };

  const catOptions = categories.filter(c => c.id !== 'all').map(c => c.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-900 text-gray-900">Add New Product</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg hover:bg-gray-200">×</button>
        </div>
        <div className="space-y-4">
          {/* Product Image Upload */}
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Product Picture</label>
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
              {imagePreview
                ? <img src={imagePreview} alt="product" className="h-32 object-contain rounded-lg" />
                : <>
                    <span className="text-4xl">📷</span>
                    <span className="text-sm text-gray-500 font-700">Click to upload product photo</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WEBP supported</span>
                  </>
              }
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {!imagePreview && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-600">Or use emoji instead:</span>
                <input placeholder="📦" value={form.emoji} onChange={e => upd('emoji', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-16 outline-none focus:border-green-500" />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Product Name *</label>
            <input placeholder="e.g. Coca-Cola 1.5L" value={form.name} onChange={e => upd('name', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-800 text-gray-800 block mb-1.5">Price (₱) *</label>
              <input type="number" placeholder="0" value={form.price} onChange={e => upd('price', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900" />
            </div>
            <div>
              <label className="text-sm font-800 text-gray-800 block mb-1.5">Stock *</label>
              <input type="number" placeholder="0" value={form.stock} onChange={e => upd('stock', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900" />
            </div>
          </div>

          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Category</label>
            <select value={form.category} onChange={e => upd('category', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900 bg-white">
              {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Description</label>
            <textarea placeholder="Brief product description..." value={form.description} onChange={e => upd('description', e.target.value)}
              rows={2} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-green-500 text-gray-900" />
          </div>

          <div>
            <label className="text-sm font-800 text-gray-800 block mb-2">Tags</label>
            <div className="flex gap-2">
              {['bestseller', 'popular'].map(tag => (
                <button key={tag} type="button"
                  onClick={() => upd('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-800 capitalize transition-all border ${form.tags.includes(tag) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Sold As (Unit)</label>
            <select value={form.unit} onChange={e => upd('unit', e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900 bg-white">
              <option value="per piece">per piece</option>
              <option value="per pack">per pack</option>
              <option value="per bundle">per bundle</option>
              <option value="per tie">per tie</option>
              <option value="per bag">per bag</option>
              <option value="per box">per box</option>
              <option value="per bottle">per bottle</option>
              <option value="per sachet">per sachet</option>
              <option value="per kilo">per kilo</option>
              <option value="per can">per can</option>
              <option value="per tray">per tray</option>
              <option value="per dozen">per dozen</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-sm font-800 text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={save} disabled={!form.name || !form.price || !form.stock}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-800 transition-all disabled:opacity-40 active:scale-95">
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADD CATEGORY MODAL ────────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷️');

  const save = () => {
    if (!name.trim()) return;
    onSave({ id: name.toLowerCase().replace(/\s+/g, '_'), name: name.trim(), emoji });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-900 text-gray-900">Add New Category</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Category Name *</label>
            <input placeholder="e.g. Frozen Foods" value={name} onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-green-500 text-gray-900" />
          </div>
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Emoji</label>
            <input placeholder="🏷️" value={emoji} onChange={e => setEmoji(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-2xl outline-none focus:border-green-500 text-center" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-sm font-800 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={save} disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-800 disabled:opacity-40 active:scale-95">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
