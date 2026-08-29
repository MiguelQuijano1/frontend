import { useMemo } from 'react';
import { expensesMock } from '../mocks/expensesData';

// Centraliza el filtrado de gastos, hoy sobre el mock, mañana sobre la API real.
export const useExpenses = (filter = 'Todos') => {
    return useMemo(() => {
        return expensesMock.filter(exp => {
            if (filter === 'Todos') return true;
            if (filter === 'Requiere Revisión' || filter === 'Posible Duplicado') return exp.status === filter;
            if (filter === 'Sin Comprobante') return !exp.comprobantes || exp.comprobantes.length === 0;
            return exp.type === filter;
        });
    }, [filter]);
};