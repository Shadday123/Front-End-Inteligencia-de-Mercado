import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Contratacion from './pages/Contratacion';
import Empresas from './pages/Empresas';
import Cooperacion from './pages/Cooperacion';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<Layout />}>
            <Route path="contratacion" element={<Contratacion />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="cooperacion" element={<Cooperacion />} />
            <Route index element={<Navigate to="contratacion" replace />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
