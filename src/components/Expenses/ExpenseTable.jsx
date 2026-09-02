import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpenseTable = ({ expenses, showType = true }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobado': return <CheckCircle size={16} />;
      case 'Requiere Revisión': return <HelpCircle size={16} />;
      case 'Posible Duplicado': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="table-container">
      <table className="table responsive-table">
        <thead>
          <tr>
            <th>ID / Fecha</th>
            <th>Detalle</th>
            {showType && <th>Tipo</th>}
            <th>Monto</th>
            <th>Estado IA</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className={`cursor-pointer animate-slide-up delay-${(index % 4 + 1) * 100}`}
              onClick={() => navigate(`/gastos/${expense.id}`)}
            >
              <td data-label="ID / Fecha">
                <div className="font-medium font-mono">#{expense.id.padStart(4, '0')}</div>
                <div className="text-sm text-secondary">{formatDate(expense.date)}</div>
              </td>
              <td data-label="Detalle">
                <div className="font-medium">{expense.provider}</div>
                <div className="text-sm text-secondary">
                  {expense.category || 'Sin categoría'} {expense.project ? `• ${expense.project}` : ''}
                </div>
              </td>

              {showType && (
                <td data-label="Tipo">
                  <span className={`badge ${expense.type === 'Empresa' ? 'badge-info' : 'badge-neutral'}`}>
                    {expense.type}
                  </span>
                </td>
              )}

              <td data-label="Monto" className="font-semibold text-primary font-mono">
                {formatCurrency(expense.amount)}
              </td>
              <td data-label="Estado">
                <div className="flex items-center gap-2">
                  <span className={`badge ${expense.status === 'Aprobado' ? 'badge-success' :
                    expense.status === 'Requiere Revisión' ? 'badge-warning' :
                      'badge-danger'
                    } gap-1`}>
                    {getStatusIcon(expense.status)}
                    {expense.status}
                  </span>
                  {expense.confidence && (
                    <span className="text-xs text-muted">Confianza: {expense.confidence}</span>
                  )}
                </div>
              </td>

              <td className="text-right">
                <ChevronRight size={18} className="hover-reveal-icon text-muted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {expenses.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">
          No se encontraron gastos.
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;