import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { expensesMock } from '../../mocks/expensesData';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todos');

  const filteredExpenses = expensesMock.filter(exp => {
    if (filter === 'Todos') return true;
    if (filter === 'Requiere Revisión' || filter === 'Posible Duplicado') {
       return exp.status === filter;
    }
    return exp.type === filter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Aprobado': return <CheckCircle size={16} />;
      case 'Requiere Revisión': return <HelpCircle size={16} />;
      case 'Posible Duplicado': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Todos', 'Empresa', 'Personal', 'Requiere Revisión', 'Posible Duplicado'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'badge badge-info' : 'badge'}
              style={{ cursor: 'pointer', border: '1px solid var(--border-color)', background: filter === f ? '' : 'var(--bg-primary)', color: filter === f ? '' : 'var(--text-secondary)' }}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar proveedor o categoría..." 
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID / Fecha</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Detalle</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Tipo</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Monto</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado IA</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr 
                key={expense.id} 
                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onClick={() => navigate(`/gastos/${expense.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>#{expense.id.padStart(4, '0')}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>{expense.provider}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {expense.category} {expense.project ? `• ${expense.project}` : ''}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${expense.type === 'Empresa' ? 'badge-info' : ''}`} style={expense.type !== 'Empresa' ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}>
                    {expense.type}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                  S/ {expense.amount.toFixed(2)}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${expense.status === 'Aprobado' ? 'badge-success' : expense.status === 'Requiere Revisión' ? 'badge-warning' : 'badge-danger'}`} style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      {getStatusIcon(expense.status)}
                      {expense.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confianza: {expense.confidence}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron gastos con estos filtros.
          </div>
        )}
      </div>

    </div>
  );
};

export default ExpenseList;
