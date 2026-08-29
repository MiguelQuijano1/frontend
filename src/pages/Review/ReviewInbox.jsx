import React, { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { expensesMock } from '../../mocks/expensesData';
import ReviewCard from '../../components/Review/ReviewCard';
import EmptyState from '../../components/common/EmptyState';

const ReviewInbox = () => {
    const [pending, setPending] = useState(
        expensesMock.filter(e => e.status === 'Requiere Revisión')
    );

    const handleApprove = (id) => {
        setPending(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="eyebrow mb-2">Bandeja de revisión</p>
                <h2 className="text-xl">{pending.length} gastos pendientes de confirmar</h2>
            </div>

            {pending.length === 0 ? (
                <EmptyState
                    icon={<ClipboardCheck size={26} />}
                    title="No hay nada pendiente"
                    description="Todos los gastos capturados han sido revisados."
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {pending.map(exp => (
                        <ReviewCard key={exp.id} expense={exp} onApprove={handleApprove} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewInbox;