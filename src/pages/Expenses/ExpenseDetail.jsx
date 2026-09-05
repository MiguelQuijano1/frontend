import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Save, AlertTriangle, FileText, Image as ImageIcon, Mic, Plus } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { mapearGasto } from '../../hooks/useExpenses';
import ConfidenceBadge from '../../components/Expenses/ConfidenceBadge';
import Modal from '../../components/ui/Modal';
import './ExpenseDetail.css';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [pagoForm, setPagoForm] = useState({ medio: 'yape', numero_operacion: '', monto: '' });
  const [pagoImagen, setPagoImagen] = useState(null);
  const [guardandoPago, setGuardandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  useEffect(() => {
    apiFetch('/categorias')
      .then((data) => setCategorias(data || []))
      .catch(() => setCategorias([])); // si falla, el <select> queda vacío pero no bloquea el resto del panel
  }, []);

  const cargar = () => {
    setCargando(true);
    setError('');
    apiFetch(`/gastos/${id}`)
      .then((data) => {
        const gasto = mapearGasto(data);
        setExpense(gasto);
        setFormData(gasto);
      })
      .catch((err) => setError(err.message || 'Error cargando el gasto'))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, [id]);

  if (cargando) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p className="text-sm" style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>{error}</p>
        <button className="btn btn-outline" onClick={cargar}>Reintentar</button>
      </div>
    );
  }

  if (!expense) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoriaId = e.target.value ? Number(e.target.value) : null;
    const nombre = categorias.find(c => c.id === categoriaId)?.nombre || null;
    setFormData(prev => ({ ...prev, categoryId: categoriaId, category: nombre }));
  };

  const handleSave = async () => {
    setGuardando(true);
    setError('');
    try {
      // Proveedor queda de solo lectura por ahora: el backend todavía no
      // expone un <select> de proveedores (no hay GET /proveedores), así
      // que no hay de dónde elegir un proveedor_id distinto al que ya
      // trae el gasto. Categoría sí es editable desde acá (GET /categorias).
      const body = {
        monto: Number(formData.amount),
        es_personal: formData.type === 'Personal',
      };
      if (formData.categoryId !== undefined && formData.categoryId !== null) {
        body.categoria_id = formData.categoryId;
      }
      await apiFetch(`/gastos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      navigate('/gastos');
    } catch (err) {
      setError(err.message || 'Error guardando el gasto');
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalPago = () => {
    setPagoForm({ medio: 'yape', numero_operacion: '', monto: '' });
    setPagoImagen(null);
    setErrorPago('');
    setMostrarModalPago(true);
  };

  const handlePagoChange = (e) => {
    const { name, value } = e.target;
    setPagoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarPago = async () => {
    setGuardandoPago(true);
    setErrorPago('');
    try {
      await apiFetch(`/gastos/${id}/pago`, {
        method: 'POST',
        body: JSON.stringify({
          medio: pagoForm.medio,
          numero_operacion: pagoForm.numero_operacion || null,
          monto: pagoForm.monto ? Number(pagoForm.monto) : null,
        }),
      });
      // La imagen (ej. captura de Yape) es un paso aparte: se sube como
      // evidencia del gasto, no forma parte de la fila de `pagos`.
      if (pagoImagen) {
        const formDataImagen = new FormData();
        formDataImagen.append('file', pagoImagen);
        await apiFetch(`/gastos/${id}/evidencia`, {
          method: 'POST',
          body: formDataImagen,
        });
      }
      setMostrarModalPago(false);
      cargar(); // refresca Pagos, Evidencias y el gasto con lo nuevo
    } catch (err) {
      setErrorPago(err.message || 'Error guardando el pago');
    } finally {
      setGuardandoPago(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="expense-detail-header">
        <button onClick={() => navigate('/gastos')} className="btn btn-outline expense-back-btn">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="expense-title font-display">
            Revisión de Gasto #{expense.id.padStart(4, '0')}
            {expense.status === 'Posible Duplicado' && (
              <span className="badge badge-danger">
                <AlertTriangle size={14} style={{ marginRight: '0.25rem' }} /> Posible Duplicado
              </span>
            )}
          </h2>
          <p className="expense-subtitle">
            Registrado el {new Date(expense.date).toLocaleString()} por {expense.user} · vía {expense.channel}
          </p>
        </div>
      </div>

      <div className="expense-detail-grid">

        {/* Panel izquierdo: entidades relacionadas (Comprobantes / Pagos / Evidencias) */}
        <div className="flex flex-col gap-6">

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Comprobantes</h3>
              <button className="btn btn-outline text-sm" style={{ padding: '0.35rem 0.75rem' }}>
                <Plus size={14} /> Añadir
              </button>
            </div>
            {expense.comprobantes.length === 0 ? (
              <p className="text-sm text-muted">Sin comprobante registrado.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {expense.comprobantes.map(c => (
                  <div key={c.id} className="doc-row">
                    <FileText size={18} color="var(--accent-info)" />
                    <div>
                      <div className="font-medium text-sm">{c.tipo} {c.numero}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pagos</h3>
              <button className="btn btn-outline text-sm" style={{ padding: '0.35rem 0.75rem' }} onClick={abrirModalPago}>
                <Plus size={14} /> Añadir
              </button>
            </div>
            {expense.pagos.length === 0 ? (
              <p className="text-sm text-muted">Sin pago registrado.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {expense.pagos.map(p => (
                  <div key={p.id} className="doc-row">
                    <div className="icon-badge icon-badge-success" style={{ width: 32, height: 32 }}>
                      <Check size={14} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{p.medio} · {expense.currency} {p.monto}</div>
                      {p.referencia && <div className="text-xs text-muted">Ref: {p.referencia}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Evidencias</h3>
            <div className="flex flex-col gap-4">
              {expense.evidencias.map(ev => (
                <div key={ev.id}>
                  {ev.tipo === 'image' && (
                    <div className="evidence-image-wrap">
                      {ev.url ? (
                        <img
                          src={ev.url}
                          alt="Comprobante"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="evidence-empty">
                          <ImageIcon size={40} />
                          <p className="text-sm">Imagen no disponible</p>
                        </div>
                      )}
                    </div>
                  )}
                  {ev.tipo === 'audio' && (
                    <div className="audio-evidence">
                      <div className="audio-header">
                        <div className="audio-icon"><Mic size={22} /></div>
                        <h4 className="font-semibold text-sm">Audio Original</h4>
                      </div>
                      {ev.url ? (
                        <audio controls src={ev.url} style={{ width: '100%', marginTop: '0.5rem' }} />
                      ) : (
                        <p className="text-sm text-muted">Audio no disponible</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho: formulario del Gasto */}
        <div className="card form-panel">
          <div className="form-panel-header">
            <h3 className="text-lg font-semibold">Datos del Gasto</h3>
            <ConfidenceBadge level={expense.confidence} />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <div>
                <label className="form-label">Monto</label>
                <div className="amount-input-wrap">
                  <span className="amount-currency">{formData.currency}</span>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field amount-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Medio de Pago</label>
                <input type="text" value={formData.paymentMethod || 'Sin registrar'} disabled className="input-field" />
              </div>
            </div>

            <div>
              <label className="form-label">Proveedor</label>
              <input type="text" value={formData.provider || 'Sin identificar'} disabled className="input-field" />
            </div>

            <div className="form-row">
              <div>
                <label className="form-label">Tipo de Gasto</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                  <option value="Empresa">Empresa</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="form-label">Categoría</label>
                <select
                  name="categoryId"
                  value={formData.categoryId ?? ''}
                  onChange={handleCategoryChange}
                  className="input-field"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {error && <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>{error}</p>}

          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => navigate('/gastos')} disabled={guardando}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={guardando}>
              {expense.status === 'Aprobado' ? <Save size={18} /> : <Check size={18} />}
              {guardando ? 'Guardando...' : expense.status === 'Aprobado' ? 'Guardar Cambios' : 'Confirmar Gasto'}
            </button>
          </div>
        </div>
      </div>

      {mostrarModalPago && (
        <Modal onClose={() => setMostrarModalPago(false)}>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Añadir Pago</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="form-label">Medio de Pago</label>
                <select name="medio" value={pagoForm.medio} onChange={handlePagoChange} className="input-field">
                  <option value="yape">Yape</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="form-label">N° de Operación (opcional)</label>
                <input
                  type="text"
                  name="numero_operacion"
                  value={pagoForm.numero_operacion}
                  onChange={handlePagoChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="form-label">Monto (opcional)</label>
                <div className="amount-input-wrap">
                  <span className="amount-currency">{expense.currency}</span>
                  <input
                    type="number"
                    name="monto"
                    value={pagoForm.monto}
                    onChange={handlePagoChange}
                    className="input-field amount-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Captura de pago (opcional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPagoImagen(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>

              {errorPago && <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>{errorPago}</p>}

              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setMostrarModalPago(false)} disabled={guardandoPago}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleGuardarPago} disabled={guardandoPago}>
                  {guardandoPago ? 'Guardando...' : 'Guardar Pago'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpenseDetail;