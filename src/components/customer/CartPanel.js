import React from 'react';
import { Button, QtyControl, EmptyState } from '../shared/UI';

export default function CartPanel({ cart, subtotal, updateQty, onClose, onCheckout, isDesktop }) {
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={`flex flex-col h-full bg-white ${isDesktop ? 'w-80 border-l border-gray-100 shadow-xl' : 'w-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div>
          <h3 className="text-lg font-900 text-gray-900">My Cart</h3>
          <p className="text-xs text-gray-400 font-600">{count} item{count !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-700 text-lg transition-colors">×</button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <EmptyState emoji="🛒" title="Cart is empty" subtitle="Add some products to get started!" />
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{item.emoji}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-700 text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 font-600">₱{item.price} each</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-900 text-green-600">₱{(item.price * item.qty).toLocaleString()}</p>
                  <QtyControl qty={item.qty} onInc={() => updateQty(item.id, 1)} onDec={() => updateQty(item.id, -1)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="border-t border-gray-100 p-5 flex-shrink-0 bg-white">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500 font-600">Subtotal</span>
            <span className="text-lg font-900 text-gray-900">₱{subtotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Delivery fee and fees applied at checkout</p>
          <Button onClick={onCheckout} size="lg" className="w-full">
            Checkout — ₱{subtotal.toLocaleString()} →
          </Button>
        </div>
      )}
    </div>
  );
}
