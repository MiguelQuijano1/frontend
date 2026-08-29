import React from 'react';
import { formatConfidence } from '../../utils/formatters';

const ConfidenceBadge = ({ level }) => {
    const className = level === 'Alta' ? 'badge-success' : level === 'Media' ? 'badge-warning' : 'badge-danger';
    return <span className={`badge ${className}`}>{formatConfidence(level)}</span>;
};

export default ConfidenceBadge;