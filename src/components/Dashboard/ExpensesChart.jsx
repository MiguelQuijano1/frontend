import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

/**
 * Componente ExpensesChart
 * Muestra un gráfico de dona con la distribución de gastos de Empresa vs Personales.
 * Usa Recharts para el renderizado interactivo.
 * 
 * @param {number} companyTotal - Total de gastos de empresa.
 * @param {number} personalTotal - Total de gastos personales.
 */
const ExpensesChart = ({ companyTotal, personalTotal }) => {
  // Datos para alimentar el gráfico
  const data = [
    { name: 'Gastos Empresa', value: companyTotal },
    { name: 'Gastos Personales', value: personalTotal },
  ];

  // Colores (Coinciden con var(--accent-primary) y var(--accent-secondary))
  const COLORS = ['#3b82f6', '#10b981'];

  // Tooltip personalizado para formatear el número como Moneda (Soles)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 shadow-lg border-0 bg-secondary" style={{ zIndex: 100 }}>
          <p className="text-sm font-medium mb-1">{payload[0].name}</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{ outline: 'none' }} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesChart;
