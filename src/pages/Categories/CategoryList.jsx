import React from 'react';
import { Tags } from 'lucide-react';
import { categoriesMock } from '../../mocks/expensesData';

const CategoryList = () => (
    <div className="flex flex-col gap-6">
        <div>
            <p className="eyebrow mb-2">Gestión</p>
            <h2 className="text-xl">Categorías</h2>
        </div>

        <div className="card p-0 overflow-hidden">
            <table className="table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Aplica a</th>
                        <th>N° de Gastos</th>
                    </tr>
                </thead>
                <tbody>
                    {categoriesMock.map(c => (
                        <tr key={c.id}>
                            <td className="flex items-center gap-2 font-medium">
                                <Tags size={16} color="var(--text-muted)" /> {c.name}
                            </td>
                            <td><span className="badge badge-neutral">{c.type}</span></td>
                            <td className="font-mono">{c.expenseCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default CategoryList;