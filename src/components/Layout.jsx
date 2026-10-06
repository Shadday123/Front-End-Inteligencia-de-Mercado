import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  // Si no está logueado, redirige a /login protegiendo las rutas hijas
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', height: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
