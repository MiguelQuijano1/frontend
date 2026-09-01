import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Users, Building2, SlidersHorizontal, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const SettingsSidebar = ({ isOpen, setIsOpen }) => {
    const { esSuperAdmin } = useAuth();

    const NavItem = ({ to, icon, label, end = false }) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setIsOpen(false)}
        >
            {icon}
            <span className="w-full">{label}</span>
        </NavLink>
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header flex items-center justify-between">
                <div className="brand-mark">
                    <span className="brand-seal">S</span>
                    <span className="brand-name">Configuración</span>
                </div>
                <button className="btn-icon mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar menú">
                    <X size={22} color="var(--text-on-dark)" />
                </button>
            </div>

            <nav className="sidebar-nav flex-col">
                <NavLink to="/" className="nav-item" onClick={() => setIsOpen(false)}>
                    <ArrowLeft size={19} />
                    <span className="w-full">Volver al panel</span>
                </NavLink>

                <div className="nav-section-label" style={{ marginTop: '1.25rem' }}>General</div>
                <NavItem to="/configuracion" end icon={<SlidersHorizontal size={19} />} label="General" />
                <NavItem to="/configuracion/usuarios" icon={<Users size={19} />} label="Usuarios" />

                {/* Solo super_admin gestiona empresas (tenants); un admin de empresa
            no tiene nada que hacer en esta sección. */}
                {esSuperAdmin && (
                    <NavItem to="/configuracion/empresas" icon={<Building2 size={19} />} label="Empresas" />
                )}

                {/* Espacio para futuras secciones de configuración: notificaciones,
            categorías fijas, integraciones, etc. Se agregan aquí como
            NavItem nuevos sin tocar el resto de la estructura. */}
            </nav>
        </aside>
    );
};

export default SettingsSidebar;