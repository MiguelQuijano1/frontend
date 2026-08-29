import React from 'react';

const Settings = () => (
    <div className="flex flex-col gap-6">
        <div>
            <p className="eyebrow mb-2">Sistema</p>
            <h2 className="text-xl">Configuración</h2>
        </div>

        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Canales de captura</h3>
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-medium">Telegram</div>
                    <div className="text-sm text-secondary">Bot conectado para recibir fotos, audios y texto</div>
                </div>
                <span className="badge badge-success">Conectado</span>
            </div>
        </div>

        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Política de retención de archivos</h3>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                    <span className="text-secondary">Datos estructurados (gastos)</span>
                    <span className="font-medium">Permanente</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-secondary">Fotografías</span>
                    <span className="font-medium">60 días</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-secondary">Audios originales</span>
                    <span className="font-medium">30 días</span>
                </div>
            </div>
        </div>
    </div>
);

export default Settings;