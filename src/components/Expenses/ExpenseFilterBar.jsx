import React from 'react';
import { Search } from 'lucide-react';

const ExpenseFilterBar = ({ filter, setFilter }) => {
  const filterOptions = ['Todos', 'Empresa', 'Personal', 'Requiere Revisión', 'Posible Duplicado', 'Sin Comprobante'];

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip ${filter === f ? 'chip-active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Buscar proveedor o categoría..." className="input-field" style={{ paddingLeft: '2.5rem' }} />
      </div>
    </div>
  );
};

export default ExpenseFilterBar;