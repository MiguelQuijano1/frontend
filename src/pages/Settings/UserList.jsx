import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const roleLabel = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    empleado: 'Empleado',
};

const roleColor = {
    super_admin: 'badge-info',
    admin: 'badge-success',
    empleado: 'badge-neutral',
};

const UserList = () => {
    const { esSuperAdmin, usuario: usuarioActual } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null); // usuario completo o null

    const cargarUsuarios = () => {
        setCargando(true);
        apiFetch('/usuarios')
            .then(setUsuarios)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    };

    useEffect(cargarUsuarios, []);

    const eliminarUsuario = async (u) => {
        if (u.id === usuarioActual?.id) {
            setError('No puedes eliminar tu propio usuario');
            return;
        }
        const ok = window.confirm(
            `¿Eliminar a "${u.nombre || u.email}"? Esta acción no se puede deshacer. Sus gastos registrados se conservarán con su nombre, pero perderá acceso al sistema.`,
        );
        if (!ok) return;

        setError('');
        try {
            await apiFetch(`/usuarios/${u.id}`, { method: 'DELETE' });
            cargarUsuarios();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="eyebrow mb-2">Configuración</p>
                    <h2 className="text-xl">Usuarios</h2>
                </div>
                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={() => {
                        setEditando(null);
                        setMostrarForm((v) => !v);
                    }}
                >
                    <UserPlus size={17} />
                    Nuevo usuario
                </button>
            </div>

            {(mostrarForm || editando) && (
                <UsuarioForm
                    esSuperAdmin={esSuperAdmin}
                    usuario={editando}
                    onGuardado={() => {
                        setMostrarForm(false);
                        setEditando(null);
                        cargarUsuarios();
                    }}
                    onCancelar={() => {
                        setMostrarForm(false);
                        setEditando(null);
                    }}
                />
            )}

            {error && (
                <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>
            )}

            <div className="card p-0 overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th style={{ width: 90 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={5} className="text-secondary text-center">Cargando…</td></tr>
                        ) : usuarios.length === 0 ? (
                            <tr><td colSpan={5} className="text-secondary text-center">No hay usuarios registrados</td></tr>
                        ) : (
                            usuarios.map((u) => (
                                <tr key={u.id}>
                                    <td className="font-medium">{u.nombre || '—'}</td>
                                    <td className="text-secondary">{u.email || '—'}</td>
                                    <td><span className={`badge ${roleColor[u.rol] || 'badge-neutral'}`}>{roleLabel[u.rol] || u.rol}</span></td>
                                    <td>
                                        <span className={`badge ${u.activo ? 'badge-success' : 'badge-danger'}`}>
                                            {u.activo ? 'Activo' : 'Desactivado'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                className="btn-icon"
                                                onClick={() => {
                                                    setMostrarForm(false);
                                                    setEditando(u);
                                                }}
                                                aria-label="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button className="btn-icon" onClick={() => eliminarUsuario(u)} aria-label="Eliminar">
                                                <Trash2 size={16} color="var(--danger, #e11d48)" />
                                            </button>
                                        </div>
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

// Formulario único para crear o editar (según si `usuario` viene con datos).
// Un admin de empresa solo puede crear/editar empleados o admins de su
// propia empresa (el backend lo re-valida igual); un super_admin además
// puede otorgar el rol super_admin.
const UsuarioForm = ({ esSuperAdmin, usuario, onGuardado, onCancelar }) => {
    const esEdicion = !!usuario;
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState(usuario?.rol || 'empleado');
    const [activo, setActivo] = useState(usuario?.activo ?? true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            if (esEdicion) {
                const cambios = { nombre, email, rol, activo };
                if (password) cambios.password = password;
                await apiFetch(`/usuarios/${usuario.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(cambios),
                });
            } else {
                await apiFetch('/usuarios', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, email, password, rol }),
                });
            }
            onGuardado();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{esEdicion ? 'Editar usuario' : 'Nuevo usuario'}</h3>
                <button className="btn-icon" onClick={onCancelar} aria-label="Cerrar">
                    <X size={18} />
                </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Nombre</label>
                    <input className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label className="form-label">Correo</label>
                    <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label className="form-label">{esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder={esEdicion ? 'Dejar en blanco para no cambiarla' : ''}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required={!esEdicion}
                    />
                </div>
                <div>
                    <label className="form-label">Rol</label>
                    <select className="input-field" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="empleado">Empleado</option>
                        <option value="admin">Administrador</option>
                        {esSuperAdmin && <option value="super_admin">Super Admin</option>}
                    </select>
                </div>

                {esEdicion && (
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
                        Usuario activo
                    </label>
                )}

                {error && <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>}

                <div className="flex items-center gap-3">
                    <button type="submit" className="btn btn-primary w-full" disabled={enviando}>
                        {enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear usuario'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={onCancelar}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserList;