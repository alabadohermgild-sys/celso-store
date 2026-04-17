import React from 'react';

export function Badge({ children, color = 'green' }) {
  const colors = {
    green:  'bg-green-100 text-green-800',
    amber:  'bg-amber-100 text-amber-800',
    red:    'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-800 uppercase tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, variant = 'green', size = 'md', className = '', disabled = false, type = 'button' }) {
  const variants = {
    green:   'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    gcash:   'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
    outline: 'border-2 border-green-600 text-green-700 hover:bg-green-50',
    ghost:   'text-green-700 hover:bg-green-50',
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    gold:    'bg-amber-400 hover:bg-amber-500 text-gray-900',
  };
  const sizes = {
    sm:  'px-3 py-1.5 text-sm font-700',
    md:  'px-5 py-2.5 text-sm font-700',
    lg:  'px-6 py-3.5 text-base font-800',
    xl:  'px-8 py-4 text-lg font-800',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-700 text-gray-700">{label}</label>}
      <input
        className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-colors
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-600">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, rows = 3, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-700 text-gray-700">{label}</label>}
      <textarea rows={rows}
        className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none resize-none transition-colors
          ${error ? 'border-red-400' : 'border-gray-200 focus:border-green-500'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-600">{error}</span>}
    </div>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-98' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Modal({ open, onClose, children, title, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-800 text-gray-900">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl font-700">×</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending:   'bg-amber-100 text-amber-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready:     'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    done:      'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-800 uppercase tracking-wide ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function QtyControl({ qty, onInc, onDec, size = 'md' }) {
  const s = size === 'lg'
    ? { wrap: 'gap-4', btn: 'w-10 h-10 text-lg', num: 'text-xl w-8' }
    : { wrap: 'gap-2', btn: 'w-8 h-8 text-sm', num: 'text-base w-6' };
  return (
    <div className={`flex items-center ${s.wrap} bg-green-50 rounded-xl px-2 py-1`}>
      <button onClick={onDec} className={`${s.btn} flex items-center justify-center bg-green-600 text-white rounded-lg font-800 hover:bg-green-700 active:scale-90 transition-all`}>−</button>
      <span className={`${s.num} text-center font-800 text-gray-900`}>{qty}</span>
      <button onClick={onInc} className={`${s.btn} flex items-center justify-center bg-green-600 text-white rounded-lg font-800 hover:bg-green-700 active:scale-90 transition-all`}>+</button>
    </div>
  );
}

export function EmptyState({ emoji, title, subtitle, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4">{emoji}</span>
      <p className="text-lg font-800 text-gray-700 mb-1">{title}</p>
      {subtitle && <p className="text-sm text-gray-400 mb-4">{subtitle}</p>}
      {action && <Button onClick={onAction} size="md">{action}</Button>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}
