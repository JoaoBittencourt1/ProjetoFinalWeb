// src/components/LoginContainer/LoginContainer.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logincontainer.css';

export default function LoginContainer() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Salvar dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirecionar para o HomePrototype
            navigate('/home-prototype');
        } catch (err) {
            setError(err.message);
            alert(err.message);
            console.error('Erro no login:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="box">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Entrar</button>
                    <button
                        type="button"
                        className="register-link-button"
                        onClick={() => navigate('/register')}
                    >
                        Criar Nova Conta
                    </button>
                </form>
            </div>
        </div>
    );
}
