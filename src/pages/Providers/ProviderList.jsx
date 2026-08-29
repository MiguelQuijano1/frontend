import React from 'react';
import { providersMock } from '../../mocks/expensesData';
import ProviderCard from '../../components/Providers/ProviderCard';

const ProviderList = () => (
    <div className="flex flex-col gap-6">
        <div>
            <p className="eyebrow mb-2">Gestión</p>
            <h2 className="text-xl">Proveedores</h2>
        </div>
        <div className="flex flex-col gap-3">
            {providersMock.map(p => <ProviderCard key={p.id} provider={p} />)}
        </div>
    </div>
);

export default ProviderList;