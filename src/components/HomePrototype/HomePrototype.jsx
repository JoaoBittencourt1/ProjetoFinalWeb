import React, { useState } from 'react';
import './HomePrototype.css';

export default function HomePrototype() {
    const [showProfile, setShowProfile] = useState(false);

    const mockUser = {
        name: "Usuário Exemplo",
        email: "usuario@exemplo.com",
        profilePic: "https://via.placeholder.com/50"
    };

    return (
        <div className="home-wrapper">
            <header className="header">
                <button className="home-button">🏠 Home</button>
                <div className="profile-section">
                    <button className="profile-toggle" onClick={() => setShowProfile(!showProfile)}>
                        👤
                    </button>
                    {showProfile && (
                        <div className="profile-dropdown">
                            <img src={mockUser.profilePic} alt="Foto de perfil" />
                            <p><strong>{mockUser.name}</strong></p>
                            <p>{mockUser.email}</p>
                        </div>
                    )}
                </div>
            </header>
            <main className="main-content">
                <h1>Bem-vindo à rede social!</h1>
                <p>Essa é uma tela inicial fictícia que será integrada ao projeto futuramente.</p>
            </main>
        </div>
    );
}
