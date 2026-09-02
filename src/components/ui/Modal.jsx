import React, { useEffect } from 'react';

// Modal simple: fondo oscuro clicable para cerrar + tecla Escape.
// El contenido (children) va dentro de un .card, así hereda el mismo
// estilo que el resto de la app sin duplicar CSS.
const Modal = ({ onClose, children }) => {
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;