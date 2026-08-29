import React from 'react';
import { Copy } from 'lucide-react';
import { duplicatesMock, expensesMock } from '../../mocks/expensesData';
import DuplicateComparisonCard from '../../components/Duplicates/DuplicateComparisonCard';
import EmptyState from '../../components/common/EmptyState';

const DuplicatesReview = () => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="eyebrow mb-2">Detección de duplicados</p>
                <h2 className="text-xl">{duplicatesMock.length} posibles duplicados</h2>
            </div>

            {duplicatesMock.length === 0 ? (
                <EmptyState icon={<Copy size={26} />} title="Sin duplicados detectados" description="No se encontraron coincidencias sospechosas." />
            ) : (
                <div className="flex flex-col gap-4">
                    {duplicatesMock.map(d => {
                        const expenseA = expensesMock.find(e => e.id === d.expenseAId);
                        const expenseB = expensesMock.find(e => e.id === d.expenseBId);
                        if (!expenseA || !expenseB) return null;
                        return <DuplicateComparisonCard key={d.id} duplicate={d} expenseA={expenseA} expenseB={expenseB} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default DuplicatesReview;