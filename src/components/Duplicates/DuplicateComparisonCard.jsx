import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpenseMiniCard = ({ expense }) => (
    <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <div className="text-sm text-secondary mb-1">#{expense.id.padStart(4, '0')} · {expense.user}</div>
        <div className="font-semibold font-mono text-lg mb-1">{formatCurrency(expense.amount)}</div>
        <div className="text-sm text-secondary">{expense.provider} · {formatDate(expense.date)}</div>
    </div>
);

const DuplicateComparisonCard = ({ duplicate, expenseA, expenseB }) => {
    return (
        <div className="card flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={18} color="var(--accent-danger)" />
                    <span className="font-semibold">{duplicate.matchScore}% de coincidencia</span>
                </div>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <ExpenseMiniCard expense={expenseA} />
                <ExpenseMiniCard expense={expenseB} />
            </div>

            <div>
                <p className="text-xs text-muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Señales coincidentes</p>
                <div className="flex flex-wrap gap-2">
                    {duplicate.signals.map((s, i) => (
                        <span key={i} className="badge badge-neutral">{s}</span>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button className="btn btn-outline"><X size={16} /> Registrar igualmente</button>
                <button className="btn btn-primary"><Check size={16} /> Es el mismo gasto</button>
            </div>
        </div>
    );
};

export default DuplicateComparisonCard;