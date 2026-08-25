import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, User } from 'lucide-react';
import { summaryMock, expensesMock } from '../../mocks/expensesData';
import { Link } from 'react-router-dom';

const StatCard = ({ title, amount, icon, type = 'neutral' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>{title}</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          S/ {amount.toFixed(2)}
        </p>
      </div>
      <div style={{ 
        padding: '0.75rem', 
        borderRadius: '12px',
        backgroundColor: type === 'neutral' ? 'var(--bg-tertiary)' : 
                        type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        color: type === 'neutral' ? 'var(--text-secondary)' : 
               type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
      }}>
        {icon}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const recentExpenses = expensesMock.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Resumen General</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <StatCard title="Gastos Hoy" amount={summaryMock.today} icon={<TrendingUp size={24} />} type="success" />
          <StatCard title="Gastos esta Semana" amount={summaryMock.week} icon={<DollarSign size={24} />} type="primary" />
          <StatCard title="Gastos del Mes" amount={summaryMock.month} icon={<DollarSign size={24} />} />
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
           <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Briefcase size={20} color="var(--accent-primary)" />
             Gastos Empresa
           </h3>
           <p style={{ fontSize: '2rem', fontWeight: 700 }}>S/ {summaryMock.company.toFixed(2)}</p>
        </div>
        <div className="card">
           <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <User size={20} color="var(--accent-secondary)" />
             Gastos Personales
           </h3>
           <p style={{ fontSize: '2rem', fontWeight: 700 }}>S/ {summaryMock.personal.toFixed(2)}</p>
        </div>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Gastos Recientes</h2>
          <Link to="/gastos" className="btn btn-outline" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>Ver todos</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Fecha</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Proveedor / Categoría</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Monto</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map(expense => (
                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>{new Date(expense.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{expense.provider}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{expense.category}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>S/ {expense.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${expense.status === 'Aprobado' ? 'badge-success' : expense.status === 'Requiere Revisión' ? 'badge-warning' : 'badge-danger'}`}>
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
