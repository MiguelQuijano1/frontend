import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfidenceBadge from '../Expenses/ConfidenceBadge';

const ReviewCard = ({ expense, onApprove }) => {
    const navigate = useNavigate();

    return (
        <div className="card flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <div className="icon-badge icon-badge-neutral">
                    <span className="font-mono text-sm">#{expense.id.slice(-3)}</span>
                </div>
                <div>
                    <div className="font-medium">{expense.provider || 'Proveedor sin identificar'}</div>
                    <div className="text-sm text-secondary">
                        {expense.category} · {formatDate(expense.date)} · {expense.user}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <span className="font-mono font-semibold text-lg">{formatCurrency(expense.amount)}</span>
                <ConfidenceBadge level={expense.confidence} />
                <div className="flex gap-2">
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => navigate(`/gastos/${expense.id}`)}>
                        <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-danger)' }}>
                        <X size={16} />
                    </button>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 0.9rem' }} onClick={() => onApprove(expense.id)}>
                        <Check size={16} /> Aprobar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;