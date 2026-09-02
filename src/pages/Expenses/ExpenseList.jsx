import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseFilterBar from '../../components/Expenses/ExpenseFilterBar';
import ExpenseTable from '../../components/Expenses/ExpenseTable';

const ExpenseList = () => {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const { expenses, cargando, error, recargar } = useExpenses(filter, search);

  return (
    <div className="flex flex-col gap-6">
      <ExpenseFilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />

      {error ? (
        <div className="card flex items-center justify-between gap-4" style={{ padding: '1.25rem 1.5rem' }}>
          <span className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>{error}</span>
          <button className="btn btn-outline flex items-center gap-2" onClick={recargar}>
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      ) : cargando ? (
        <div className="card text-center text-secondary" style={{ padding: '3rem' }}>
          Cargando gastos…
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <ExpenseTable expenses={expenses} showType={true} />
        </div>
      )}
    </div>
  );
};

export default ExpenseList;