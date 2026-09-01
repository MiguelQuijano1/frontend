import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, getToken, setToken, clearToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    // true mientras se valida el token guardado al cargar la app (evita un
    // parpadeo hacia /login antes de confirmar si la sesión sigue vigente).
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setCargando(false);
            return;
        }

        apiFetch('/auth/me', { method: 'POST' })
            .then((data) => setUsuario(data))
            .catch(() => clearToken())
            .finally(() => setCargando(false));
    }, []);

    const login = async (email, password) => {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setToken(data.access_token);
        setUsuario(data.usuario);
        return data.usuario;
    };

    const logout = () => {
        clearToken();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                estaAutenticado: !!usuario,
                cargando,
                login,
                logout,
                // true para super_admin, útil para mostrar/ocultar UI multi-empresa
                esSuperAdmin: usuario?.rol === 'super_admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}