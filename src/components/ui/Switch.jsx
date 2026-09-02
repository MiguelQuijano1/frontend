import React from 'react';

// Toggle simple y accesible. checked/onChange en vez de value/onClick
// para que se comporte como cualquier otro control de formulario.
const Switch = ({ checked, onChange, disabled = false, ariaLabel }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        className="switch"
        onClick={() => onChange(!checked)}
    >
        <span className="switch-thumb" />
    </button>
);

export default Switch;