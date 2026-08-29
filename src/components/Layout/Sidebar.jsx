import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, ClipboardCheck, Copy,
  Building2, FolderKanban, Tags, Users, Settings, LogOut, X
} from 'lucide-react';
import { expensesMock, duplicatesMock } from '../../mocks/expensesData';
import './Layout.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pendingReview = expensesMock.filter(e => e.status === 'Requiere Revisión').length;
  const pendingDuplicates = duplicatesMock.length;

  const NavItem = ({ to, icon, label, badge, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      onClick={() => setIsOpen(false)}
    >
      {icon}
      <span className="w-full">{label}</span>
      {badge > 0 && <span className="badge badge-warning" style={{ padding: '0.1rem 0.5rem' }}>{badge}</span>}
    </NavLink>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header flex items-center justify-between">
        <div className="brand-mark">
          <span className="brand-seal">S</span>
          <span className="brand-name">SUREGG</span>
        </div>
        <button className="btn-icon mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar menú">
          <X size={22} color="var(--text-on-dark)" />
        </button>
      </div>

      <nav className="sidebar-nav flex-col">
        <div className="nav-section-label">Principal</div>
        <NavItem to="/" end icon={<LayoutDashboard size={19} />} label="Dashboard" />
        <NavItem to="/gastos" icon={<Receipt size={19} />} label="Gastos" />
        <NavItem to="/revision" icon={<ClipboardCheck size={19} />} label="Revisión" badge={pendingReview} />
        <NavItem to="/duplicados" icon={<Copy size={19} />} label="Duplicados" badge={pendingDuplicates} />

        <div className="nav-section-label" style={{ marginTop: '1.25rem' }}>Gestión</div>
        <NavItem to="/proveedores" icon={<Building2 size={19} />} label="Proveedores" />
        <NavItem to="/proyectos" icon={<FolderKanban size={19} />} label="Proyectos" />
        <NavItem to="/categorias" icon={<Tags size={19} />} label="Categorías" />
        <NavItem to="/usuarios" icon={<Users size={19} />} label="Usuarios" />
      </nav>

      <div className="sidebar-footer flex-col gap-2">
        <NavItem to="/configuracion" icon={<Settings size={19} />} label="Configuración" />
        <button className="nav-item w-full flex items-center gap-2 bg-transparent">
          <LogOut size={19} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;