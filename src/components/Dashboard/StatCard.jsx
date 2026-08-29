import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const StatCard = ({ title, amount, icon, type = 'neutral' }) => {
  const iconClass = {
    success: 'icon-badge-success',
    primary: 'icon-badge-primary',
    neutral: 'icon-badge-neutral',
  }[type];

  return (
    <div className="card flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">{title}</h3>
        <p className="text-2xl font-bold text-primary font-mono">
          {formatCurrency(amount)}
        </p>
      </div>
      <div className={`icon-badge ${iconClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;