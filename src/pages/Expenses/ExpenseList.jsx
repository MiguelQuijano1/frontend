import React, { useState } from 'react';
import { expensesMock } from '../../mocks/expensesData';
import ExpenseFilterBar from '../../components/Expenses/ExpenseFilterBar';
import ExpenseTable from '../../components/Expenses/ExpenseTable';

const ExpenseList = () => {
  const [filter, setFilter] = useState('Todos');

  const filteredExpenses = expensesMock.filter(exp => {
    if (filter === 'Todos') return true;
    if (filter === 'Requiere Revisión' || filter === 'Posible Duplicado') return exp.status === filter;
    if (filter === 'Sin Comprobante') return !exp.comprobantes || exp.comprobantes.length === 0;
    return exp.type === filter;
  });

  return (
    <div className="flex flex-col gap-6">
      <ExpenseFilterBar filter={filter} setFilter={setFilter} />
      <div className="card p-0 overflow-hidden">
        <ExpenseTable expenses={filteredExpenses} showType={true} />
      </div>
    </div>
  );
};

export default ExpenseList;