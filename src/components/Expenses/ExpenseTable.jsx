import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Componente ExpenseTable
 * Renderiza una tabla de gastos de forma responsiva.
 * 
 * @param {Array} expenses - Lista de gastos a renderizar.
 * @param {boolean} showType - (Opcional) Indica si se debe mostrar la columna "Tipo" (Empresa/Personal).
 */
const ExpenseTable = ({ expenses, showType = true }) => {
  const navigate = useNavigate();

  // Helper para renderizar el ícono de estado (Aprobado, Revisión, etc.)
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Aprobado': return <CheckCircle size={16} />;
      case 'Requiere Revisión': return <HelpCircle size={16} />;
      case 'Posible Duplicado': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="table-container">
      <table className="table responsive-table">
        <thead className="bg-primary">
          <tr>
            <th>ID / Fecha</th>
            <th>Detalle</th>
            {/* Renderizado condicional de la columna "Tipo" */}
            {showType && <th>Tipo</th>}
            <th>Monto</th>
            <th>Estado IA</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeo de gastos para crear filas */}
          {expenses.map(expense => (
            <tr 
              key={expense.id} 
              className="cursor-pointer"
              // Navegar al detalle del gasto al hacer clic en la fila
              onClick={() => navigate(`/gastos/${expense.id}`)}
            >
              <td data-label="ID / Fecha">
                <div className="font-medium">#{expense.id.padStart(4, '0')}</div>
                <div className="text-sm text-secondary">
                  {formatDate(expense.date)}
                </div>
              </td>
              <td data-label="Detalle">
                <div className="font-medium">{expense.provider}</div>
                <div className="text-sm text-secondary">
                  {expense.category} {expense.project ? `• ${expense.project}` : ''}
                </div>
              </td>
              
              {/* Columna "Tipo" Condicional */}
              {showType && (
                <td data-label="Tipo">
                  <span className={`badge ${expense.type === 'Empresa' ? 'badge-info' : 'badge-neutral'}`}>
                    {expense.type}
                  </span>
                </td>
              )}

              <td data-label="Monto" className="font-semibold text-primary">
                {formatCurrency(expense.amount)}
              </td>
              <td data-label="Estado">
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    expense.status === 'Aprobado' ? 'badge-success' : 
                    expense.status === 'Requiere Revisión' ? 'badge-warning' : 
                    'badge-danger'
                  } gap-1`}>
                    {getStatusIcon(expense.status)}
                    {expense.status}
                  </span>
                  {/* Se asume que expenses de Dashboard puede no tener confidence, lo mostramos si existe */}
                  {expense.confidence && (
                    <span className="text-xs text-muted">Confianza: {expense.confidence}</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mensaje de estado vacío */}
      {expenses.length === 0 && (
        <div className="p-12 text-center text-muted">
          No se encontraron gastos.
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
