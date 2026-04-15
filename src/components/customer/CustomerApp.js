import React, { useState, useEffect, useCallback } from 'react';
import { ls, CONFIG } from '../../lib/config';
import { products as BASE_PRODUCTS, categories as BASE_CATEGORIES } from '../../data/products';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import CartPanel from './CartPanel';
import CheckoutFlow from './CheckoutFlow';
import { OrderConfirm } from './Extras';
import { GcashServices } from './Extras';
import { MyOrders } from './Extras';
import { ProductModal } from './Extras';

const loadProds = () => {
  try { const s = localStorage.getItem('celso_products_custom'); return s ? JSON.parse(s) : BASE_PRODUCTS; }
  catch { return BASE_PRODUCTS; }
};
const loadCats = () => {
  try { const s = localStorage.getItem('celso_categories_custom'); return s ? JSON.parse(s) : BASE_CATEGORIES; }
  catch { return BASE_CATEGORIES; }
};

function PageFooter() {
  const [showContact, setShowContact] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  return (
    <>
      <footer className="border-t border-gray-200 mt-8 pt-8 pb-6 px-6 text-center">
        <p className="text-base font-900 text-gray-800">🏪 Celso Store</p>
        <p className="text-sm text-gray-500 font-700 mt-0.5">Proudly Serving You!</p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 font-700 flex-wrap">
          <button onClick={() => setShowTerms(true)} className="hover:text-green-600 transition-colors underline underline-offset-2">Terms of Service</button>
          <span className="text-gray-300">·</span>
          <button onClick={() => setShowPrivacy(true)} className="hover:text-green-600 transition-colors underline underline-offset-2">Privacy Policy</button>
          <span className="text-gray-300">·</span>
          <button onClick={() => setShowContact(true)} className="hover:text-green-600 transition-colors underline underline-offset-2">Contact Us</button>
          <span className="text-gray-300">·</span>
          <a href="#admin" className="hover:text-green-600 transition-colors underline underline-offset-2">Admin</a>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="https://www.facebook.com/Slimshady477" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-700 transition-colors">📘 Facebook</a>
          <span className="text-gray-300 text-xs">·</span>
          <a href="https://hermzz.wuaze.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-700 transition-colors">🌐 Developer Portfolio</a>
        </div>
        <p className="text-xs text-gray-600 font-700 mt-4">© 2026 Celso Store. All rights reserved.</p>
        <p className="text-xs text-gray-500 font-700 mt-1">Proudly Made with ❤️ by <a href="https://hermzz.wuaze.com/" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-500 font-700 transition-colors">Hermz</a></p>
      </footer>

      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContact(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-900 text-gray-900">Contact Us</h3>
              <button onClick={() => setShowContact(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg hover:bg-gray-200">×</button>
            </div>
            <div className="space-y-3">
              <a href="mailto:alabadohermgild@gmail.com" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors group">
                <span className="text-2xl">📧</span>
                <div><p className="text-xs text-gray-500 font-700">Email</p><p className="text-sm font-800 text-gray-900 group-hover:text-green-700">alabadohermgild@gmail.com</p></div>
              </a>
              <a href="tel:09812693563" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors group">
                <span className="text-2xl">📞</span>
                <div><p className="text-xs text-gray-500 font-700">Phone</p><p className="text-sm font-800 text-gray-900 group-hover:text-green-700">0981 269 3563</p></div>
              </a>
              <a href="https://www.facebook.com/Slimshady477" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group">
                <span className="text-2xl">📘</span>
                <div><p className="text-xs text-gray-500 font-700">Facebook</p><p className="text-sm font-800 text-gray-900 group-hover:text-blue-700">facebook.com/Slimshady477</p></div>
              </a>
              <a href="https://hermzz.wuaze.com/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors group">
                <span className="text-2xl">🌐</span>
                <div><p className="text-xs text-gray-500 font-700">Developer Portfolio</p><p className="text-sm font-800 text-gray-900 group-hover:text-green-700">hermzz.wuaze.com</p></div>
              </a>
            </div>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTerms(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-900 text-gray-900">Terms of Service</h3>
              <button onClick={() => setShowTerms(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg hover:bg-gray-200">×</button>
            </div>
            <div className="space-y-4 text-sm text-gray-600 font-600 leading-relaxed">
              <p><strong className="text-gray-900">1. Orders</strong><br/>All orders are subject to availability. We reserve the right to cancel if items are out of stock.</p>
              <p><strong className="text-gray-900">2. Payments</strong><br/>We accept GCash and cash. GCash payments require a reference number and screenshot. A 2% fee applies to GCash orders.</p>
              <p><strong className="text-gray-900">3. Delivery</strong><br/>Fees vary by distance. Estimated delivery: 30-45 minutes. We are not responsible for delays due to weather or other factors.</p>
              <p><strong className="text-gray-900">4. GCash Services</strong><br/>Cash-in and cash-out carry a 3% service fee. Minimum transaction is ₱100. Store hours apply.</p>
              <p><strong className="text-gray-900">5. Refunds</strong><br/>Refunds only for incorrect or defective items. Contact us within 24 hours of receiving your order.</p>
              <p><strong className="text-gray-900">6. Contact</strong><br/>alabadohermgild@gmail.com or 0981 269 3563.</p>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPrivacy(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-900 text-gray-900">Privacy Policy</h3>
              <button onClick={() => setShowPrivacy(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-700 text-lg hover:bg-gray-200">×</button>
            </div>
            <div className="space-y-4 text-sm text-gray-600 font-600 leading-relaxed">
              <p><strong className="text-gray-900">Information We Collect</strong><br/>We collect your name, phone, and address only to process your orders. We do not share this with third parties.</p>
              <p><strong className="text-gray-900">GCash Payments</strong><br/>Screenshots and reference numbers are for verification only, stored locally and not transmitted externally.</p>
              <p><strong className="text-gray-900">Data Storage</strong><br/>Order history and cart are stored on your device. We do not keep a centralized customer database.</p>
              <p><strong className="text-gray-900">Cookies</strong><br/>We use browser local storage for your cart and preferences. No tracking cookies are used.</p>
              <p><strong className="text-gray-900">Contact</strong><br/>For privacy concerns: alabadohermgild@gmail.com.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default function CustomerApp({ onAdmin }) {
  const [tab, setTab] = useState('shop');
  const [cart, setCart] = useState(() => ls.get('celso_cart', []));
  const [orders, setOrders] = useState(() => ls.get('celso_orders', []));
  const [allProducts, setAllProducts] = useState(loadProds);
  const [allCategories, setAllCategories] = useState(loadCats);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);

  // Reload when admin updates products
  useEffect(() => {
    const reload = () => {
      setAllProducts(loadProds());
      setAllCategories(loadCats());
    };
    window.addEventListener('celso_products_updated', reload);
    return () => window.removeEventListener('celso_products_updated', reload);
  }, []);

  useEffect(() => ls.set('celso_cart', cart), [cart]);
  useEffect(() => ls.set('celso_orders', orders), [orders]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...product, qty }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }, []);

  const getCartQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  const placeOrder = (orderData) => {
    const o = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      ...orderData,
      cart: [...cart],
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [o, ...orders];
    setOrders(updated);
    ls.set('celso_orders', updated);
    setConfirmedOrder(o);
    setCart([]);
    setCheckoutOpen(false);
  };

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tabLabel = tab === 'shop'
    ? (activeCategory === 'all' ? 'All Products' : allCategories.find(c => c.id === activeCategory)?.name || 'Products')
    : tab === 'gcash' ? 'GCash Services' : 'My Orders';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          tab={tab} setTab={setTab}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          categories={allCategories} onAdmin={onAdmin}
          orders={orders}
        />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-900 text-gray-900">{tabLabel}</h2>
              {tab === 'shop' && <p className="text-sm text-gray-500 font-700">{filtered.length} items available</p>}
            </div>
            <div className="flex items-center gap-3">
              {tab === 'shop' && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                  <input
                    className="pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm font-600 outline-none focus:ring-2 focus:ring-green-500 w-64 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Search products..."
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className={`relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-700 text-sm transition-all active:scale-95 ${cartBounce ? 'bounce-anim' : ''}`}>
                🛒 Cart
                {cartCount > 0 && (
                  <span className="bg-amber-400 text-gray-900 text-xs font-900 w-6 h-6 rounded-full flex items-center justify-center">{cartCount}</span>
                )}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {tab === 'shop' && (
              <ProductGrid
                products={filtered} getCartQty={getCartQty}
                onAdd={addToCart} onUpdateQty={updateQty}
                onViewProduct={setSelectedProduct}
              />
            )}
            {tab === 'gcash' && <GcashServices />}
            {tab === 'orders' && <MyOrders orders={orders} />}
            {tab === 'shop' && <PageFooter />}
          </div>
        </main>

        {/* Right Cart Panel */}
        {cartOpen && (
          <CartPanel
            cart={cart} subtotal={subtotal} updateQty={updateQty}
            onClose={() => setCartOpen(false)}
            onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
            isDesktop
          />
        )}
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <header className="bg-green-600 text-white px-4 py-3 sticky top-0 z-40 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <div>
                <h1 className="text-base font-900 leading-tight">{CONFIG.storeName}</h1>
                <p className="text-xs text-green-200 font-700">{CONFIG.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                className={`relative w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-lg ${cartBounce ? 'bounce-anim' : ''}`}>
                🛒
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-900 w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>
          {tab === 'shop' && (
            <div className="mt-2">
              <input
                className="w-full bg-white/20 placeholder-green-200 text-white rounded-xl px-4 py-2 text-sm font-600 outline-none"
                placeholder="Search products..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
          {tab === 'shop' && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-2 pb-1">
              {allCategories.map(c => (
                <button key={c.id} onClick={() => setActiveCategory(c.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-800 transition-all ${activeCategory === c.id ? 'bg-amber-400 text-gray-900' : 'bg-white/20 text-white'}`}>
                  <span>{c.emoji}</span><span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          {tab === 'shop' && (
            <>
              <ProductGrid
                products={filtered} getCartQty={getCartQty}
                onAdd={addToCart} onUpdateQty={updateQty}
                onViewProduct={setSelectedProduct}
                mobile
              />
              <PageFooter />
            </>
          )}
          {tab === 'gcash' && <GcashServices />}
          {tab === 'orders' && <MyOrders orders={orders} />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
          {[
            { id: 'shop', emoji: '🛒', label: 'Shop' },
            { id: 'gcash', emoji: '💚', label: 'GCash' },
            { id: 'orders', emoji: '📦', label: 'Orders' },
            { id: 'admin', emoji: '⚙️', label: 'Admin' },
          ].map(item => (
            <button key={item.id}
              onClick={() => item.id === 'admin' ? onAdmin() : setTab(item.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${tab === item.id ? 'text-green-700' : 'text-gray-500'}`}>
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-800">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── OVERLAYS ── */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <CartPanel
              cart={cart} subtotal={subtotal} updateQty={updateQty}
              onClose={() => setCartOpen(false)}
              onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
            />
          </div>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutFlow
          cart={cart} subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onPlace={placeOrder}
        />
      )}

      {confirmedOrder && (
        <OrderConfirm order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          cartQty={getCartQty(selectedProduct.id)}
          onAdd={(qty) => { addToCart(selectedProduct, qty); setSelectedProduct(null); }}
          onUpdateQty={(delta) => updateQty(selectedProduct.id, delta)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {cartCount > 0 && tab === 'shop' && !cartOpen && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 px-4 z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between bg-green-600 text-white px-5 py-4 rounded-2xl shadow-lg font-700 text-sm active:scale-98 transition-all">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-gray-900 font-900 w-7 h-7 rounded-full flex items-center justify-center text-xs">{cartCount}</span>
              <span className="font-800">View Cart</span>
            </div>
            <span className="font-900 text-base">₱{subtotal.toLocaleString()} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
