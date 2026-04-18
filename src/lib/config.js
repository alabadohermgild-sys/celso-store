export const ls = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export const CONFIG = {
  storeName: 'Celso Store',
  tagline: 'Convenience You Can Count On.',
  gcashNumber: '0947 296 1349',
  gcashName: 'Celso A.',
  adminPassword: 'celso2026',
  gcashServiceFee: 0.03,
  gcashOrderFee: 0.02,
  deliveryZones: [
    { label: 'Same street (0-500m)', fee: 15 },
    { label: 'Nearby (500m-1km)', fee: 25 },
    { label: '1km-2km away', fee: 40 },
    { label: '2km-5km away', fee: 60 },
    { label: '5km+ (far area)', fee: 100 },
  ],
};

export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'delivered'];
export const STATUS_COLORS = {
  pending:   { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400' },
  preparing: { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  ready:     { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  delivered: { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
};

// ── JSONBin credentials ───────────────────────────────────────────────────────
const JSONBIN_BIN_ID = '69e0e427aaba88219706c568';
const JSONBIN_API_KEY = '$2a$10$cP2vdCuXDxTN8Ut1/dlDXOILYSFR9gqNlHthoSuzQNzuI3xrt1VRa';
const BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const HDRS = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
  'X-Bin-Versioning': 'false',
};

// ── Write lock to prevent race conditions ─────────────────────────────────────
let _busy = false;
async function waitLock() {
  let n = 0;
  while (_busy && n < 30) { await new Promise(r => setTimeout(r, 300)); n++; }
}

// ── Strip base64 from any object (prevents JSONBin 100KB limit failures) ──────
function stripBase64(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') return obj.startsWith('data:') ? '[img]' : obj;
  if (Array.isArray(obj)) return obj.map(stripBase64);
  if (typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = stripBase64(obj[k]);
    return out;
  }
  return obj;
}

export async function dbRead() {
  try {
    const res = await fetch(`${BASE_URL}/latest`, { headers: HDRS });
    const json = await res.json();
    return json.record || { orders: [], gcashRequests: [], products: [] };
  } catch(e) {
    console.error('DB read error', e);
    return { orders: ls.get('celso_orders', []), gcashRequests: ls.get('celso_gcash', []), products: [] };
  }
}

export async function dbWrite(data) {
  try {
    // Always strip base64 before writing to DB
    const safe = stripBase64(data);
    await fetch(BASE_URL, { method: 'PUT', headers: HDRS, body: JSON.stringify(safe) });
  } catch(e) { console.error('DB write error', e); }
}

export async function dbAddOrder(order) {
  await waitLock(); _busy = true;
  try {
    const data = await dbRead();
    // Strip base64 from order (product images, gcash proof)
    const safeOrder = stripBase64(order);
    const updated = { ...data, orders: [safeOrder, ...(data.orders || [])] };
    await dbWrite(updated);
    return updated.orders;
  } finally { _busy = false; }
}

export async function dbAddGcash(req) {
  await waitLock(); _busy = true;
  try {
    const data = await dbRead();
    // Strip base64 proof image from DB payload
    const safeReq = stripBase64(req);
    const updated = { ...data, gcashRequests: [safeReq, ...(data.gcashRequests || [])] };
    await dbWrite(updated);
    return updated.gcashRequests;
  } finally { _busy = false; }
}

export async function dbSaveProducts(products) {
  await waitLock(); _busy = true;
  try {
    const data = await dbRead();
    // Strip base64 images from products before DB save
    const safeProds = stripBase64(products);
    const updated = { ...data, products: safeProds };
    await dbWrite(updated);
    return safeProds;
  } finally { _busy = false; }
}

export async function dbUpdateOrderStatus(id, status) {
  await waitLock(); _busy = true;
  try {
    const data = await dbRead();
    const updated = { ...data, orders: (data.orders || []).map(o => o.id === id ? { ...o, status } : o) };
    await dbWrite(updated);
    return updated.orders;
  } finally { _busy = false; }
}

export async function dbUpdateGcashStatus(id, status) {
  await waitLock(); _busy = true;
  try {
    const data = await dbRead();
    const updated = { ...data, gcashRequests: (data.gcashRequests || []).map(r => r.id === id ? { ...r, status } : r) };
    await dbWrite(updated);
    return updated.gcashRequests;
  } finally { _busy = false; }
}
