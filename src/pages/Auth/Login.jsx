import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <div className="card" style={{ width: '100%', maxWidth: 380 }}>
                <div className="flex flex-col items-center mb-6">
                    <span className="brand-seal" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>S</span>
                    <h2 className="text-xl font-display">SUREGG</h2>
                    <p className="text-sm text-secondary">Ingresa a tu cuenta</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Correo</label>
                        <input type="email" className="input-field" placeholder="tucorreo@suregg.com" required />
                    </div>
                    <div>
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="input-field" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;