import React from 'react';
import { TrendingUp, DollarSign, Briefcase, User } from 'lucide-react';
import { summaryMock, expensesMock, categoriesMock, providersMock } from '../../mocks/expensesData';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard';
import ExpenseTable from '../../components/Expenses/ExpenseTable';
import ExpensesChart from '../../components/Dashboard/ExpensesChart';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  const recentExpenses = expensesMock.slice(0, 5);

  const topCategories = [...categoriesMock].sort((a, b) => b.expenseCount - a.expenseCount).slice(0, 4);
  const topProviders = [...providersMock].sort((a, b) => b.timesUsed - a.timesUsed).slice(0, 4);

  return (
    <div className="flex flex-col gap-8">

      <section>
        <p className="eyebrow mb-2">Vista general</p>
        <h2 className="text-xl mb-4">Resumen General</h2>
        <div className="grid grid-cols-stats gap-6">
          <StatCard title="Gastos Hoy" amount={summaryMock.today} icon={<TrendingUp size={22} />} type="success" />
          <StatCard title="Gastos esta Semana" amount={summaryMock.week} icon={<DollarSign size={22} />} type="primary" />
          <StatCard title="Gastos del Mes" amount={summaryMock.month} icon={<DollarSign size={22} />} />
        </div>
      </section>

      <section className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card flex flex-col items-center justify-center p-6">
          <h3 className="text-lg mb-2 w-full text-left">Distribución de Gastos</h3>
          <ExpensesChart companyTotal={summaryMock.company} personalTotal={summaryMock.personal} />
        </div>

        <div className="flex flex-col gap-6 justify-center">
          <div className="card flex items-center gap-4">
            <div className="icon-badge icon-badge-info"><Briefcase size={22} /></div>
            <div>
              <h3 className="text-sm font-medium text-secondary mb-1">Gastos Empresa</h3>
              <p className="text-2xl font-bold font-mono">{formatCurrency(summaryMock.company)}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="icon-badge icon-badge-success"><User size={22} /></div>
            <div>
              <h3 className="text-sm font-medium text-secondary mb-1">Gastos Personales</h3>
              <p className="text-2xl font-bold font-mono">{formatCurrency(summaryMock.personal)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Desglose por categoría y proveedor */}
      <section className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Categorías</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map(c => (
              <div key={c.id} className="flex justify-between items-center">
                <span className="text-sm text-secondary">{c.name}</span>
                <span className="badge badge-neutral">{c.expenseCount} gastos</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Proveedores</h3>
          <div className="flex flex-col gap-3">
            {topProviders.map(p => (
              <Link key={p.id} to={`/proveedores/${p.id}`} className="flex justify-between items-center">
                <span className="text-sm text-secondary">{p.name}</span>
                <span className="badge badge-info">{p.timesUsed} veces</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="text-xl">Gastos Recientes</h2>
          <Link to="/gastos" className="btn btn-outline text-sm" style={{ padding: '0.4rem 0.9rem' }}>Ver todos</Link>
        </div>
        <ExpenseTable expenses={recentExpenses} showType={true} />
      </section>

    </div>
  );
};

export default Dashboard;