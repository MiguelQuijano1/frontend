import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Uso: envuelve rutas que solo debe poder ver un super_admin (gestión de
// empresas/tenants). Un admin normal o empleado que intente entrar por URL
// directa es redirigido al panel de configuración general.
const SuperAdminRoute = () => {
    const { esSuperAdmin } = useAuth();

    if (!esSuperAdmin) {
        return <Navigate to="/configuracion" replace />;
    }

    return <Outlet />;
};

export default SuperAdminRoute;