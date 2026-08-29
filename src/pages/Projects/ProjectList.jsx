import React from 'react';
import { projectsMock } from '../../mocks/expensesData';
import ProjectSummaryCard from '../../components/Projects/ProjectSummaryCard';

const ProjectList = () => (
    <div className="flex flex-col gap-6">
        <div>
            <p className="eyebrow mb-2">Gestión</p>
            <h2 className="text-xl">Proyectos y Pedidos</h2>
        </div>
        <div className="grid grid-cols-summary gap-4">
            {projectsMock.map(p => <ProjectSummaryCard key={p.id} project={p} />)}
        </div>
    </div>
);

export default ProjectList;