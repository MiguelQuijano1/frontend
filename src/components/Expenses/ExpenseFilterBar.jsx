import React from 'react';
import { Search } from 'lucide-react';

/**
 * Componente ExpenseFilterBar
 * Muestra los botones de filtro por estado/tipo y una barra de búsqueda.
 * 
 * @param {string} filter - El filtro actualmente seleccionado.
 * @param {Function} setFilter - Función para actualizar el filtro seleccionado.
 */
const ExpenseFilterBar = ({ filter, setFilter }) => {
  // Lista de filtros predefinidos
  const filterOptions = ['Todos', 'Empresa', 'Personal', 'Requiere Revisión', 'Posible Duplicado'];

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      {/* Botones de Filtro Rápido */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`badge cursor-pointer ${
              filter === f 
                ? 'badge-info' // Estilo activo
                : 'badge-neutral border border-color' // Estilo inactivo
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      
      {/* Barra de Búsqueda de Texto */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', left: '1rem', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-muted)' 
          }} 
        />
        <input 
          type="text" 
          placeholder="Buscar proveedor o categoría..." 
          className="input-field"
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
