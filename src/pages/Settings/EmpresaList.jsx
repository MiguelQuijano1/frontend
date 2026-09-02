import React, { useEffect, useRef, useState } from 'react';
import { Building2, Pencil, Trash2, Plus, ImageUp } from 'lucide-react';
import { apiFetch, getToken } from '../../utils/api';
import Switch from '../../components/ui/Switch';
import Modal from '../../components/ui/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Solo se llega a esta página si esSuperAdmin (ver SettingsSidebar y App.jsx).
// El backend además re-valida el rol en /empresas, así que no depende
// únicamente de que el frontend oculte el link.
const EmpresaList = () => {
    const [empresas, setEmpresas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null); // empresa completa o null

    const cargar = () => {
        setCargando(true);
        apiFetch('/empresas')
            .then(setEmpresas)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    };

    useEffect(cargar, []);

    const cambiarActiva = async (empresa, nuevoValor) => {
        setError('');
        // Optimista: refleja el cambio al toque, sin esperar la respuesta.
        setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? { ...e, activa: nuevoValor } : e)));
        try {
            await apiFetch(`/empresas/${empresa.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ activa: nuevoValor }),
            });
        } catch (err) {
            setError(err.message);
            cargar(); // revertir si falló
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
            <div className="flex items-center justify-between">
                <div>
                    <p className="eyebrow mb-2">Configuración</p>
                    <h2 className="text-xl">Empresas</h2>
                </div>
                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={() => { setEditando(null); setMostrarForm(true); }}
                >
                    <Plus size={17} />
                    Nueva empresa
                </button>
            </div>

            {(mostrarForm || editando) && (
                <Modal onClose={() => { setMostrarForm(false); setEditando(null); }}>
                    <EmpresaForm
                        empresa={editando}
                        onGuardado={() => {
                            setMostrarForm(false);
                            setEditando(null);
                            cargar();
                        }}
                        onCancelar={() => {
                            setMostrarForm(false);
                            setEditando(null);
                        }}
                    />
                </Modal>
            )}

            {error && <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>}

            <div className="card p-0 overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Empresa</th>
                            <th>Activa</th>
                            <th style={{ width: 90 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={4} className="text-secondary text-center">Cargando…</td></tr>
                        ) : empresas.length === 0 ? (
                            <tr><td colSpan={4} className="text-secondary text-center">No hay empresas registradas</td></tr>
                        ) : (
                            empresas.map((emp) => (
                                <tr key={emp.id}>
                                    <td style={{ width: 56 }}>
                                        <div
                                            style={{
                                                width: 36, height: 36, borderRadius: 8, overflow: 'hidden',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: 'var(--bg-secondary)',
                                            }}
                                        >
                                            {emp.logo_url ? (
                                                <img src={emp.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Building2 size={16} className="text-secondary" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="font-medium">{emp.nombre}</td>
                                    <td>
                                        <Switch
                                            checked={emp.activa}
                                            onChange={(nuevoValor) => cambiarActiva(emp, nuevoValor)}
                                            ariaLabel={`Empresa ${emp.nombre} activa`}
                                        />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 justify-end">
                                            <button className="btn-icon" onClick={() => { setMostrarForm(false); setEditando(emp); }} aria-label="Editar">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="btn-icon" onClick={() => eliminarEmpresa(emp)} aria-label="Eliminar">
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

// Formulario único para crear o editar (según si `empresa` viene con datos).
// Al crear, todo va en una sola llamada multipart (nombre + logo opcional)
// para no obligar a un segundo paso. Al editar, el logo se sube aparte
// (multipart) apenas se elige un archivo nuevo, independiente del nombre.
const EmpresaForm = ({ empresa, onGuardado, onCancelar }) => {
    const esEdicion = !!empresa;
    const [nombre, setNombre] = useState(empresa?.nombre || '');
    const [activa, setActiva] = useState(empresa?.activa ?? true);
    const [logoUrl, setLogoUrl] = useState(empresa?.logo_url || null);
    const [logoFile, setLogoFile] = useState(null); // solo se usa en modo creación
    const [logoPreview, setLogoPreview] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [subiendoLogo, setSubiendoLogo] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        setError('');
        setEnviando(true);
        try {
            if (esEdicion) {
                await apiFetch(`/empresas/${empresa.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ nombre: nombre.trim(), activa }),
                });
            } else {
                const formData = new FormData();
                formData.append('nombre', nombre.trim());
                if (logoFile) formData.append('file', logoFile);

                const token = getToken();
                const response = await fetch(`${API_URL}/empresas`, {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                });
                if (!response.ok) {
                    const data = await response.json().catch(() => null);
                    throw new Error(data?.message || `Error ${response.status} creando la empresa`);
                }
            }
            onGuardado();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    const elegirLogo = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (esEdicion) {
            subirLogoExistente(file);
        } else {
            // Aún no existe la empresa: solo se guarda en memoria y se
            // muestra una vista previa; se sube junto con el POST al enviar.
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const subirLogoExistente = async (file) => {
        setSubiendoLogo(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = getToken();
            const response = await fetch(`${API_URL}/empresas/${empresa.id}/logo`, {
                method: 'PATCH',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || `Error ${response.status} subiendo el logo`);
            }
            const actualizada = await response.json();
            setLogoUrl(actualizada.logo_url);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubiendoLogo(false);
        }
    };

    const imagenAMostrar = logoPreview || logoUrl;

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">{esEdicion ? 'Editar empresa' : 'Nueva empresa'}</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={subiendoLogo}
                        title="Elegir logo"
                        style={{
                            width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--bg-secondary)', padding: 0,
                        }}
                    >
                        {subiendoLogo ? (
                            <span className="text-xs">…</span>
                        ) : imagenAMostrar ? (
                            <img src={imagenAMostrar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageUp size={20} className="text-secondary" />
                        )}
                    </button>
                    <span className="text-sm text-secondary">
                        {esEdicion ? 'Click para cambiar el logo' : 'Click para elegir un logo (opcional)'}
                    </span>
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={elegirLogo} />
                </div>

                <div>
                    <label className="form-label">Nombre</label>
                    <input
                        className="input-field"
                        placeholder="Nombre de la empresa"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoFocus
                        required
                    />
                </div>

                {esEdicion && (
                    <div className="flex items-center gap-3">
                        <Switch checked={activa} onChange={setActiva} ariaLabel="Empresa activa" />
                        <span className="text-sm">Empresa activa</span>
                    </div>
                )}

                {error && <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</p>}

                <div className="flex items-center gap-3">
                    <button type="submit" className="btn btn-primary w-full" disabled={enviando}>
                        {enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear empresa'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={onCancelar}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmpresaList;