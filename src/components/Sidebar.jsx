import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white shadow-lg" style={{ width: '280px', minHeight: '100vh', backgroundColor: 'var(--eci-dark)' }}>
      <a href="/" className="d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-decoration-none bg-white p-2 rounded w-100">
        <img src="/logo.png" alt="ECI Radar Logo" className="img-fluid" style={{ maxHeight: '70px', objectFit: 'contain' }} />
      </a>
      <hr style={{ borderColor: 'var(--eci-red)', opacity: 0.5 }} />
      <Nav variant="pills" className="flex-column mb-auto">
        <Nav.Item className="mb-2">
          <NavLink to="/dashboard/contratacion" className={({ isActive }) => `nav-link text-white ${isActive ? 'active shadow-sm' : 'opacity-75'}`}>
            <i className="bi bi-bank me-2"></i>
            Prototipo 1: SECOP II
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-2">
          <NavLink to="/dashboard/empresas" className={({ isActive }) => `nav-link text-white ${isActive ? 'active shadow-sm' : 'opacity-75'}`}>
            <i className="bi bi-building me-2"></i>
            Prototipo 2: Empresas
          </NavLink>
        </Nav.Item>
        <Nav.Item className="mb-2">
          <NavLink to="/dashboard/cooperacion" className={({ isActive }) => `nav-link text-white ${isActive ? 'active shadow-sm' : 'opacity-75'}`}>
            <i className="bi bi-globe me-2"></i>
            Prototipo 3: Cooperación
          </NavLink>
        </Nav.Item>
      </Nav>
      <hr style={{ borderColor: 'gray' }} />
      <div className="dropdown">
        <div className="d-flex align-items-center text-white text-decoration-none mb-3">
          <i className="bi bi-person-circle fs-4 me-2" style={{ color: 'var(--eci-red)' }}></i>
          <div>
            <strong className="d-block lh-1">{user?.username}</strong>
            <small className="text-white-50">{user?.role}</small>
          </div>
        </div>
        <button className="btn btn-outline-eci btn-sm w-100" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
