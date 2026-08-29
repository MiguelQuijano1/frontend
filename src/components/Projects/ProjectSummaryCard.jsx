import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ProjectSummaryCard = ({ project }) => {
    const percentage = project.budget > 0 ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : null;

    return (
        <Link to={`/proyectos/${project.id}`} className="card flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="icon-badge icon-badge-primary"><FolderKanban size={20} /></div>
                    <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-secondary">{project.client}</div>
                    </div>
                </div>
                <span className={`badge ${project.status === 'Activo' ? 'badge-success' : 'badge-neutral'}`}>{project.status}</span>
            </div>

            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Gastado</span>
                    <span className="font-mono font-semibold">{formatCurrency(project.spent)}{project.budget > 0 && ` / ${formatCurrency(project.budget)}`}</span>
                </div>
                {percentage !== null && (
                    <div style={{ height: 6, borderRadius: 999, backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: percentage > 90 ? 'var(--accent-danger)' : 'var(--accent-primary)' }} />
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProjectSummaryCard;