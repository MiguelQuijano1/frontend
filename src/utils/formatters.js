/**
 * Utilidades para formatear datos en la aplicación.
 * Centralizar el formateo nos permite cambiar reglas globales 
 * (como cambiar de Soles a Dólares, o el formato de fecha) 
 * modificando un solo archivo.
 */

/**
 * Formatea un número como moneda (Soles peruanos).
 * 
 * @param {number} amount - La cantidad a formatear.
 * @returns {string} El monto formateado (ej. "S/ 1,200.50").
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'S/ 0.00';
  
  // Usamos Intl.NumberFormat para formatear con separadores de miles y decimales
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
};

/**
 * Formatea un string o timestamp de fecha a una fecha legible.
 * 
 * @param {string|number|Date} dateString - La fecha a formatear.
 * @returns {string} Fecha formateada localmente (ej. "15/08/2023").
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha inválida';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
