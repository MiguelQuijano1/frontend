// Base del backend. En desarrollo (Vite) crea un archivo .env con:
//   VITE_API_URL=http://localhost:3000
// En producción, apunta a la URL de Railway del backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TOKEN_KEY = 'suregg_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Wrapper sobre fetch que arma la URL completa, adjunta el token (si existe)
// y parsea la respuesta como JSON, lanzando un Error con el mensaje del
// backend cuando la respuesta no es 2xx.
export async function apiFetch(path, options = {}) {
    const token = getToken();
    const esFormData = options.body instanceof FormData;

    const headers = {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    let data = null;
    try {
        data = await response.json();
    } catch {
        // Respuesta sin body (ej. 204)
    }

    if (!response.ok) {
        const mensaje = data?.message || `Error ${response.status}`;
        throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje);
    }

    return data;
}