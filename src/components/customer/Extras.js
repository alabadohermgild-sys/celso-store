import React, { useState } from 'react';
import { CONFIG, ls, dbAddGcash } from '../../lib/config';
import { QtyControl, StatusBadge, EmptyState } from '../shared/UI';
import { ArrowDownCircle, ArrowUpCircle, Upload, Send, Shield, Zap } from 'lucide-react';

function PageFooter() {
  const [showContact, setShowContact] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  return (
    <>
      <footer className="mt-12 border-t border-gray-200 pt-8 pb-6 px-4 text-center">
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
              <p><strong className="text-gray-900">1. Orders</strong><br/>All orders placed through Celso Store are subject to availability. We reserve the right to cancel orders if items are out of stock.</p>
              <p><strong className="text-gray-900">2. Payments</strong><br/>We accept GCash and cash payments. GCash payments require a valid reference number and screenshot as proof. A 2% processing fee applies to GCash orders.</p>
              <p><strong className="text-gray-900">3. Delivery</strong><br/>Delivery fees vary by distance. Estimated delivery time is 30-45 minutes. We are not responsible for delays caused by weather or other external factors.</p>
              <p><strong className="text-gray-900">4. GCash Services</strong><br/>Cash-in and cash-out services are available with a 3% service fee. Minimum transaction is ₱100. Transactions are processed during store hours only.</p>
              <p><strong className="text-gray-900">5. Refunds</strong><br/>Refunds are only granted for items that are incorrect or defective. Contact us within 24 hours of receiving your order.</p>
              <p><strong className="text-gray-900">6. Contact</strong><br/>For concerns, reach us at alabadohermgild@gmail.com or 0981 269 3563.</p>
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
              <p><strong className="text-gray-900">Information We Collect</strong><br/>We collect your name, phone number, and delivery address solely to process your orders. We do not share this information with third parties.</p>
              <p><strong className="text-gray-900">GCash Payments</strong><br/>Payment screenshots and reference numbers are collected only for order verification. They are stored locally and not transmitted to external servers.</p>
              <p><strong className="text-gray-900">Data Storage</strong><br/>Your order history and cart are stored locally on your device. We do not maintain a centralized database of customer information.</p>
              <p><strong className="text-gray-900">Cookies</strong><br/>We use browser local storage to remember your cart and preferences. No tracking cookies are used.</p>
              <p><strong className="text-gray-900">Contact</strong><br/>For privacy concerns, email us at alabadohermgild@gmail.com.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── ORDER CONFIRMATION ─────────────────────────────────────────────────────────
export function OrderConfirm({ order, onClose }) {
  const trackSteps = [
    { label: 'Order Confirmed', done: true },
    { label: 'Being Prepared', done: false },
    { label: order.orderType === 'deliver' ? 'Out for Delivery' : 'Ready for Pickup', done: false },
    { label: order.orderType === 'deliver' ? 'Delivered' : 'Picked Up', done: false },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-green-600 to-green-500 px-6 py-8 text-center rounded-t-2xl">
          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-900 text-gray-900">✓</div>
          <h2 className="text-2xl font-900 text-white mb-1">Order Placed!</h2>
          <p className="text-green-100 font-600 text-sm mb-3">Salamat sa inyong order! 🙏</p>
          <span className="bg-white/20 text-white font-700 text-sm px-4 py-1.5 rounded-full">Order #{order.id}</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            {[
              ['Name', order.name],
              ['Phone', order.phone],
              ['Type', order.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'],
              order.address && ['Address', order.address],
              ['Payment', order.payMethod === 'gcash' ? '📱 GCash' : '💵 Cash'],
              order.gcashRef && ['GCash Ref', order.gcashRef],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500 font-700">{k}</span>
                <span className="font-700 text-gray-800 text-right max-w-xs">{v}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-200 pt-2 font-900">
              <span className="text-gray-700">Total</span>
              <span className="text-green-600 text-lg">₱{order.total?.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-800 text-gray-900 mb-4 text-sm">Order Status</p>
            <div className="space-y-3">
              {trackSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${s.done ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <span className={`text-sm font-700 ${s.done ? 'text-green-700' : 'text-gray-500'}`}>{s.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-700 mt-4">🕐 {order.orderType === 'deliver' ? 'Est. 30–45 mins' : 'Ready in 10–15 mins'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-800 text-gray-900 mb-3 text-sm">Items Ordered</p>
            <div className="space-y-2">
              {order.cart?.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-600">{item.emoji} {item.name} ×{item.qty} <span className="text-gray-400 text-xs">({item.unit || 'per piece'})</span></span>
                  <span className="font-800 text-gray-900">₱{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-800 py-4 rounded-xl text-base transition-all active:scale-95 flex items-center justify-center gap-2">
            🏪 Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT MODAL ─────────────────────────────────────────────────────────────
export function ProductModal({ product, cartQty, onAdd, onUpdateQty, onClose }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-green-50 flex items-center justify-center h-48 sm:h-60 relative overflow-hidden">
          {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-8xl">{product.emoji}</span>}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-gray-700 font-700 text-lg shadow-sm hover:bg-white transition-colors">×</button>
          {product.tags?.includes('bestseller') && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-800 px-3 py-1 rounded-full">Bestseller</span>}
        </div>
        <div className="p-5">
          <h2 className="text-xl font-900 text-gray-900 mb-1">{product.name}</h2>
          <p className="text-sm text-gray-600 font-600 mb-3">{product.description}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-100 text-green-800 text-xs font-700 px-2.5 py-1 rounded-full">✓ {product.stock} in stock</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-700 px-2.5 py-1 rounded-full">{product.category}</span>
          </div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-baseline gap-2"><span className="text-3xl font-900 text-green-600">₱{product.price}</span><span className="text-xs font-800 text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{product.unit || 'per piece'}</span></div>
            {cartQty === 0
              ? <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-800 hover:bg-green-700">−</button>
                  <span className="text-base font-800 w-6 text-center text-gray-900">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-800 hover:bg-green-700">+</button>
                </div>
              : <QtyControl qty={cartQty} onInc={() => onUpdateQty(1)} onDec={() => onUpdateQty(-1)} />
            }
          </div>
          <button onClick={() => onAdd(qty)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-800 py-4 rounded-xl text-base transition-all active:scale-95 flex items-center justify-center gap-2">
            🛒 Add to Cart — ₱{(product.price * qty).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── GCASH SERVICES ─────────────────────────────────────────────────────────────
export function GcashServices() {
  const [service, setService] = useState('cashin');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [proofPreview, setProofPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requests, setRequests] = useState([]);

  const amt = parseFloat(amount) || 0;
  const isValid = amt >= 100;
  const fee = isValid ? Math.ceil(amt * CONFIG.gcashServiceFee) : 0;   // 3%
  const youReceive = isValid ? amt : 0;
  const youPay = isValid ? amt + fee : 0;

  const handleProof = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(CONFIG.gcashNumber.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const submit = async () => {
    if (!isValid || !name || !number) return;
    if (service === 'cashout' && !proofPreview) return;
    const req = {
      id: 'GC-' + Date.now().toString().slice(-6),
      service, amount: amt, fee, youReceive, youPay,
      name, number,
      proofPreview,        // ← screenshot image included here
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setSubmitted(true);
    setAmount(''); setName(''); setNumber(''); setProofPreview(null);
    // Save to shared database so admin sees it from any device
    try {
      const updatedReqs = await dbAddGcash(req);
      setRequests(updatedReqs);
    } catch(e) {
      setRequests(prev => [req, ...prev]);
    }
  };

  if (submitted) return (
    <div className="p-8 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-900 text-emerald-700 mb-2">Request Submitted!</h3>
        <p className="text-gray-600 font-700 text-sm mb-2">
          Your <strong>{service === 'cashin' ? 'Cash In' : 'Cash Out'}</strong> request has been received.
        </p>
        <p className="text-gray-500 text-sm font-600 mb-6">
          {service === 'cashin' ? 'Please bring your cash to Celso Store.' : 'Go to Celso Store to collect your cash.'}
        </p>
        <button onClick={() => setSubmitted(false)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-800 py-3.5 rounded-xl transition-all active:scale-95">
          New Request
        </button>
      </div>
      <PageFooter />
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 mb-6 flex items-center gap-4 text-white shadow-lg">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-900">G</div>
        <div>
          <h2 className="text-2xl font-900">GCash Service</h2>
          <p className="text-emerald-100 font-700 text-sm mt-0.5">Cash in • Cash out • 3% service fee</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
        {[
          { id: 'cashin', icon: <ArrowDownCircle size={18} />, label: 'Cash In' },
          { id: 'cashout', icon: <ArrowUpCircle size={18} />, label: 'Cash Out' },
        ].map(t => (
          <button key={t.id} onClick={() => setService(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-800 transition-all ${service === t.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          {/* Cash Out: show GCash number with copy button */}
          {service === 'cashout' && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 font-700 mb-1">Send money to</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-900 text-emerald-700 tracking-widest">{CONFIG.gcashNumber}</p>
                <button onClick={copyNumber}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-800 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100'}`}>
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-600 font-700 mt-1">Name: {CONFIG.gcashName}</p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-2">Amount you'll receive</label>
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
              <span className="px-4 bg-gray-50 flex items-center text-xl font-900 text-gray-600 border-r border-gray-200">₱</span>
              <input type="number" placeholder="0.00" min="100" value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 px-4 py-3.5 text-xl font-800 outline-none text-gray-900" />
            </div>
            <p className="text-xs text-gray-500 font-700 mt-1">Minimum: ₱100.00</p>
            {amount && !isValid && <p className="text-xs text-red-600 font-700 mt-1">Minimum amount is ₱100</p>}
          </div>

          {/* Fee breakdown */}
          {isValid && (
            <div className="bg-emerald-50 rounded-xl p-4 space-y-2 border border-emerald-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-700">Service fee (3%)</span>
                <span className="font-800 text-gray-900">₱{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-900 text-base border-t border-emerald-200 pt-2">
                <span className="text-gray-800">{service === 'cashin' ? 'You pay' : 'You send'}</span>
                <span className="text-emerald-700">₱{youPay.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Name & Number */}
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Your Name</label>
            <input placeholder="Lebron James" value={name} onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-emerald-500 transition-colors text-gray-900" />
          </div>
          <div>
            <label className="text-sm font-800 text-gray-800 block mb-1.5">Your GCash Number</label>
            <input placeholder="09XX XXX XXXX" value={number} onChange={e => setNumber(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-emerald-500 transition-colors text-gray-900" />
          </div>

          {/* Cash Out: upload proof */}
          {service === 'cashout' && (
            <div>
              <label className="text-sm font-800 text-gray-800 block mb-1.5">Upload Payment Proof</label>
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                {proofPreview
                  ? <img src={proofPreview} alt="proof" className="max-h-36 rounded-lg object-contain" />
                  : <><Upload size={24} className="text-gray-400" /><span className="text-sm text-gray-500 font-600">Tap to upload screenshot</span></>
                }
                <input type="file" accept="image/*" onChange={handleProof} className="hidden" />
              </label>
            </div>
          )}

          <button onClick={submit}
            disabled={!isValid || !name || !number || (service === 'cashout' && !proofPreview)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-800 py-4 rounded-xl text-base transition-all active:scale-95">
            <Send size={18} /> Submit Request →
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="font-900 text-gray-900 mb-4 text-base">
              {service === 'cashin' ? '📥 Cash-In Instructions' : '📤 Cash-Out Instructions'}
            </p>
            <div className="space-y-4">
              {(service === 'cashin' ? [
                { n: 1, text: `Bring <strong class="text-emerald-700">₱${isValid ? youPay.toLocaleString() : '___'}</strong> cash to Celso Store` },
                { n: 2, text: `You'll receive <strong class="text-emerald-700">₱${isValid ? youReceive.toLocaleString() : '___'}</strong> in GCash` },
                { n: 3, text: 'Wait for admin confirmation' },
              ] : [
                { n: 1, text: `Send <strong class="text-emerald-700">₱${isValid ? youPay.toLocaleString() : '___'}</strong> to the GCash number above` },
                { n: 2, text: 'Upload your payment proof screenshot' },
                { n: 3, text: `Go to Celso Store to collect <strong class="text-emerald-700">₱${isValid ? youReceive.toLocaleString() : '___'}</strong> cash` },
              ]).map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <span className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-900 flex-shrink-0">{s.n}</span>
                  <p className="text-sm text-gray-700 font-600 leading-relaxed pt-1" dangerouslySetInnerHTML={{ __html: s.text }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
            <div className="flex gap-2 items-center text-sm text-gray-700 font-700"><Shield size={15} className="text-emerald-500 flex-shrink-0" /> Safe and monitored transactions</div>
            <div className="flex gap-2 items-center text-sm text-gray-700 font-700"><Zap size={15} className="text-emerald-500 flex-shrink-0" /> 3% service fee • Minimum ₱100</div>
          </div>

          {/* Recent requests */}
          {requests.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <p className="font-800 text-gray-900 mb-3 text-sm">Recent Requests</p>
              <div className="space-y-2">
                {requests.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-800 text-base ${r.service === 'cashin' ? 'text-emerald-600' : 'text-red-500'}`}>{r.service === 'cashin' ? '↓' : '↑'}</span>
                      <span className="text-gray-600 font-700">#{r.id}</span>
                    </div>
                    <span className="font-800 text-gray-900">₱{r.amount?.toLocaleString()}</span>
                    <span className={`text-xs font-800 px-2.5 py-1 rounded-full ${r.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

// ── MY ORDERS ─────────────────────────────────────────────────────────────────
export function MyOrders({ orders }) {
  if (orders.length === 0) return (
    <div className="p-8">
      <EmptyState emoji="📦" title="No orders yet" subtitle="Your order history will appear here after you place your first order." />
      <PageFooter />
    </div>
  );

  const sc = {
    pending:   'bg-amber-100 text-amber-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready:     'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-900 text-gray-900">Order History</h3>
          <span className="text-sm text-gray-500 font-700">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <span className="font-900 text-gray-900 text-base">#{o.id}</span>
                  <span className="text-gray-500 text-xs font-700 ml-2">
                    {new Date(o.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-800 uppercase tracking-wide ${sc[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
              </div>
              <div className="px-5 py-3 flex flex-wrap gap-1.5">
                {o.cart?.slice(0, 4).map(item => (
                  <span key={item.id} className="bg-gray-100 text-gray-700 text-xs font-700 px-2.5 py-1 rounded-lg">{item.emoji} {item.name} ×{item.qty}</span>
                ))}
                {o.cart?.length > 4 && <span className="bg-gray-100 text-gray-600 text-xs font-700 px-2.5 py-1 rounded-lg">+{o.cart.length - 4} more</span>}
              </div>
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-xs text-gray-600 font-700">
                  {o.orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'} · {o.payMethod === 'gcash' ? '📱 GCash' : '💵 Cash'}
                </span>
                <span className="text-lg font-900 text-green-600">₱{o.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <PageFooter />
      </div>
    </div>
  );
}

export default { OrderConfirm, ProductModal, GcashServices, MyOrders };
