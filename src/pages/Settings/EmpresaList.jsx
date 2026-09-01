import React, { useEffect, useState } from 'react';
import { Building2, Pencil, Trash2, Check, X } from 'lucide-react';
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
    const [editandoId, setEditandoId] = useState(null);
    const [nombreEdit, setNombreEdit] = useState('');

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

    const iniciarEdicion = (empresa) => {
        setEditandoId(empresa.id);
        setNombreEdit(empresa.nombre);
    };

    const guardarEdicion = async (id) => {
        if (!nombreEdit.trim()) return;
        setError('');
        try {
            await apiFetch(`/empresas/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ nombre: nombreEdit.trim() }),
            });
            setEditandoId(null);
            cargar();
        } catch (err) {
            setError(err.message);
        }
    };

    const alternarActiva = async (empresa) => {
        setError('');
        try {
            await apiFetch(`/empresas/${empresa.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ activa: !empresa.activa }),
            });
            cargar();
        } catch (err) {
            setError(err.message);
        }
    };

    const eliminarEmpresa = async (empresa) => {
        const ok = window.confirm(
            `¿Eliminar "${empresa.nombre}"? Esta acción no se puede deshacer. Si tiene usuarios o gastos asociados, no se podrá eliminar y deberás desactivarla en su lugar.`,
        );
        if (!ok) return;

        setError('');
        try {
            await apiFetch(`/empresas/${empresa.id}`, { method: 'DELETE' });
            cargar();
        } catch (err) {
            setError(err.message);
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
                            <th style={{ width: 110 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={3} className="text-secondary text-center">Cargando…</td></tr>
                        ) : empresas.length === 0 ? (
                            <tr><td colSpan={3} className="text-secondary text-center">No hay empresas registradas</td></tr>
                        ) : (
                            empresas.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="font-medium">
                                        {editandoId === emp.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="input-field"
                                                    value={nombreEdit}
                                                    onChange={(e) => setNombreEdit(e.target.value)}
                                                    autoFocus
                                                />
                                                <button className="btn-icon" onClick={() => guardarEdicion(emp.id)} aria-label="Guardar">
                                                    <Check size={17} />
                                                </button>
                                                <button className="btn-icon" onClick={() => setEditandoId(null)} aria-label="Cancelar">
                                                    <X size={17} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Building2 size={16} className="text-secondary" />
                                                {emp.nombre}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className={`badge ${emp.activa ? 'badge-success' : 'badge-danger'}`}
                                            style={{ cursor: 'pointer', border: 'none' }}
                                            onClick={() => alternarActiva(emp)}
                                            title="Click para cambiar estado"
                                        >
                                            {emp.activa ? 'Activa' : 'Inactiva'}
                                        </button>
                                    </td>
                                    <td>
                                        {editandoId !== emp.id && (
                                            <div className="flex items-center gap-2 justify-end">
                                                <button className="btn-icon" onClick={() => iniciarEdicion(emp)} aria-label="Editar">
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="btn-icon" onClick={() => eliminarEmpresa(emp)} aria-label="Eliminar">
                                                    <Trash2 size={16} color="var(--danger, #e11d48)" />
                                                </button>
                                            </div>
                                        )}
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