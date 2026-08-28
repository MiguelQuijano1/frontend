import React from 'react';
import { TrendingUp, DollarSign, Briefcase, User } from 'lucide-react';
import { summaryMock, expensesMock } from '../../mocks/expensesData';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import ExpenseTable from '../../components/Expenses/ExpenseTable';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  // Tomamos solo los 5 gastos más recientes para el resumen
  const recentExpenses = expensesMock.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      
      {/* SECCIÓN 1: Tarjetas de Resumen General */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
        <div className="grid grid-cols-stats gap-6">
          <StatCard title="Gastos Hoy" amount={summaryMock.today} icon={<TrendingUp size={24} />} type="success" />
          <StatCard title="Gastos esta Semana" amount={summaryMock.week} icon={<DollarSign size={24} />} type="primary" />
          <StatCard title="Gastos del Mes" amount={summaryMock.month} icon={<DollarSign size={24} />} />
        </div>
      </section>

      {/* SECCIÓN 2: Resumen por Tipos (Empresa vs Personal) */}
      <section className="grid grid-cols-summary gap-6">
        <div className="card">
           <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
             <Briefcase size={20} color="var(--accent-primary)" />
             Gastos Empresa
           </h3>
           <p className="text-3xl font-bold">{formatCurrency(summaryMock.company)}</p>
        </div>
        <div className="card">
           <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
             <User size={20} color="var(--accent-secondary)" />
             Gastos Personales
           </h3>
           <p className="text-3xl font-bold">{formatCurrency(summaryMock.personal)}</p>
        </div>
      </section>

      {/* SECCIÓN 3: Tabla de Gastos Recientes (Componente Reutilizado) */}
      <section className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-color">
          <h2 className="text-xl font-semibold">Gastos Recientes</h2>
          <Link to="/gastos" className="btn btn-outline text-sm py-1 px-3">Ver todos</Link>
        </div>
        
        {/* Usamos el nuevo componente compartido de tabla */}
        <ExpenseTable expenses={recentExpenses} showType={true} />
      </section>

    </div>
  );
};

export default Dashboard;
