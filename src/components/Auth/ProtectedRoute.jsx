import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { estaAutenticado, cargando } = useAuth();

    if (cargando) {
        return (
            <div
                className="flex items-center justify-center"
                style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}
            >
                <span className="text-secondary">Cargando…</span>
            </div>
        );
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;