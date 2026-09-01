import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
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
    const { esSuperAdmin } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);

    const cargarUsuarios = () => {
        setCargando(true);
        apiFetch('/usuarios')
            .then(setUsuarios)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    };

    useEffect(cargarUsuarios, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="eyebrow mb-2">Configuración</p>
                    <h2 className="text-xl">Usuarios</h2>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={() => setMostrarForm((v) => !v)}>
                    <UserPlus size={17} />
                    Nuevo usuario
                </button>
            </div>

            {mostrarForm && (
                <NuevoUsuarioForm
                    esSuperAdmin={esSuperAdmin}
                    onCreado={() => {
                        setMostrarForm(false);
                        cargarUsuarios();
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
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={4} className="text-secondary text-center">Cargando…</td></tr>
                        ) : usuarios.length === 0 ? (
                            <tr><td colSpan={4} className="text-secondary text-center">No hay usuarios registrados</td></tr>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Formulario mínimo para crear un usuario nuevo. Un admin de empresa solo
// puede crear empleados/admins (el backend fuerza su propia empresa); un
// super_admin además puede marcar rol super_admin.
const NuevoUsuarioForm = ({ esSuperAdmin, onCreado }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('empleado');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            await apiFetch('/usuarios', {
                method: 'POST',
                body: JSON.stringify({ nombre, email, password, rol }),
            });
            onCreado();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Nuevo usuario</h3>
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
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                </div>
                <div>
                    <label className="form-label">Rol</label>
                    <select className="input-field" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="empleado">Empleado</option>
                        <option value="admin">Administrador</option>
                        {esSuperAdmin && <option value="super_admin">Super Admin</option>}
                    </select>
                </div>

                {error && <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>}

                <button type="submit" className="btn btn-primary w-full" disabled={enviando}>
                    {enviando ? 'Creando…' : 'Crear usuario'}
                </button>
            </form>
        </div>
    );
};

export default UserList;