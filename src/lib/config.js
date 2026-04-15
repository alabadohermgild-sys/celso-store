// ── Local storage helpers ─────────────────────────────────────────────────────
export const ls = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── App config ────────────────────────────────────────────────────────────────
export const CONFIG = {
  storeName: 'Celso Store',
  tagline: 'Convenience You Can Count On.',
  gcashNumber: '0947 296 1349',
  gcashName: 'Celso A.',
  adminPassword: 'celso2026',
  gcashServiceFee: 0.03,   // 3% for GCash cash-in/out service
  gcashOrderFee: 0.02,     // 2% added to order total when paying via GCash
  deliveryZones: [
    { label: 'Same street (0–500m)', fee: 15 },
    { label: 'Nearby (500m–1km)', fee: 25 },
    { label: '1km–2km away', fee: 40 },
    { label: '2km–5km away', fee: 60 },
    { label: '5km+ (far area)', fee: 100 },
  ],
};

// ── Order status config ────────────────────────────────────────────────────────
export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'delivered'];
export const STATUS_COLORS = {
  pending:   { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400' },
  preparing: { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  ready:     { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  delivered: { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
};
