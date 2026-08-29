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

const ExpensesChart = ({ companyTotal, personalTotal }) => {
  const data = [
    { name: 'Gastos Empresa', value: companyTotal },
    { name: 'Gastos Personales', value: personalTotal },
  ];

  const COLORS = ['#A9762F', '#1F7A5C'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '0.75rem 1rem' }}>
          <p className="text-sm font-medium text-secondary mb-2">{payload[0].name}</p>
          <p className="text-lg font-bold text-primary font-mono">
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