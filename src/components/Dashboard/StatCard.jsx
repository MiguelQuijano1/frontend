import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * Componente StatCard
 * Muestra una tarjeta de estadística principal en el Dashboard.
 * 
 * @param {string} title - Título descriptivo (ej. "Gastos Hoy").
 * @param {number} amount - Monto monetario a mostrar.
 * @param {ReactNode} icon - Ícono de Lucide-React.
 * @param {string} type - 'neutral', 'success', o 'primary' para cambiar el color del ícono.
 */
const StatCard = ({ title, amount, icon, type = 'neutral' }) => {
  return (
    <div className="card flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">{title}</h3>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(amount)}
        </p>
      </div>
      <div 
        className={`flex items-center justify-center p-3 rounded-xl ${
          type === 'success' ? 'bg-success-light text-success' : 
          type === 'primary' ? 'bg-primary-light text-accent' : 
          'bg-tertiary text-secondary'
        }`}
        style={{
          // Mantenemos estos estilos inline para los fondos rgba (o podrías pasarlos a index.css)
          backgroundColor: type === 'neutral' ? 'var(--bg-tertiary)' : 
                          type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          color: type === 'neutral' ? 'var(--text-secondary)' : 
                 type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
