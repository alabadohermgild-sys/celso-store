import React, { useState } from 'react';
import CustomerApp from './components/customer/CustomerApp';
import AdminApp from './components/admin/AdminApp';
import AdminLogin from './components/admin/AdminLogin';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('customer');
  const [storeKey, setStoreKey] = useState(0);

  const handleLogout = () => {
    setMode('customer');
    setStoreKey(k => k + 1); // forces full remount = true logout
  };

  if (mode === 'admin') return <AdminApp onLogout={handleLogout} />;
  if (mode === 'adminLogin') return <AdminLogin onAuth={() => setMode('admin')} onBack={() => setMode('customer')} />;
  return <CustomerApp key={storeKey} onAdmin={() => setMode('adminLogin')} />;
}
