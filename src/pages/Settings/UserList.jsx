import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Switch from '../../components/ui/Switch';
import Modal from '../../components/ui/Modal';

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
    const [empresas, setEmpresas] = useState([]);
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

    useEffect(() => {
        cargarUsuarios();
        // Solo un super_admin puede ver más de una empresa, y solo él
        // necesita el selector de empresa al crear/editar usuarios.
        if (esSuperAdmin) {
            apiFetch('/empresas').then(setEmpresas).catch(() => { });
        }
    }, [esSuperAdmin]);

    const nombreEmpresa = (empresaId) => empresas.find((e) => e.id === empresaId)?.nombre;

    const cambiarActivo = async (u, nuevoValor) => {
        setError('');
        setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, activo: nuevoValor } : x)));
        try {
            await apiFetch(`/usuarios/${u.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ activo: nuevoValor }),
            });
        } catch (err) {
            setError(err.message);
            cargarUsuarios(); // revertir si falló
        }
    };

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
                <Modal onClose={() => { setMostrarForm(false); setEditando(null); }}>
                    <UsuarioForm
                        esSuperAdmin={esSuperAdmin}
                        empresas={empresas}
                        usuario={editando}
                        esUsuarioActual={editando?.id === usuarioActual?.id}
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
                </Modal>
            )}

            {error && (
                <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>
            )}

            <div className="card p-0 overflow-hidden">
                <div style={{ overflowX: 'auto' }}>
                    <table className="table responsive-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Telegram</th>
                                <th>Rol</th>
                                {esSuperAdmin && <th>Empresa</th>}
                                <th>Activo</th>
                                <th style={{ width: 90 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr><td colSpan={esSuperAdmin ? 7 : 6} className="text-secondary text-center">Cargando…</td></tr>
                            ) : usuarios.length === 0 ? (
                                <tr><td colSpan={esSuperAdmin ? 7 : 6} className="text-secondary text-center">No hay usuarios registrados</td></tr>
                            ) : (
                                usuarios.map((u) => (
                                    <tr key={u.id}>
                                        <td className="font-medium" data-label="Nombre">{u.nombre || '—'}</td>
                                        <td className="text-secondary" data-label="Correo">{u.email || '—'}</td>
                                        <td data-label="Telegram">
                                            {u.telegram_id ? (
                                                <span className="badge badge-success" title={`ID: ${u.telegram_id}`}>Vinculado</span>
                                            ) : (
                                                <span className="badge badge-neutral">Sin vincular</span>
                                            )}
                                        </td>
                                        <td data-label="Rol"><span className={`badge ${roleColor[u.rol] || 'badge-neutral'}`}>{roleLabel[u.rol] || u.rol}</span></td>
                                        {esSuperAdmin && (
                                            <td className="text-secondary" data-label="Empresa">
                                                {u.rol === 'super_admin' ? 'Todas' : (nombreEmpresa(u.empresa_id) || '—')}
                                            </td>
                                        )}
                                        <td data-label="Activo">
                                            <Switch
                                                checked={u.activo}
                                                onChange={(nuevoValor) => cambiarActivo(u, nuevoValor)}
                                                disabled={u.id === usuarioActual?.id}
                                                ariaLabel={`Usuario ${u.nombre || u.email} activo`}
                                            />
                                        </td>
                                        <td data-label="">
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
        </div>
    );
};

// Formulario único para crear o editar (según si `usuario` viene con datos).
// Un admin de empresa solo puede crear/editar empleados o admins de su
// propia empresa (el backend lo re-valida igual, forzando su empresa_id);
// un super_admin además puede otorgar el rol super_admin y elegir a qué
// empresa asignar el nuevo admin/empleado.
const UsuarioForm = ({ esSuperAdmin, empresas, usuario, esUsuarioActual, onGuardado, onCancelar }) => {
    const esEdicion = !!usuario;
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [password, setPassword] = useState('');
    const [telegramId, setTelegramId] = useState(usuario?.telegram_id ?? '');
    const [rol, setRol] = useState(usuario?.rol || 'empleado');
    const [empresaId, setEmpresaId] = useState(usuario?.empresa_id ?? (empresas[0]?.id ?? ''));
    const [activo, setActivo] = useState(usuario?.activo ?? true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const requiereEmpresa = esSuperAdmin && rol !== 'super_admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            const base = { nombre, email, rol };
            if (requiereEmpresa) base.empresa_id = empresaId || null;

            // ID numérico de Telegram (no el @usuario). Si queda vacío no se
            // manda: en edición equivale a "no tocar"; en creación, el
            // usuario queda pendiente de vincular después.
            const telegramIdValor = telegramId.toString().trim();
            const telegramIdNumerico = telegramIdValor ? Number(telegramIdValor) : undefined;
            if (telegramIdNumerico !== undefined) base.telegram_id = telegramIdNumerico;

            if (esEdicion) {
                const cambios = { ...base, activo };
                if (password) cambios.password = password;
                await apiFetch(`/usuarios/${usuario.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(cambios),
                });
            } else {
                await apiFetch('/usuarios', {
                    method: 'POST',
                    body: JSON.stringify({ ...base, password }),
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
            {esEdicion && esUsuarioActual && (
                <p className="text-xs text-secondary mb-4">
                    Por seguridad, no puedes cambiar tu propio rol ni desactivar tu cuenta. Pídele a otro administrador que lo haga si hace falta.
                </p>
            )}
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
                    <label className="form-label">ID de Telegram (opcional)</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="Ej. 123456789 — obtenido con @userinfobot"
                        value={telegramId}
                        onChange={(e) => setTelegramId(e.target.value)}
                    />
                    <p className="text-xs text-secondary mt-1">
                        Sin este dato, el usuario puede entrar al panel web pero el bot de Telegram no le va a responder.
                    </p>
                </div>
                {/* Rol: oculto por completo si te estás editando a ti mismo
                    (nadie puede cambiar su propio rol, sin importar cuál
                    sea -- ver la protección espejo en el backend). */}
                {!esUsuarioActual && (
                    <div>
                        <label className="form-label">Rol</label>
                        <select className="input-field" value={rol} onChange={(e) => setRol(e.target.value)}>
                            <option value="empleado">Empleado</option>
                            <option value="admin">Administrador</option>
                            {esSuperAdmin && <option value="super_admin">Super Admin</option>}
                        </select>
                    </div>
                )}

                {/* Solo super_admin elige la empresa: un admin normal siempre
                    crea/edita dentro de la suya (el backend la fuerza). Un
                    super_admin no tiene empresa (ve todas), así que este
                    selector no aplica si el rol elegido es super_admin. */}
                {requiereEmpresa && (
                    <div>
                        <label className="form-label">Empresa</label>
                        <select className="input-field" value={empresaId} onChange={(e) => setEmpresaId(Number(e.target.value))} required>
                            <option value="" disabled>Selecciona una empresa</option>
                            {empresas.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Activo: oculto por completo al editarte a ti mismo, mismo
                    criterio que Rol de arriba -- nadie puede desactivarse a
                    sí mismo. */}
                {esEdicion && !esUsuarioActual && (
                    <div className="flex items-center gap-3">
                        <Switch checked={activo} onChange={setActivo} ariaLabel="Usuario activo" />
                        <span className="text-sm">Usuario activo</span>
                    </div>
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