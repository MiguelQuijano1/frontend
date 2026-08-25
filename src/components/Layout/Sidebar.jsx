import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, WalletCards, Settings, LogOut } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>
          <WalletCards size={24} color="var(--accent-primary)" />
          SUREGG
        </h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/gastos" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Receipt size={20} />
          <span>Gastos</span>
        </NavLink>

        <NavLink 
          to="/configuracion" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ width: '100%', background: 'transparent' }}>
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
