import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

// Solo se llega a esta página si esSuperAdmin (ver SettingsSidebar y App.jsx).
// El backend además re-valida el rol en /empresas, así que no depende
// únicamente de que el frontend oculte el link.
const EmpresaList = () => {
    const [empresas, setEmpresas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [nombreNueva, setNombreNueva] = useState('');
    const [creando, setCreando] = useState(false);

    const cargar = () => {
        setCargando(true);
        apiFetch('/empresas')
            .then(setEmpresas)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    };

    useEffect(cargar, []);

    const crearEmpresa = async (e) => {
        e.preventDefault();
        if (!nombreNueva.trim()) return;
        setCreando(true);
        setError('');
        try {
            await apiFetch('/empresas', {
                method: 'POST',
                body: JSON.stringify({ nombre: nombreNueva.trim() }),
            });
            setNombreNueva('');
            cargar();
        } catch (err) {
            setError(err.message);
        } finally {
            setCreando(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="eyebrow mb-2">Configuración</p>
                <h2 className="text-xl">Empresas</h2>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Nueva empresa</h3>
                <form className="flex items-end gap-3" onSubmit={crearEmpresa}>
                    <div className="w-full">
                        <label className="form-label">Nombre</label>
                        <input
                            className="input-field"
                            placeholder="Nombre de la empresa"
                            value={nombreNueva}
                            onChange={(e) => setNombreNueva(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={creando} style={{ whiteSpace: 'nowrap' }}>
                        {creando ? 'Creando…' : 'Crear empresa'}
                    </button>
                </form>
            </div>

            {error && <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>}

            <div className="card p-0 overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={2} className="text-secondary text-center">Cargando…</td></tr>
                        ) : empresas.length === 0 ? (
                            <tr><td colSpan={2} className="text-secondary text-center">No hay empresas registradas</td></tr>
                        ) : (
                            empresas.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="font-medium flex items-center gap-2">
                                        <Building2 size={16} className="text-secondary" />
                                        {emp.nombre}
                                    </td>
                                    <td>
                                        <span className={`badge ${emp.activa ? 'badge-success' : 'badge-danger'}`}>
                                            {emp.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpresaList;