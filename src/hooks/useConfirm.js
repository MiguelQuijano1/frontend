import { useState, useCallback } from 'react';

// Lógica compartida de aprobar/confirmar (ReviewInbox, DuplicatesReview, ExpenseDetail).
export const useConfirm = (initialItems = []) => {
    const [items, setItems] = useState(initialItems);

    const approve = useCallback((id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        // Aquí luego irá la llamada real: services/expensesService.confirm(id)
    }, []);

    const reject = useCallback((id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        // Aquí luego irá: services/expensesService.reject(id)
    }, []);

    return { items, approve, reject };
};