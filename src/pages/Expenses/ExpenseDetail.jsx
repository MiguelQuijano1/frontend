import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Save, AlertTriangle, FileText, Image as ImageIcon, Mic } from 'lucide-react';
import { expensesMock } from '../../mocks/expensesData';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const data = expensesMock.find(e => e.id === id);
    if (data) {
      setExpense(data);
      setFormData(data);
    }
  }, [id]);

  if (!expense) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Aquí se enviaría al backend
    alert('Datos guardados/confirmados simulados');
    navigate('/gastos');
  };

  const renderEvidence = () => {
    if (expense.evidenceType.startsWith('image')) {
      return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {expense.evidenceUrl ? (
            <img src={expense.evidenceUrl} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
              <ImageIcon size={48} style={{ marginBottom: '1rem' }} />
              <p>Imagen no disponible</p>
            </div>
          )}
        </div>
      );
    }
    if (expense.evidenceType.startsWith('audio')) {
      return (
        <div style={{ width: '100%', padding: '2rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <Mic size={24} />
             </div>
             <div>
               <h4 style={{ fontWeight: 600 }}>Audio Original</h4>
               <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enviado por {expense.user}</p>
             </div>
           </div>
           
           <div className="card" style={{ backgroundColor: 'var(--bg-primary)' }}>
             <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Transcripción de IA</h5>
             <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>"{expense.transcription}"</p>
           </div>
        </div>
      );
    }
    return <div style={{ padding: '2rem', textAlign: 'center' }}><FileText size={48} color="var(--text-muted)" /></div>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/gastos')} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Revisión de Gasto #{expense.id.padStart(4, '0')}
            {expense.status === 'Posible Duplicado' && <span className="badge badge-danger"><AlertTriangle size={14} style={{ marginRight: '0.25rem' }}/> Posible Duplicado</span>}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Registrado el {new Date(expense.date).toLocaleString()} por {expense.user}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Panel Izquierdo: Evidencia */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Evidencia Recibida</h3>
          {renderEvidence()}
        </div>

        {/* Panel Derecho: Datos Extraídos y Formulario */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Datos Extraídos por IA</h3>
            <span className={`badge ${expense.confidence === 'Alta' ? 'badge-success' : expense.confidence === 'Media' ? 'badge-warning' : 'badge-danger'}`}>
              Confianza IA: {expense.confidence}
            </span>
          </div>
          
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Monto</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{formData.currency}</span>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" style={{ fontSize: '1.125rem', fontWeight: 600 }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Medio de Pago</label>
                <input type="text" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Proveedor</label>
              <input type="text" name="provider" value={formData.provider} onChange={handleChange} className="input-field" />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tipo de Gasto</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                  <option value="Empresa">Empresa</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Categoría</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className="input-field" />
              </div>
            </div>

            {formData.type === 'Empresa' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Proyecto / Pedido asociado</label>
                <input type="text" name="project" value={formData.project || ''} onChange={handleChange} className="input-field" placeholder="Ej. Pedido Dragon" />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-outline" onClick={() => navigate('/gastos')}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {expense.status === 'Aprobado' ? <Save size={18} /> : <Check size={18} />}
              {expense.status === 'Aprobado' ? 'Guardar Cambios' : 'Confirmar Gasto'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
