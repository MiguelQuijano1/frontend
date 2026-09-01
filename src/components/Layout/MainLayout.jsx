import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import SettingsSidebar from './SettingsSidebar';
import './Layout.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { usuario, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const enConfiguracion = location.pathname.startsWith('/configuracion');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const inicial = usuario?.nombre?.trim()?.[0]?.toUpperCase() || usuario?.email?.[0]?.toUpperCase() || 'U';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/gastos': return 'Gestión de Gastos';
      case '/configuracion': return 'Configuración General';
      case '/configuracion/usuarios': return 'Usuarios';
      case '/configuracion/empresas': return 'Empresas';
      default:
        if (location.pathname.startsWith('/gastos/')) return 'Detalle de Gasto';
        if (location.pathname.startsWith('/configuracion')) return 'Configuración';
        return 'SUREGG';
    }
  };

  return (
    <div className="main-layout">
      {enConfiguracion ? (
        <SettingsSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      ) : (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}

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
              <Menu size={22} color="var(--text-primary)" />
            </button>
            <div className="topbar-title">{getPageTitle()}</div>
          </div>

          <div className="topbar-actions">
            <button className="btn-icon" onClick={toggleTheme} aria-label="Cambiar tema">
              {isDark ? (
                <Sun key="sun" size={19} className="icon-spin-in text-secondary" />
              ) : (
                <Moon key="moon" size={19} className="icon-spin-in text-secondary" />
              )}
            </button>
            <button className="btn-icon" aria-label="Notificaciones">
              <Bell size={19} color="var(--text-secondary)" />
            </button>
            <div className="user-profile flex items-center gap-2">
              <div className="avatar flex items-center justify-center">{inicial}</div>
              <span className="font-medium text-sm hidden-sm">
                {usuario?.nombre || usuario?.email || 'Usuario'}
              </span>
            </div>
            <button className="btn-icon" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
              <LogOut size={19} color="var(--text-secondary)" />
            </button>
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