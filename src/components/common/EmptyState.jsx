import React from 'react';

const EmptyState = ({ icon, title, description }) => (
    <div className="card flex flex-col items-center justify-center text-center" style={{ padding: '3rem 2rem' }}>
        <div className="icon-badge icon-badge-neutral mb-4" style={{ width: 56, height: 56 }}>
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-secondary">{description}</p>
    </div>
);

export default EmptyState;