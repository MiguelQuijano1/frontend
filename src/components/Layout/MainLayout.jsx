import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import './Layout.css';

const MainLayout = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/gastos': return 'Gestión de Gastos';
      case '/configuracion': return 'Configuración';
      default:
        if (location.pathname.startsWith('/gastos/')) return 'Detalle de Gasto';
        return 'SUREGG';
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-wrapper">
        <header className="topbar">
          <div className="topbar-title">{getPageTitle()}</div>
          <div className="topbar-actions">
            <button className="btn-icon" aria-label="Notificaciones">
              <Bell size={20} color="var(--text-secondary)" />
            </button>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={18} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin</span>
            </div>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
