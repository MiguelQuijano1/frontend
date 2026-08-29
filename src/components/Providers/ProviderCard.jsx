import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ProviderCard = ({ provider }) => (
    <Link to={`/proveedores/${provider.id}`} className="card flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="icon-badge icon-badge-info"><Building2 size={20} /></div>
            <div>
                <div className="font-medium">{provider.name}</div>
                <div className="text-sm text-secondary">
                    Última vez: {formatDate(provider.lastUsed)}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`badge ${provider.defaultType === 'Empresa' ? 'badge-info' : 'badge-neutral'}`}>{provider.defaultType}</span>
            <span className="badge badge-neutral">{provider.timesUsed} veces</span>
        </div>
    </Link>
);

export default ProviderCard;