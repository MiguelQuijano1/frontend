import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User, Bell, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="content-wrapper">
        <header className="topbar">
          <div className="flex items-center gap-4">
            <button 
              className="btn-icon mobile-menu-btn" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} color="var(--text-primary)" />
            </button>
            <div className="topbar-title">{getPageTitle()}</div>
          </div>

          <div className="topbar-actions">
            <button className="btn-icon" onClick={toggleTheme} aria-label="Cambiar tema">
              {isDark ? <Sun size={20} color="var(--text-secondary)" /> : <Moon size={20} color="var(--text-secondary)" />}
            </button>
            <button className="btn-icon" aria-label="Notificaciones">
              <Bell size={20} color="var(--text-secondary)" />
            </button>
            <div className="user-profile flex items-center gap-2 cursor-pointer">
              <div className="avatar flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="font-medium text-sm hidden-sm">Admin</span>
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
