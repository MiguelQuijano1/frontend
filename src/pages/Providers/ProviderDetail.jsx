import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { providersMock, expensesMock } from '../../mocks/expensesData';
import ExpenseTable from '../../components/Expenses/ExpenseTable';

const ProviderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [rule, setRule] = useState(null);

    useEffect(() => {
        const p = providersMock.find(pr => pr.id === id);
        setProvider(p);
        setRule(p);
    }, [id]);

    if (!provider) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    const providerExpenses = expensesMock.filter(e => e.provider === provider.name);

    return (
        <div className="flex flex-col gap-6">
            <div className="expense-detail-header">
                <button onClick={() => navigate('/proveedores')} className="btn btn-outline expense-back-btn">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-display">{provider.name}</h2>
                    <p className="text-sm text-secondary">{provider.timesUsed} gastos registrados con este proveedor</p>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Regla de clasificación aprendida</h3>
                <p className="text-sm text-secondary mb-4">
                    Sugerencia automática que se aplicará la próxima vez que aparezca este proveedor. Puedes corregirla.
                </p>
                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Tipo</label>
                        <select className="input-field" value={rule.defaultType} onChange={e => setRule({ ...rule, defaultType: e.target.value })}>
                            <option value="Empresa">Empresa</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Categoría</label>
                        <input className="input-field" value={rule.defaultCategory} onChange={e => setRule({ ...rule, defaultCategory: e.target.value })} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Proyecto por defecto</label>
                        <input className="input-field" value={rule.defaultProject || ''} onChange={e => setRule({ ...rule, defaultProject: e.target.value })} placeholder="Ninguno" />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="btn btn-primary"><Save size={16} /> Guardar regla</button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <h3 className="text-lg font-semibold" style={{ padding: '1.5rem 1.5rem 0' }}>Historial de gastos</h3>
                <ExpenseTable expenses={providerExpenses} showType={true} />
            </div>
        </div>
    );
};

export default ProviderDetail;