import React, { useState, useEffect } from 'react';
import { products, categories } from '../data/products';
import {
  ShoppingCart, Search, X, Plus, Minus, ChevronRight,
  Home, ArrowLeft, CheckCircle, Package, Truck,
  Smartphone, Banknote, ArrowDownCircle, ArrowUpCircle,
  Send, Clock, Shield, Zap, Upload, Lock, Eye, EyeOff,
  Bell, Settings, LogOut, Users, TrendingUp, AlertCircle
} from 'lucide-react';
import '../styles/store.css';

// ── CONFIG ── change these to yours ──────────────────────────────────────────
const STORE_NAME = 'Celso Store';
const STORE_TAGLINE = 'Shop easy, live better.';
const GCASH_NUMBER = '0999 446 2191';
const GCASH_ACCOUNT_NAME = 'Celso M.';
const GCASH_SERVICE_FEE = 0.02; // 2%
const ADMIN_PASSWORD = 'celso2024'; // change this!

const DELIVERY_ZONES = [
  { label: 'Same street (0–500m)', fee: 15 },
  { label: 'Nearby (500m–1km)', fee: 25 },
  { label: '1km–2km away', fee: 40 },
  { label: '2km–5km away', fee: 60 },
  { label: '5km+ (far area)', fee: 100 },
];

// ── storage helpers ───────────────────────────────────────────────────────────
const ls = {
  get: (k, def = []) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('store'); // store | admin
  const [adminAuthed, setAdminAuthed] = useState(false);

  if (view === 'admin') {
    if (!adminAuthed) return <AdminLogin onAuth={() => setAdminAuthed(true)} onBack={() => setView('store')} />;
    return <AdminPanel onLogout={() => { setAdminAuthed(false); setView('store'); }} />;
  }

  return <Store onAdmin={() => setView('admin')} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER STORE
// ─────────────────────────────────────────────────────────────────────────────
function Store({ onAdmin }) {
  const [tab, setTab] = useState('shop');
  const [screen, setScreen] = useState('home');
  const [cart, setCart] = useState(() => ls.get('celso_cart', []));
  const [orders, setOrders] = useState(() => ls.get('celso_orders', []));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartBounce, setCartBounce] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => ls.set('celso_cart', cart), [cart]);
  useEffect(() => ls.set('celso_orders', orders), [orders]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  const updateQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  const getCartQty = id => cart.find(i => i.id === id)?.qty || 0;

  const placeOrder = (orderData) => {
    const newOrder = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      ...orderData,
      cart: [...cart],
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    ls.set('celso_orders', updated);
    setConfirmedOrder(newOrder);
    setCart([]);
    setScreen('confirm');
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (screen === 'confirm' && confirmedOrder)
    return <ConfirmScreen order={confirmedOrder} onHome={() => { setScreen('home'); setConfirmedOrder(null); }} />;
  if (screen === 'checkout')
    return <CheckoutScreen cart={cart} subtotal={subtotal} onBack={() => setScreen('cart')} onPlace={placeOrder} />;
  if (screen === 'cart')
    return <CartScreen cart={cart} updateQty={updateQty} subtotal={subtotal} onBack={() => setScreen('home')} onCheckout={() => setScreen('checkout')} />;
  if (screen === 'product' && selectedProduct)
    return (
      <ProductScreen
        product={selectedProduct} quantity={quantity} setQuantity={setQuantity}
        cartCount={cartCount}
        onBack={() => setScreen('home')}
        onAdd={() => { addToCart(selectedProduct, quantity); setScreen('home'); }}
        onCart={() => setScreen('cart')}
      />
    );

  return (
    <div className="root">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">🏪</div>
            <div className="brand-text">
              <h1>{STORE_NAME}</h1>
              <p>{STORE_TAGLINE}</p>
            </div>
          </div>
          <div className="header-right">
            {tab === 'shop' && (
              <button className="hbtn" onClick={() => setShowSearch(s => !s)}>
                {showSearch ? <X size={22} /> : <Search size={22} />}
              </button>
            )}
            <button className={`hbtn cart-hbtn ${cartBounce ? 'bounce' : ''}`} onClick={() => setScreen('cart')}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {tab === 'shop' && showSearch && (
          <div className="searchbar">
            <Search size={18} />
            <input autoFocus placeholder="Hanapin ang produkto..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <button onClick={() => setSearchQuery('')}><X size={16} /></button>}
          </div>
        )}

        {tab === 'shop' && (
          <div className="cats">
            {categories.map(c => (
              <button key={c.id} className={`cat ${activeCategory === c.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}>
                <span className="cat-emoji">{c.emoji}</span>
                <span className="cat-label">{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="main">
        {tab === 'shop' && (
          <ShopTab
            filteredProducts={filteredProducts} searchQuery={searchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory} setSearchQuery={setSearchQuery}
            getCartQty={getCartQty} addToCart={addToCart} updateQty={updateQty}
            openProduct={(p) => { setSelectedProduct(p); setQuantity(1); setScreen('product'); }}
          />
        )}
        {tab === 'gcash' && <GcashTab />}
        {tab === 'orders' && <OrdersTab orders={orders} />}
      </main>

      {/* STICKY CART BAR */}
      {cartCount > 0 && tab === 'shop' && (
        <div className="cartbar" onClick={() => setScreen('cart')}>
          <div className="cartbar-left">
            <span className="cartbar-count">{cartCount}</span>
            <span>View Cart</span>
          </div>
          <div className="cartbar-right">
            <span>₱{subtotal.toLocaleString()}</span>
            <ChevronRight size={18} />
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="botnav">
        <button className={`navbtn ${tab === 'shop' ? 'active' : ''}`} onClick={() => setTab('shop')}>
          <ShoppingCart size={26} /><span>Shop</span>
        </button>
        <button className={`navbtn ${tab === 'gcash' ? 'active' : ''}`} onClick={() => setTab('gcash')}>
          <Smartphone size={26} /><span>GCash</span>
        </button>
        <button className={`navbtn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <Clock size={26} /><span>My Orders</span>
          {orders.length > 0 && <span className="navbadge">{orders.length}</span>}
        </button>
        <button className="navbtn admin-nav" onClick={onAdmin}>
          <Settings size={26} /><span>Admin</span>
        </button>
      </nav>
    </div>
  );
}

// ─── SHOP TAB ────────────────────────────────────────────────────────────────
function ShopTab({ filteredProducts, searchQuery, activeCategory, setActiveCategory, setSearchQuery, getCartQty, addToCart, updateQty, openProduct }) {
  return (
    <div className="shoptab">
      {activeCategory === 'all' && !searchQuery && (
        <div className="hero">
          <div className="hero-text">
            <span className="hero-tag">📦 Fresh Stocks Daily</span>
            <h2>Welcome to<br />{STORE_NAME}!</h2>
            <p>Your neighborhood store, online</p>
          </div>
          <span className="hero-big">🏪</span>
        </div>
      )}
      <div className="products-wrap">
        <div className="section-head">
          <h3>{searchQuery ? `Results for "${searchQuery}"` : categories.find(c => c.id === activeCategory)?.name || 'All Products'}</h3>
          <span className="count-badge">{filteredProducts.length} items</span>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="empty"><span>🔍</span><p>Walang nakita.</p><button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>Show All</button></div>
        ) : (
          <div className="pgrid">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} cartQty={getCartQty(p.id)}
                onView={() => openProduct(p)} onAdd={() => addToCart(p)}
                onInc={() => updateQty(p.id, 1)} onDec={() => updateQty(p.id, -1)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, cartQty, onView, onAdd, onInc, onDec }) {
  const lowStock = product.stock <= 5;
  return (
    <div className="pcard" onClick={onView}>
      <div className="pcard-img">
        {product.image
          ? <img src={product.image} alt={product.name} />
          : <span className="pcard-emoji">{product.emoji}</span>
        }
        {product.tags.includes('bestseller') && <span className="ptag sell">Bestseller</span>}
        {product.tags.includes('popular') && !product.tags.includes('bestseller') && <span className="ptag pop">Popular</span>}
        {lowStock && <span className="ptag low">{product.stock} left!</span>}
      </div>
      <div className="pcard-body">
        <p className="pname">{product.name}</p>
        <p className="pprice">₱{product.price}</p>
        <p className="pstock">{product.stock} in stock</p>
      </div>
      <div className="pcard-foot" onClick={e => e.stopPropagation()}>
        {cartQty === 0
          ? <button className="addbtn" onClick={onAdd}><Plus size={17} /> Add</button>
          : <div className="qtyrow"><button onClick={onDec}><Minus size={15} /></button><span>{cartQty}</span><button onClick={onInc}><Plus size={15} /></button></div>
        }
      </div>
    </div>
  );
}

// ─── PRODUCT SCREEN ───────────────────────────────────────────────────────────
function ProductScreen({ product, quantity, setQuantity, onBack, onAdd, onCart, cartCount }) {
  return (
    <div className="screen">
      <header className="shead">
        <button className="backbtn" onClick={onBack}><ArrowLeft size={22} /></button>
        <span>Product Details</span>
        <button className="hbtn cart-hbtn" onClick={onCart}>
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
        </button>
      </header>
      <div className="pd-wrap">
        <div className="pd-img">
          {product.image ? <img src={product.image} alt={product.name} /> : <span>{product.emoji}</span>}
        </div>
        <div className="pd-body">
          <div className="pd-tags">
            {product.tags.includes('bestseller') && <span className="ptag sell">Bestseller</span>}
            {product.tags.includes('popular') && <span className="ptag pop">Popular</span>}
            {product.stock <= 5 && <span className="ptag low">{product.stock} left!</span>}
          </div>
          <h2 className="pd-name">{product.name}</h2>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-meta">
            <span><CheckCircle size={15} /> {product.stock} in stock</span>
            <span><Package size={15} /> {product.category}</span>
          </div>
          <div className="pd-price">₱{product.price}</div>
          <div className="pd-qty">
            <span>Quantity</span>
            <div className="qtyrow large">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={18} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><Plus size={18} /></button>
            </div>
          </div>
          <div className="pd-total">Total: <strong>₱{(product.price * quantity).toLocaleString()}</strong></div>
        </div>
      </div>
      <div className="pd-foot">
        <button className="bigbtn green" onClick={onAdd}>
          <ShoppingCart size={20} /> Add to Cart — ₱{(product.price * quantity).toLocaleString()}
        </button>
      </div>
    </div>
  );
}

// ─── CART SCREEN ─────────────────────────────────────────────────────────────
function CartScreen({ cart, updateQty, subtotal, onBack, onCheckout }) {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="screen">
      <header className="shead">
        <button className="backbtn" onClick={onBack}><ArrowLeft size={22} /></button>
        <span>My Cart ({count} items)</span>
        <div style={{ width: 44 }} />
      </header>
      {cart.length === 0
        ? <div className="empty full"><span>🛒</span><p>Cart is empty</p><button onClick={onBack}>Shop Now</button></div>
        : <>
          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <span className="ci-emoji">{item.image ? <img src={item.image} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10 }} /> : item.emoji}</span>
                <div className="ci-info">
                  <p className="ci-name">{item.name}</p>
                  <p className="ci-price">₱{item.price} each</p>
                </div>
                <div className="qtyrow">
                  <button onClick={() => updateQty(item.id, -1)}><Minus size={15} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}><Plus size={15} /></button>
                </div>
                <span className="ci-total">₱{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="srow"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
            <p className="snote">🚚 Delivery fee set at checkout based on your location</p>
            <button className="bigbtn green" onClick={onCheckout}>Proceed to Checkout <ChevronRight size={20} /></button>
          </div>
        </>
      }
    </div>
  );
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
function CheckoutScreen({ cart, subtotal, onBack, onPlace }) {
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState('');
  const [deliveryZone, setDeliveryZone] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [info, setInfo] = useState({ name: '', phone: '', address: '', note: '' });
  const [gcashRef, setGcashRef] = useState('');
  const [errors, setErrors] = useState({});
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const deliveryFee = orderType === 'deliver' && deliveryZone !== null ? DELIVERY_ZONES[deliveryZone].fee : 0;
  const total = subtotal + deliveryFee;
  const progress = Math.round((step / 5) * 100);
  const stepTitles = ['', 'Order Type', 'Payment', 'Your Info', 'GCash Payment', 'Confirm Order'];

  const validate = () => {
    const e = {};
    if (!info.name.trim()) e.name = 'Required';
    if (!info.phone.trim()) e.phone = 'Required';
    if (orderType === 'deliver' && !info.address.trim()) e.address = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProof = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file.name);
    const reader = new FileReader();
    reader.onload = ev => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const next = () => {
    if (step === 1) {
      if (!orderType || (orderType === 'deliver' && deliveryZone === null)) return;
      setStep(2);
    } else if (step === 2) {
      if (!paymentMethod) return;
      setStep(3);
    } else if (step === 3) {
      if (!validate()) return;
      setStep(paymentMethod === 'gcash' ? 4 : 5);
    } else if (step === 4) {
      if (!gcashRef.trim()) return;
      setStep(5);
    } else {
      onPlace({ orderType, deliveryZone: deliveryZone !== null ? DELIVERY_ZONES[deliveryZone] : null, paymentMethod, ...info, gcashRef, proofFile, subtotal, deliveryFee, total });
    }
  };

  const back = () => { if (step === 1) onBack(); else setStep(s => s - 1); };

  return (
    <div className="screen checkout-screen">
      <header className="shead">
        <button className="backbtn" onClick={back}><ArrowLeft size={22} /></button>
        <span>Checkout</span>
        <div style={{ width: 44 }} />
      </header>

      <div className="progress-wrap">
        <div className="pbar"><div className="pfill" style={{ width: `${progress}%` }} /></div>
        <div className="plabel">Step {step} of 5 — <strong>{stepTitles[step]}</strong><span className="ppct">{progress}%</span></div>
      </div>

      <div className="co-body">
        {/* STEP 1 — Order Type */}
        {step === 1 && (
          <div className="co-section">
            <h3 className="co-title">📦 How do you want your order?</h3>
            <div className="type-grid">
              <button className={`typebtn ${orderType === 'pickup' ? 'active' : ''}`} onClick={() => setOrderType('pickup')}>
                <Home size={32} /><span>Pick Up</span><small>No delivery fee</small>
              </button>
              <button className={`typebtn ${orderType === 'deliver' ? 'active' : ''}`} onClick={() => setOrderType('deliver')}>
                <Truck size={32} /><span>Deliver</span><small>Fee by distance</small>
              </button>
            </div>
            {orderType === 'deliver' && (
              <div className="zone-wrap">
                <p className="zone-title">📍 How far are you?</p>
                {DELIVERY_ZONES.map((z, i) => (
                  <button key={i} className={`zonebtn ${deliveryZone === i ? 'active' : ''}`} onClick={() => setDeliveryZone(i)}>
                    <span>{z.label}</span><strong>₱{z.fee}</strong>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Payment */}
        {step === 2 && (
          <div className="co-section">
            <h3 className="co-title">💳 Select Payment Method</h3>
            <div className="pay-list">
              <button className={`paybtn ${paymentMethod === 'gcash' ? 'active' : ''}`} onClick={() => setPaymentMethod('gcash')}>
                <div className="gcash-logo-sm">G</div>
                <div className="pay-text"><span>GCash</span><small>Pay via mobile wallet</small></div>
              </button>
              <button className={`paybtn ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
                <Banknote size={28} />
                <div className="pay-text"><span>Cash on Pickup</span><small>Pay when you arrive</small></div>
              </button>
              {orderType === 'deliver' && (
                <button className={`paybtn ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                  <Banknote size={28} />
                  <div className="pay-text"><span>Cash on Delivery</span><small>Pay when you receive</small></div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — Info */}
        {step === 3 && (
          <div className="co-section">
            <h3 className="co-title">👤 Your Information</h3>
            <div className="fgroup">
              <label>Full Name *</label>
              <input placeholder="Juan dela Cruz" value={info.name} onChange={e => setInfo(o => ({ ...o, name: e.target.value }))} />
              {errors.name && <span className="errtxt">{errors.name}</span>}
            </div>
            <div className="fgroup">
              <label>Phone Number *</label>
              <input placeholder="09XX XXX XXXX" value={info.phone} onChange={e => setInfo(o => ({ ...o, phone: e.target.value }))} />
              {errors.phone && <span className="errtxt">{errors.phone}</span>}
            </div>
            {orderType === 'deliver' && (
              <div className="fgroup">
                <label>Delivery Address *</label>
                <input placeholder="House no., Street, Barangay" value={info.address} onChange={e => setInfo(o => ({ ...o, address: e.target.value }))} />
                {errors.address && <span className="errtxt">{errors.address}</span>}
              </div>
            )}
            <div className="fgroup">
              <label>Note (optional)</label>
              <textarea rows={3} placeholder="Any special instructions..." value={info.note} onChange={e => setInfo(o => ({ ...o, note: e.target.value }))} />
            </div>
          </div>
        )}

        {/* STEP 4 — GCash */}
        {step === 4 && (
          <div className="co-section gcash-pay-section">
            <div className="gps-header">
              <div className="gcash-logo-lg">G</div>
              <div><h3>GCash Payment</h3><p>Send to our GCash account</p></div>
            </div>
            <div className="gps-card">
              <div className="gps-row"><span>Account Name</span><strong>{GCASH_ACCOUNT_NAME}</strong></div>
              <div className="gps-row"><span>Mobile Number</span><strong>{GCASH_NUMBER}</strong></div>
              <div className="gps-row big"><span>Amount to Send</span><strong>₱{total.toLocaleString()}</strong></div>
            </div>
            <div className="gps-steps">
              <p className="gps-step"><span>1</span> Send <strong>₱{total.toLocaleString()}</strong> to {GCASH_NUMBER}</p>
              <p className="gps-step"><span>2</span> Screenshot your payment confirmation</p>
              <p className="gps-step"><span>3</span> Enter reference number below &amp; upload screenshot</p>
            </div>
            <div className="fgroup">
              <label>GCash Reference Number *</label>
              <input placeholder="e.g. 1234567890" value={gcashRef} onChange={e => setGcashRef(e.target.value)} />
              <small>Found in your GCash transaction history</small>
            </div>
            <div className="fgroup">
              <label>Upload Payment Proof *</label>
              <label className="upload-box">
                {proofPreview
                  ? <img src={proofPreview} alt="proof" className="proof-preview" />
                  : <><Upload size={28} /><span>Tap to upload screenshot</span></>
                }
                <input type="file" accept="image/*" onChange={handleProof} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}

        {/* STEP 5 — Confirm */}
        {step === 5 && (
          <div className="co-section">
            <h3 className="co-title">🧾 Order Summary</h3>
            <div className="summ-items">
              {cart.map(item => (
                <div key={item.id} className="summ-item">
                  <span>{item.emoji} {item.name} ×{item.qty}</span>
                  <span>₱{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summ-divider" />
            <div className="srow"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
            {deliveryFee > 0 && <div className="srow"><span>Delivery ({DELIVERY_ZONES[deliveryZone]?.label})</span><span>₱{deliveryFee}</span></div>}
            <div className="srow total"><span>TOTAL</span><span>₱{total.toLocaleString()}</span></div>
            <div className="summ-divider" />
            <div className="srow"><span>Order Type</span><span>{orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'}</span></div>
            <div className="srow"><span>Payment</span><span>{paymentMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}</span></div>
            {gcashRef && <div className="srow"><span>GCash Ref</span><span>{gcashRef}</span></div>}
            <div className="srow"><span>Name</span><span>{info.name}</span></div>
            <div className="srow"><span>Phone</span><span>{info.phone}</span></div>
            {info.address && <div className="srow"><span>Address</span><span style={{ textAlign: 'right', maxWidth: '55%', fontSize: 14 }}>{info.address}</span></div>}
          </div>
        )}
      </div>

      <div className="co-foot">
        <button className={`bigbtn ${paymentMethod === 'gcash' ? 'gcashbtn' : 'green'}`} onClick={next}>
          {step === 1 && '→ Select Payment Method'}
          {step === 2 && '→ Enter Your Info'}
          {step === 3 && (paymentMethod === 'gcash' ? '📱 Proceed to GCash Payment' : '→ Review Order')}
          {step === 4 && '→ Review & Confirm Order'}
          {step === 5 && `✅ Place Order — ₱${total.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

// ─── CONFIRM SCREEN ───────────────────────────────────────────────────────────
function ConfirmScreen({ order, onHome }) {
  const steps = [
    'Order Confirmed ✅',
    'Being Prepared 📦',
    order.orderType === 'deliver' ? 'Out for Delivery 🚴' : 'Ready for Pickup 🏪',
    order.orderType === 'deliver' ? 'Delivered 🎉' : 'Picked Up 🎉',
  ];
  return (
    <div className="screen confirm-screen">
      <div className="confirm-hero">
        <div className="confirm-check">✓</div>
        <h2>Order Placed!</h2>
        <p>Salamat sa inyong order! 🙏</p>
        <div className="confirm-id">Order #{order.id}</div>
      </div>
      <div className="confirm-body">
        <div className="ccard">
          <h3>📋 Order Details</h3>
          <div className="srow"><span>Name</span><span>{order.name}</span></div>
          <div className="srow"><span>Phone</span><span>{order.phone}</span></div>
          <div className="srow"><span>Type</span><span>{order.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'}</span></div>
          {order.address && <div className="srow"><span>Address</span><span style={{ textAlign: 'right', maxWidth: '55%', fontSize: 14 }}>{order.address}</span></div>}
          <div className="srow"><span>Payment</span><span>{order.paymentMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}</span></div>
          {order.gcashRef && <div className="srow"><span>GCash Ref</span><span>{order.gcashRef}</span></div>}
          <div className="srow total"><span>Total</span><span>₱{order.total?.toLocaleString()}</span></div>
        </div>
        <div className="ccard">
          <h3>📍 Order Status</h3>
          <div className="vtracker">
            {steps.map((s, i) => (
              <div key={i} className={`vstep ${i === 0 ? 'active' : ''}`}>
                <div className="vdot" />{i < steps.length - 1 && <div className="vline" />}
                <span>{s}</span>
              </div>
            ))}
          </div>
          <p className="tnote">{order.orderType === 'deliver' ? '🕐 Est. 30–45 mins' : '🕐 Ready in 10–15 mins'}</p>
        </div>
        <div className="ccard">
          <h3>🛍️ Items Ordered</h3>
          {order.cart?.map(item => (
            <div key={item.id} className="srow">
              <span>{item.emoji} {item.name} ×{item.qty}</span>
              <span>₱{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="confirm-foot">
        <button className="bigbtn green" onClick={onHome}><Home size={20} /> Back to Store</button>
      </div>
    </div>
  );
}

// ─── GCASH TAB ────────────────────────────────────────────────────────────────
function GcashTab() {
  const [service, setService] = useState('cashin');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState(() => ls.get('celso_gcash', []));

  const amt = parseFloat(amount) || 0;
  const isValid = amt >= 100;
  const fee = isValid ? Math.ceil(amt * GCASH_SERVICE_FEE) : 0;
  const youReceive = isValid ? amt : 0;
  const youPay = isValid ? amt + fee : 0;

  const handleProof = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file.name);
    const reader = new FileReader();
    reader.onload = ev => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!isValid || !name || !number) return;
    if (service === 'cashout' && !proofFile) return;
    const req = {
      id: 'GC-' + Date.now().toString().slice(-6),
      service, amount: amt, fee, youReceive, youPay,
      name, number, status: 'pending',
      timestamp: new Date().toISOString(),
    };
    const updated = [req, ...requests];
    setRequests(updated);
    ls.set('celso_gcash', updated);
    setSubmitted(true);
    setAmount(''); setName(''); setNumber(''); setProofFile(null); setProofPreview(null);
  };

  if (submitted) return (
    <div className="gcash-tab">
      <div className="gc-submitted">
        <div className="confirm-check" style={{ margin: '0 auto 16px' }}>✓</div>
        <h3>Request Submitted!</h3>
        <p>Your <strong>{service === 'cashin' ? 'Cash In' : 'Cash Out'}</strong> request has been received.</p>
        <p style={{ marginTop: 8 }}>{service === 'cashin' ? 'Please bring your cash to Celso Store.' : 'Go to Celso Store to collect your cash.'}</p>
        <button className="bigbtn green" style={{ marginTop: 24 }} onClick={() => setSubmitted(false)}>New Request</button>
      </div>
    </div>
  );

  return (
    <div className="gcash-tab">
      {/* Header */}
      <div className="gc-header">
        <div className="gcash-logo-xl">G</div>
        <div>
          <h2>GCash Service</h2>
          <p>Cash in • Cash out • 2% fee</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="gc-tabs">
        <button className={service === 'cashin' ? 'active' : ''} onClick={() => setService('cashin')}>
          <ArrowDownCircle size={18} /> Cash In
        </button>
        <button className={service === 'cashout' ? 'active' : ''} onClick={() => setService('cashout')}>
          <ArrowUpCircle size={18} /> Cash Out
        </button>
      </div>

      {/* Cash Out — show GCash number to send to */}
      {service === 'cashout' && (
        <div className="gc-send-card">
          <p className="gc-send-label">Send money to:</p>
          <div className="gc-number-big">{GCASH_NUMBER}</div>
          <div className="gc-acct-name">Name: {GCASH_ACCOUNT_NAME}</div>
        </div>
      )}

      <div className="gc-card">
        {/* Amount */}
        <div className="fgroup">
          <label>Amount you'll receive</label>
          <div className="amt-wrap">
            <span className="amt-peso">₱</span>
            <input type="number" className="amt-input" placeholder="0.00" min="100"
              value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <small className="amt-min">Minimum: ₱100.00</small>
          {amount && !isValid && <span className="errtxt">Minimum amount is ₱100</span>}
        </div>

        {/* Fee Breakdown */}
        {isValid && (
          <div className="gc-breakdown">
            <div className="gc-br-row"><span>Service fee (2%)</span><span>₱{fee.toLocaleString()}</span></div>
            <div className="gc-br-row total">
              <span>{service === 'cashin' ? 'You pay' : 'You send'}</span>
              <span>₱{youPay.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Name & Number */}
        <div className="fgroup">
          <label>Your Name</label>
          <input placeholder="Juan dela Cruz" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fgroup">
          <label>Your GCash Number</label>
          <input placeholder="09XX XXX XXXX" value={number} onChange={e => setNumber(e.target.value)} />
        </div>

        {/* Cash Out: upload proof */}
        {service === 'cashout' && (
          <div className="fgroup">
            <label>Upload Payment Proof</label>
            <label className="upload-box">
              {proofPreview
                ? <img src={proofPreview} alt="proof" className="proof-preview" />
                : <><Upload size={26} /><span>Tap to upload screenshot</span></>
              }
              <input type="file" accept="image/*" onChange={handleProof} style={{ display: 'none' }} />
            </label>
          </div>
        )}

        {/* Instructions */}
        <div className="gc-instructions">
          <p className="gc-instr-title">{service === 'cashin' ? 'Cash-In Instructions' : 'Cash-Out Instructions'}</p>
          {service === 'cashin' ? (
            <>
              <div className="gc-step"><span>1</span><p>Bring <strong>₱{isValid ? youPay.toLocaleString() : '___'}</strong> cash to Celso Store</p></div>
              <div className="gc-step"><span>2</span><p>You'll receive <strong>₱{isValid ? youReceive.toLocaleString() : '___'}</strong> in GCash</p></div>
              <div className="gc-step"><span>3</span><p>Wait for admin confirmation</p></div>
            </>
          ) : (
            <>
              <div className="gc-step"><span>1</span><p>Send <strong>₱{isValid ? youPay.toLocaleString() : '___'}</strong> to the GCash number above</p></div>
              <div className="gc-step"><span>2</span><p>Upload your payment proof screenshot</p></div>
              <div className="gc-step"><span>3</span><p>Go to Celso Store to collect <strong>₱{isValid ? youReceive.toLocaleString() : '___'}</strong> cash</p></div>
            </>
          )}
        </div>

        <button className="bigbtn gcashbtn" onClick={submit}
          style={{ opacity: (!isValid || !name || !number || (service === 'cashout' && !proofFile)) ? 0.5 : 1 }}>
          <Send size={18} /> Submit Request →
        </button>
      </div>

      {/* Recent */}
      {requests.length > 0 && (
        <div className="gc-history">
          <h4>Recent Requests</h4>
          {requests.slice(0, 5).map(r => (
            <div key={r.id} className="gc-req">
              <span className={`req-type ${r.service}`}>{r.service === 'cashin' ? '↓ Cash In' : '↑ Cash Out'}</span>
              <span className="req-id">#{r.id}</span>
              <span className="req-amt">₱{r.amount.toLocaleString()}</span>
              <span className={`req-status ${r.status}`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
function OrdersTab({ orders }) {
  if (orders.length === 0) return (
    <div className="orders-tab">
      <div className="empty" style={{ paddingTop: 80 }}>
        <span>📦</span><p>No orders yet</p>
        <small style={{ color: '#aaa', fontSize: 14 }}>Your order history will appear here</small>
      </div>
    </div>
  );
  const sc = { pending: '#f7c843', preparing: '#3b82f6', ready: '#8b5cf6', delivered: '#22c55e' };
  return (
    <div className="orders-tab">
      <div className="orders-toprow"><h3>📋 Order History</h3><span>{orders.length} orders</span></div>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="ocard">
            <div className="ocard-top">
              <div><span className="ocard-id">#{order.id}</span><span className="ocard-time"> {new Date(order.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
              <span className="ostatus" style={{ background: sc[order.status] || '#f7c843' }}>{order.status}</span>
            </div>
            <div className="ocard-items">{order.cart?.slice(0, 3).map(i => <span key={i.id}>{i.emoji} {i.name} ×{i.qty}  </span>)}{order.cart?.length > 3 && <span>+{order.cart.length - 3} more</span>}</div>
            <div className="ocard-foot">
              <span>{order.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'} • {order.paymentMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}</span>
              <strong>₱{order.total?.toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onAuth, onBack }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const login = () => {
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr('Wrong password. Try again.'); setPw(''); }
  };

  return (
    <div className="admin-login">
      <button className="backbtn" style={{ margin: '16px' }} onClick={onBack}><ArrowLeft size={22} /></button>
      <div className="login-card">
        <div className="login-icon"><Lock size={32} /></div>
        <h2>Admin Panel</h2>
        <p>Enter your password to continue</p>
        <div className="fgroup" style={{ marginTop: 24 }}>
          <label>Password</label>
          <div className="pw-wrap">
            <input type={show ? 'text' : 'password'} placeholder="Enter password" value={pw}
              onChange={e => { setPw(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && login()} />
            <button className="pw-eye" onClick={() => setShow(s => !s)}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {err && <span className="errtxt">{err}</span>}
        </div>
        <button className="bigbtn green" style={{ marginTop: 8 }} onClick={login}>
          <Lock size={18} /> Login to Admin
        </button>
        <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 12 }}>Default password: celso2024</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState(() => ls.get('celso_orders', []));
  const [gcashReqs, setGcashReqs] = useState(() => ls.get('celso_gcash', []));

  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    ls.set('celso_orders', updated);
  };

  const updateGcashStatus = (id, status) => {
    const updated = gcashReqs.map(r => r.id === id ? { ...r, status } : r);
    setGcashReqs(updated);
    ls.set('celso_gcash', updated);
  };

  const pending = orders.filter(o => o.status === 'pending').length;
  const todaySales = orders.filter(o => {
    const d = new Date(o.timestamp);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  }).reduce((s, o) => s + (o.total || 0), 0);

  const statusOptions = ['pending', 'preparing', 'ready', 'delivered'];
  const statusColor = { pending: '#f7c843', preparing: '#3b82f6', ready: '#8b5cf6', delivered: '#22c55e' };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-brand">
          <Settings size={22} />
          <div><h2>Admin Panel</h2><p>{STORE_NAME}</p></div>
        </div>
        <button className="logout-btn" onClick={onLogout}><LogOut size={20} /></button>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <Bell size={20} />
          <div><span className="stat-num">{pending}</span><span className="stat-label">Pending</span></div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} />
          <div><span className="stat-num">₱{todaySales.toLocaleString()}</span><span className="stat-label">Today's Sales</span></div>
        </div>
        <div className="stat-card">
          <Users size={20} />
          <div><span className="stat-num">{orders.length}</span><span className="stat-label">Total Orders</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          📦 Orders {pending > 0 && <span className="navbadge" style={{ position: 'static', marginLeft: 6 }}>{pending}</span>}
        </button>
        <button className={tab === 'gcash' ? 'active' : ''} onClick={() => setTab('gcash')}>
          💚 GCash Requests
        </button>
      </div>

      <div className="admin-body">
        {tab === 'orders' && (
          <div className="admin-orders">
            {orders.length === 0
              ? <div className="empty"><span>📦</span><p>No orders yet</p></div>
              : orders.map(order => (
                <div key={order.id} className="admin-ocard">
                  <div className="aoc-top">
                    <div>
                      <span className="ocard-id">#{order.id}</span>
                      <span className="ocard-time"> {new Date(order.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="ostatus" style={{ background: statusColor[order.status] || '#f7c843' }}>{order.status}</span>
                  </div>
                  <div className="aoc-info">
                    <p><strong>{order.name}</strong> · {order.phone}</p>
                    {order.address && <p style={{ fontSize: 13, color: '#666' }}>📍 {order.address}</p>}
                    <p style={{ fontSize: 13 }}>{order.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'} · {order.paymentMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}</p>
                    {order.gcashRef && <p style={{ fontSize: 13, color: '#00a651' }}>GCash Ref: {order.gcashRef}</p>}
                  </div>
                  <div className="aoc-items">
                    {order.cart?.map(i => (
                      <span key={i.id} className="aoc-item">{i.emoji} {i.name} ×{i.qty}</span>
                    ))}
                  </div>
                  <div className="aoc-foot">
                    <strong style={{ fontSize: 16 }}>₱{order.total?.toLocaleString()}</strong>
                    <div className="status-btns">
                      {statusOptions.map(s => (
                        <button key={s} className={`sbtn ${order.status === s ? 'active' : ''}`}
                          style={{ '--sc': statusColor[s] }}
                          onClick={() => updateOrderStatus(order.id, s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'gcash' && (
          <div className="admin-gcash">
            {gcashReqs.length === 0
              ? <div className="empty"><span>💚</span><p>No GCash requests yet</p></div>
              : gcashReqs.map(req => (
                <div key={req.id} className="admin-ocard">
                  <div className="aoc-top">
                    <div>
                      <span className={`req-type ${req.service}`}>{req.service === 'cashin' ? '↓ Cash In' : '↑ Cash Out'}</span>
                      <span className="req-id"> #{req.id}</span>
                      <span className="ocard-time"> {new Date(req.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="ostatus" style={{ background: req.status === 'done' ? '#22c55e' : '#f7c843' }}>{req.status}</span>
                  </div>
                  <div className="aoc-info">
                    <p><strong>{req.name}</strong> · {req.number}</p>
                    <p style={{ fontSize: 13 }}>Amount: <strong>₱{req.amount?.toLocaleString()}</strong> · Fee: ₱{req.fee} · They {req.service === 'cashin' ? 'pay' : 'send'}: ₱{req.youPay?.toLocaleString()}</p>
                  </div>
                  <div className="aoc-foot">
                    <div />
                    <div className="status-btns">
                      {['pending', 'done'].map(s => (
                        <button key={s} className={`sbtn ${req.status === s ? 'active' : ''}`}
                          style={{ '--sc': s === 'done' ? '#22c55e' : '#f7c843' }}
                          onClick={() => updateGcashStatus(req.id, s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
