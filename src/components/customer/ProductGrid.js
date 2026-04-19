import React from 'react';
import { QtyControl, EmptyState } from '../shared/UI';

export default function ProductGrid({ products, getCartQty, onAdd, onUpdateQty, onViewProduct, mobile }) {
  if (products.length === 0) {
    return <EmptyState emoji="🔍" title="No products found" subtitle="Try a different search or category" action="Clear Search" onAction={() => {}} />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Hero banner (desktop, all category) */}
      {!mobile && (
        <div className="hidden lg:flex mb-8 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex-1 p-8">
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-800 px-3 py-1 rounded-full mb-3 uppercase tracking-wide">📦 Fresh Stocks Daily</span>
            <h2 className="text-3xl font-900 text-white mb-2 leading-tight">Welcome to<br />Celso Store!</h2>
            <p className="text-green-200 font-600">Your neighborhood store, now online</p>
          </div>
          <div className="flex items-center pr-10 text-7xl">🏪</div>
        </div>
      )}

      {/* Grid */}
      <div className={`grid gap-4 ${mobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'}`}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            cartQty={getCartQty(product.id)}
            onView={() => onViewProduct(product)}
            onAdd={() => onAdd(product)}
            onInc={() => onUpdateQty(product.id, 1)}
            onDec={() => onUpdateQty(product.id, -1)}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, cartQty, onView, onAdd, onInc, onDec }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={onView}>
      {/* Image area */}
      <div className="relative bg-green-50 flex items-center justify-center overflow-hidden" style={{ paddingBottom: '70%', height: 0, position: 'relative' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {product.image && (product.image.startsWith('data:') || product.image.startsWith('http'))
            ? <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null}
          <span className={`text-5xl lg:text-6xl items-center justify-center ${product.image && (product.image.startsWith('data:') || product.image.startsWith('http')) ? 'hidden' : 'flex'}`}>{product.emoji}</span>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tags?.includes('bestseller') && (
            <span className="bg-red-500 text-white text-xs font-800 px-2 py-0.5 rounded-full uppercase tracking-wide">Bestseller</span>
          )}
          {product.tags?.includes('popular') && !product.tags?.includes('bestseller') && (
            <span className="bg-amber-400 text-gray-900 text-xs font-800 px-2 py-0.5 rounded-full uppercase tracking-wide">Popular</span>
          )}
        </div>
        {lowStock && (
          <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-800 px-2 py-0.5 rounded-full">
            {product.stock} left!
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-800 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-700 text-gray-800 leading-snug mb-1 min-h-[2.5rem] line-clamp-2">{product.name}</p>
        <p className="text-lg font-900 text-green-600 mb-0.5">₱{product.price}</p>
        <p className="text-xs text-gray-400 font-600 mb-3">{product.stock} in stock</p>

        {/* Add to cart */}
        <div className="mt-auto" onClick={e => e.stopPropagation()}>
          {outOfStock ? (
            <div className="w-full bg-gray-100 text-gray-400 text-sm font-700 py-2.5 rounded-xl text-center">Unavailable</div>
          ) : cartQty === 0 ? (
            <button
              onClick={onAdd}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-800 py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all">
              + Add
            </button>
          ) : (
            <QtyControl qty={cartQty} onInc={onInc} onDec={onDec} />
          )}
        </div>
      </div>
    </div>
  );
}
