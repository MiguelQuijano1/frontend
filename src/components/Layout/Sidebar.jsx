import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, WalletCards, Settings, LogOut, X } from 'lucide-react';
import './Layout.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-accent">
          <WalletCards size={24} color="var(--accent-primary)" />
          SUREGG
        </h2>
        {/* Solo visible en móvil vía CSS */}
        <button 
          className="btn-icon mobile-close-btn" 
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={24} color="var(--text-primary)" />
        </button>
      </div>
      
      <nav className="sidebar-nav flex-col">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end
          onClick={() => setIsOpen(false)}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/gastos" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setIsOpen(false)}
        >
          <Receipt size={20} />
          <span>Gastos</span>
        </NavLink>

        <NavLink 
          to="/configuracion" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setIsOpen(false)}
        >
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item w-full flex items-center gap-2 bg-transparent text-muted hover:text-primary">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
