// src/components/LoginContainer/LoginContainer.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logincontainer.css';

export default function LoginContainer() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', { email, password });
        // Aqui você pode validar ou autenticar o usuário
    };

    return (
        <div className="login-container">
            <div className="box">
                <h2>Login</h2>
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
