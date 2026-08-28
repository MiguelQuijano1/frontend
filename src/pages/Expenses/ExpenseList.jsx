import React, { useState } from 'react';
import { expensesMock } from '../../mocks/expensesData';
import ExpenseFilterBar from '../../components/Expenses/ExpenseFilterBar';
import ExpenseTable from '../../components/Expenses/ExpenseTable';

const ExpenseList = () => {
  // Estado para el filtro actual ("Todos", "Empresa", etc.)
  const [filter, setFilter] = useState('Todos');

  // Filtramos la lista de gastos basada en la selección actual
  const filteredExpenses = expensesMock.filter(exp => {
    if (filter === 'Todos') return true;
    if (filter === 'Requiere Revisión' || filter === 'Posible Duplicado') {
       return exp.status === filter;
    }
    return exp.type === filter;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* SECCIÓN 1: Filtros y Búsqueda */}
      <ExpenseFilterBar filter={filter} setFilter={setFilter} />

      {/* SECCIÓN 2: Tabla de Gastos */}
      <div className="card p-0 overflow-hidden">
        {/* Reutilizamos el componente ExpenseTable para mostrar los datos filtrados */}
        <ExpenseTable expenses={filteredExpenses} showType={true} />
      </div>

    </div>
  );
};

export default ExpenseList;
