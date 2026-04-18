import React, { useState } from 'react';
import { CONFIG, ls } from '../../lib/config';
import { Upload } from 'lucide-react';

const STEPS = ['Order Type', 'Payment', 'Your Info', 'GCash Payment', 'Confirm'];

function Footer() {
  return (
    <div className="text-center py-4 px-4 border-t border-gray-100 mt-2">
      <p className="text-xs text-gray-600 font-700">Celso Store • Happy to serve you.☺️</p>
      <p className="text-xs text-gray-500 font-600 mt-0.5">Secure checkout • No account needed • Fast delivery</p>
    </div>
  );
}

export default function CheckoutFlow({ cart, subtotal, onClose, onPlace }) {
  const [step, setStep] = useState(0);
  const [orderType, setOrderType] = useState('');
  const [zoneIdx, setZoneIdx] = useState(null);
  const [payMethod, setPayMethod] = useState('');
  const [info, setInfo] = useState(() => {
    const saved = ls.get('celso_customer', {});
    return { name: saved.name || '', phone: saved.phone || '', address: '', note: '' };
  });
  const [gcashRef, setGcashRef] = useState('');
  const [proofPreview, setProofPreview] = useState(null);
  const [errors] = useState({});
  const [nameSaved, setNameSaved] = useState(() => !!ls.get('celso_customer', {}).name);
  const [copied, setCopied] = useState(false);

  const zone = zoneIdx !== null ? CONFIG.deliveryZones[zoneIdx] : null;
  const deliveryFee = orderType === 'deliver' && zone ? zone.fee : 0;
  const gcashFee = payMethod === 'gcash' ? Math.round(subtotal * CONFIG.gcashOrderFee) : 0;
  const total = subtotal + deliveryFee + gcashFee;

  const canNext = () => {
    if (step === 0) return orderType && (orderType === 'pickup' || zoneIdx !== null);
    if (step === 1) return !!payMethod;
    if (step === 2) return info.name.trim() && info.phone.trim() && (orderType === 'pickup' || info.address.trim());
    if (step === 3) return !!gcashRef.trim();
    return true;
  };

  const next = () => {
    if (!canNext()) return;
    if (step === 2) {
      // Save customer name/phone for next time
      ls.set('celso_customer', { name: info.name, phone: info.phone });
      setNameSaved(false);
    }
    if (step === 1 && payMethod !== 'gcash') { setStep(2); return; }
    if (step === 2 && payMethod !== 'gcash') { setStep(4); return; }
    if (step === 4) {
      onPlace({ orderType, deliveryZone: zone, payMethod, ...info, gcashRef, proofPreview, subtotal, deliveryFee, gcashFee, total });
      return;
    }
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 4 && payMethod !== 'gcash') { setStep(2); return; }
    if (step === 0) { onClose(); return; }
    setStep(s => s - 1);
  };

  const handleProof = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const copyGcash = () => {
    navigator.clipboard.writeText(CONFIG.gcashNumber.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const visibleSteps = payMethod !== 'gcash' ? [0, 1, 2, 4] : [0, 1, 2, 3, 4];
  const progress = Math.round(((visibleSteps.indexOf(step) + 1) / visibleSteps.length) * 100);
  const savedCustomer = ls.get('celso_customer', {});

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[92vh] rounded-t-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
          <div>
            <p className="text-xs text-gray-400 font-700 uppercase tracking-wide">
              Step {visibleSteps.indexOf(step) + 1} of {visibleSteps.length} — {STEPS[step]}
            </p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full w-52">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-700 text-xl hover:bg-gray-200 transition-colors">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">

            {/* STEP 0 — Order Type */}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-900 text-gray-900">How do you want your order?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'pickup', emoji: '🏪', label: 'Pick Up', sub: 'No delivery fee' },
                    { id: 'deliver', emoji: '🚴', label: 'Delivery', sub: 'Fee by distance' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setOrderType(t.id)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all font-700 ${orderType === t.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-base">{t.label}</span>
                      <span className="text-xs text-gray-600 font-700">{t.sub}</span>
                    </button>
                  ))}
                </div>
                {orderType === 'deliver' && (
                  <div className="mt-2">
                    <p className="text-sm font-800 text-gray-700 mb-3">📍 How far are you?</p>
                    <div className="space-y-2">
                      {CONFIG.deliveryZones.map((z, i) => (
                        <button key={i} onClick={() => setZoneIdx(i)}
                          className={`w-full flex justify-between items-center px-4 py-3.5 rounded-xl border-2 text-sm font-700 transition-all ${zoneIdx === i ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                          <span>{z.label}</span><strong className="text-base">₱{z.fee}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-900 text-gray-900">Select Payment Method</h3>
                <p className="text-sm text-gray-500 font-600">GCash payments include a 2% processing fee.</p>
                <div className="space-y-3">
                  {/* GCash always shown */}
                  <button onClick={() => setPayMethod('gcash')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === 'gcash' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-900 text-xl">G</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-800 text-gray-900">GCash</p>
                      <p className="text-xs text-gray-500 font-600 mt-0.5">Pay via mobile wallet • +2% fee</p>
                    </div>
                    {payMethod === 'gcash' && <span className="text-emerald-500 text-xl">✓</span>}
                  </button>

                  {/* Cash on Pickup — only for pickup orders */}
                  {orderType === 'pickup' && (
                    <button onClick={() => setPayMethod('cash')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💵</div>
                      <div className="flex-1">
                        <p className="font-800 text-gray-900">Cash on Pickup</p>
                        <p className="text-xs text-gray-500 font-600 mt-0.5">Pay when you arrive at the store</p>
                      </div>
                      {payMethod === 'cash' && <span className="text-green-500 text-xl">✓</span>}
                    </button>
                  )}

                  {/* COD — only for delivery orders */}
                  {orderType === 'deliver' && (
                    <button onClick={() => setPayMethod('cod')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💵</div>
                      <div className="flex-1">
                        <p className="font-800 text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500 font-600 mt-0.5">Pay when your order arrives</p>
                      </div>
                      {payMethod === 'cod' && <span className="text-green-500 text-xl">✓</span>}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 — Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-900 text-gray-900">Your Information</h3>

                {/* Returning customer greeting */}
                {nameSaved && savedCustomer.name && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-800 text-green-700">Welcome back, {savedCustomer.name.split(' ')[0]}! 👋</p>
                    <p className="text-xs text-green-600 font-600 mt-0.5">We've saved your name for faster checkout next time.</p>
                    <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                      <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-700 font-700">Please use your real name for order verification at pickup.</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-800 text-gray-700 block mb-1.5">Full Name *</label>
                  <input placeholder="Zayn Malik" value={info.name}
                    onChange={e => setInfo(o => ({ ...o, name: e.target.value }))}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-green-500'}`} />
                  {errors.name && <p className="text-xs text-red-600 font-700 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-800 text-gray-700 block mb-1.5">Phone Number *</label>
                  <input placeholder="09XX XXX XXXX" value={info.phone}
                    onChange={e => setInfo(o => ({ ...o, phone: e.target.value }))}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-green-500'}`} />
                  {errors.phone && <p className="text-xs text-red-600 font-700 mt-1">{errors.phone}</p>}
                </div>
                {orderType === 'deliver' && (
                  <div>
                    <label className="text-sm font-800 text-gray-700 block mb-1.5">Delivery Address *</label>
                    <input placeholder="House no., Street, Barangay" value={info.address}
                      onChange={e => setInfo(o => ({ ...o, address: e.target.value }))}
                      className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-colors ${errors.address ? 'border-red-400' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.address && <p className="text-xs text-red-600 font-700 mt-1">{errors.address}</p>}
                  </div>
                )}
                <div>
                  <label className="text-sm font-800 text-gray-700 block mb-1.5">Note (optional)</label>
                  <textarea placeholder="Any special instructions..." rows={2} value={info.note}
                    onChange={e => setInfo(o => ({ ...o, note: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none resize-none focus:border-green-500" />
                </div>
              </div>
            )}

            {/* STEP 3 — GCash */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-900 text-2xl flex-shrink-0">G</div>
                  <div>
                    <h3 className="text-lg font-900 text-gray-900">GCash Payment</h3>
                    <p className="text-sm text-gray-500 font-600">Send to our GCash account</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-700">Account Name</span>
                    <strong className="text-gray-900">{CONFIG.gcashName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-700">Mobile Number</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-gray-900 font-900 text-base tracking-wide">{CONFIG.gcashNumber}</strong>
                      <button onClick={copyGcash}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-800 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100'}`}>
                        {copied ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-emerald-200 pt-3 space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">Subtotal</span><span className="font-700 text-gray-900">₱{subtotal.toLocaleString()}</span></div>
                    {deliveryFee > 0 && <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">Delivery</span><span className="font-700 text-gray-900">₱{deliveryFee}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">GCash fee (2%)</span><span className="font-700 text-orange-600">+₱{gcashFee}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700 font-800">Amount to Send</span><strong className="text-emerald-600 text-2xl font-900">₱{total.toLocaleString()}</strong></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {[
                    `Send exactly ₱${total.toLocaleString()} to ${CONFIG.gcashNumber}`,
                    'Screenshot your payment confirmation',
                    'Enter reference number below and upload screenshot',
                  ].map((s, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-900 flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-700 font-600">{s}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-800 text-gray-700 block mb-1.5">GCash Reference Number *</label>
                  <input placeholder="e.g. 1234567890" value={gcashRef} onChange={e => setGcashRef(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-emerald-500 transition-colors" />
                  <p className="text-xs text-gray-400 font-600 mt-1">Found in your GCash transaction history</p>
                </div>

                <div>
                  <label className="text-sm font-800 text-gray-700 block mb-1.5">Upload Payment Screenshot *</label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                    {proofPreview
                      ? <img src={proofPreview} alt="proof" className="max-h-48 rounded-lg object-contain" />
                      : <><Upload size={28} className="text-gray-400" /><span className="text-sm text-gray-500 font-600">Tap to upload screenshot</span></>
                    }
                    <input type="file" accept="image/*" onChange={handleProof} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-900 text-gray-900">Order Summary</h3>
                <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between px-4 py-3 text-sm">
                      <span className="text-gray-700 font-600">{item.emoji} {item.name} ×{item.qty}</span>
                      <span className="font-800 text-gray-900">₱{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 px-1">
                  <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">Subtotal</span><span className="font-700 text-gray-900">₱{subtotal.toLocaleString()}</span></div>
                  {deliveryFee > 0 && <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">Delivery ({zone?.label})</span><span className="font-700 text-gray-900">₱{deliveryFee}</span></div>}
                  {gcashFee > 0 && <div className="flex justify-between text-sm"><span className="text-gray-700 font-700">GCash fee (2%)</span><span className="font-700 text-orange-600">+₱{gcashFee}</span></div>}
                  <div className="flex justify-between font-900 text-base border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600 text-xl">₱{total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 space-y-2 text-sm">
                  {[
                    ['Type', orderType === 'deliver' ? '🚴 Delivery' : '🏪 Pickup'],
                    ['Payment', payMethod === 'gcash' ? '📱 GCash' : '💵 Cash'],
                    gcashRef && ['GCash Ref', gcashRef],
                    ['Name', info.name],
                    ['Phone', info.phone],
                    info.address && ['Address', info.address],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-700 font-700">{k}</span>
                      <span className="font-700 text-gray-900 text-right max-w-xs text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>

        {/* Footer buttons */}
        <div className="border-t border-gray-100 p-4 flex gap-3 flex-shrink-0 bg-white">
          <button onClick={back}
            className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-700 text-gray-600 hover:bg-gray-50 transition-all">
            ← Back
          </button>
          <button onClick={next} disabled={!canNext()}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
              ${payMethod === 'gcash' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
            {step === 4 ? `✅ Place Order — ₱${total.toLocaleString()}` :
             step === 2 && payMethod === 'gcash' ? '📱 Proceed to GCash →' :
             step === 3 ? 'Review Order →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
