import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            await login(email, password);
            const destino = location.state?.from?.pathname || '/';
            navigate(destino, { replace: true });
        } catch (err) {
            setError(err.message || 'No se pudo iniciar sesión');
        } finally {
            setEnviando(false);
        }
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
                        <input
                            type="email"
                            className="input-field"
                            placeholder="tucorreo@suregg.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm" style={{ color: 'var(--danger, #e11d48)' }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }} disabled={enviando}>
                        {enviando ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;