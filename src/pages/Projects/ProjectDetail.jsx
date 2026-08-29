import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { projectsMock, expensesMock } from '../../mocks/expensesData';
import ExpenseTable from '../../components/Expenses/ExpenseTable';
import { formatCurrency } from '../../utils/formatters';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projectsMock.find(p => p.id === id);

    if (!project) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    const projectExpenses = expensesMock.filter(e => e.project === project.name);

    return (
        <div className="flex flex-col gap-6">
            <div className="expense-detail-header">
                <button onClick={() => navigate('/proyectos')} className="btn btn-outline expense-back-btn">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-display">{project.name}</h2>
                    <p className="text-sm text-secondary">{project.client}</p>
                </div>
            </div>

            <div className="grid grid-cols-stats gap-6">
                <div className="card">
                    <h3 className="text-sm font-medium text-secondary mb-2">Presupuesto</h3>
                    <p className="text-2xl font-bold font-mono">{project.budget > 0 ? formatCurrency(project.budget) : '—'}</p>
                </div>
                <div className="card">
                    <h3 className="text-sm font-medium text-secondary mb-2">Gastado</h3>
                    <p className="text-2xl font-bold font-mono">{formatCurrency(project.spent)}</p>
                </div>
                <div className="card">
                    <h3 className="text-sm font-medium text-secondary mb-2">Estado</h3>
                    <span className={`badge ${project.status === 'Activo' ? 'badge-success' : 'badge-neutral'}`}>{project.status}</span>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <h3 className="text-lg font-semibold" style={{ padding: '1.5rem 1.5rem 0' }}>Gastos asociados</h3>
                <ExpenseTable expenses={projectExpenses} showType={false} />
            </div>
        </div>
    );
};

export default ProjectDetail;