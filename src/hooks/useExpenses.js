import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

// Traduce cada chip del filtro (ExpenseFilterBar) a query params reales de
// GET /gastos (ver gastos.controller.ts). 'Todos' no agrega nada.
function filtroAQuery(filter) {
    switch (filter) {
        case 'Empresa': return { es_personal: 'false' };
        case 'Personal': return { es_personal: 'true' };
        case 'Requiere Revisión': return { pendiente_revision: 'true' };
        case 'Posible Duplicado': return { posible_duplicado: 'true' };
        case 'Sin Comprobante': return { sin_comprobante: 'true' };
        default: return {};
    }
}

// El backend devuelve la fila cruda de `gastos` + relaciones (categorias,
// proveedores, comprobantes, pagos). Esto la traduce a la forma que ya
// esperan ExpenseTable/ExpenseDetail (antes alimentados por el mock), para
// no tener que tocar esos componentes.
export function mapearGasto(g) {
    let status = 'Aprobado';
    if (g.posible_duplicado_de) status = 'Posible Duplicado';
    else if (g.pendiente_revision) status = 'Requiere Revisión';

    const confidenceLabel = { alta: 'Alta', media: 'Media', baja: 'Baja' };

    return {
        id: String(g.id),
        date: g.fecha || g.creado_en,
        user: g.usuario_nombre || null,
        userId: g.usuario_id ? String(g.usuario_id) : null,
        channel: 'Telegram',
        type: g.es_personal ? 'Personal' : 'Empresa',
        category: g.categorias?.nombre || null,
        // Pedidos/proyectos (RF-11) todavía no existe -- siempre null hasta
        // que exista esa tabla y el join correspondiente.
        project: null,
        provider: g.proveedores?.nombre || g.descripcion || 'Sin proveedor',
        amount: Number(g.monto) || 0,
        currency: 'S/',
        paymentMethod: g.pagos?.[0]?.medio || null,
        status,
        confidence: g.confianza ? confidenceLabel[g.confianza] || g.confianza : null,
        comprobantes: g.comprobantes || [],
        pagos: (g.pagos || []).map((p) => ({ ...p, referencia: p.numero_operacion })),
        // 'imagen'/'pdf' -> 'image' para que ExpenseDetail los muestre igual;
        // la transcripción de audio no se persiste hoy (solo viaja en el
        // momento de la extracción, ver Paso 3 de PROGRESO_SIREGG), así que
        // no llega acá.
        evidencias: (g.evidencias || []).map((ev) => ({
            ...ev,
            tipo: ev.tipo === 'audio' ? 'audio' : 'image',
        })),
    };
}

// Reemplaza el filtrado en memoria sobre el mock por un fetch real a
// GET /gastos. `filter` es el chip activo (ExpenseFilterBar); `search` es
// texto libre que se aplica en el cliente sobre proveedor/categoría, porque
// el backend todavía no expone búsqueda por texto.
export const useExpenses = (filter = 'Todos', search = '') => {
    const [expenses, setExpenses] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargar = useCallback(() => {
        setCargando(true);
        setError('');
        const params = new URLSearchParams(filtroAQuery(filter));
        apiFetch(`/gastos?${params.toString()}`)
            .then((data) => setExpenses((data || []).map(mapearGasto)))
            .catch((err) => setError(err.message || 'Error cargando gastos'))
            .finally(() => setCargando(false));
    }, [filter]);

    useEffect(cargar, [cargar]);

    const texto = search.trim().toLowerCase();
    const filtrados = texto
        ? expenses.filter((e) =>
            (e.provider || '').toLowerCase().includes(texto) ||
            (e.category || '').toLowerCase().includes(texto),
        )
        : expenses;

    return { expenses: filtrados, cargando, error, recargar: cargar };
};