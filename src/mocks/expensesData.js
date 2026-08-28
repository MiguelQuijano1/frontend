export const expensesMock = [
  {
    id: '1',
    date: '2023-10-25T10:30:00Z',
    amount: 125.50,
    currency: 'PEN',
    type: 'Empresa', // Personal / Empresa
    category: 'Materia prima',
    project: 'Pedido Dragon',
    provider: 'Textiles Pérez',
    paymentMethod: 'Yape',
    status: 'Aprobado', // Aprobado, Requiere Revisión, Posible Duplicado
    confidence: 'Alta', // Alta, Media, Baja
    evidenceUrl: new URL('../assets/imgBoletas/Boleta1.png', import.meta.url).href,
    evidenceType: 'image/jpeg',
    user: 'Wilber'
  },
  {
    id: '2',
    date: '2023-10-26T14:15:00Z',
    amount: 45.00,
    currency: 'PEN',
    type: 'Empresa',
    category: 'Herramientas',
    project: 'Producción general',
    provider: 'Ferretería Central',
    paymentMethod: 'Transferencia',
    status: 'Requiere Revisión',
    confidence: 'Media',
    evidenceUrl: new URL('../assets/imgBoletas/Boleta2.png', import.meta.url).href,
    evidenceType: 'image/jpeg',
    user: 'Wilber'
  },
  {
    id: '3',
    date: '2023-10-26T09:00:00Z',
    amount: 27.00,
    currency: 'PEN',
    type: 'Personal',
    category: 'Alimentación',
    project: null,
    provider: 'Bodega Don Pepe',
    paymentMethod: 'Efectivo',
    status: 'Aprobado',
    confidence: 'Alta',
    evidenceUrl: null, // Podría ser un audio en un caso real
    evidenceType: 'audio/mp3',
    transcription: 'Compré pan, tomate y leche por 27 soles',
    user: 'Wilber'
  },
  {
    id: '4',
    date: '2023-10-27T11:45:00Z',
    amount: 500.00,
    currency: 'PEN',
    type: 'Empresa',
    category: 'Papel',
    project: 'Inventario',
    provider: 'Papelera Nacional',
    paymentMethod: 'Yape',
    status: 'Posible Duplicado',
    confidence: 'Baja',
    evidenceUrl: new URL('../assets/imgBoletas/Boleta4.png', import.meta.url).href,
    evidenceType: 'image/jpeg',
    user: 'María'
  },
  {
    id: '5',
    date: '2023-10-27T11:45:00Z',
    amount: 500.00,
    currency: 'PEN',
    type: 'Empresa',
    category: 'Papel',
    project: 'Inventario',
    provider: 'Papelera Nacional',
    paymentMethod: 'Yape',
    status: 'Aprobado',
    confidence: 'Alta',
    evidenceUrl: new URL('../assets/imgBoletas/Boleta5.png', import.meta.url).href,
    evidenceType: 'image/jpeg',
    user: 'Wilber'
  },
  {
    id: '6',
    date: '2026-07-20T10:00:00Z',
    amount: 368.50,
    currency: 'PEN',
    type: 'Empresa',
    category: 'Producción textil',
    project: 'Pedido Willy Surquillo',
    provider: 'ROMMAX\'S FÁBRICA',
    paymentMethod: 'Por definir',
    status: 'Requiere Revisión',
    confidence: 'Media',
    evidenceUrl: new URL('../assets/imgBoletas/Boleta6.png', import.meta.url).href,
    evidenceType: 'image/jpeg',
    user: 'Admin'
  }
];

export const summaryMock = {
  today: 125.50,
  week: 697.50,
  month: 2450.00,
  personal: 150.00,
  company: 2300.00
};
