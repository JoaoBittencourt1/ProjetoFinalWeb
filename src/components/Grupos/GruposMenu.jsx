import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GruposMenu.css';

export default function GruposMenu() {
  const navigate = useNavigate();

  return (
    <div className="grupos-menu-page">
      <div className="grupos-menu-header">
  <button className="home-back-button" onClick={() => navigate('/home')}>
    🏠 Home
  </button>
</div>


      <h2 className="grupos-menu-title">Menu de Grupos</h2>

      <div className="grupos-menu-container">
        <div className="grupos-menu-bloco">
          <h3>Quero entrar em um grupo</h3>
          <button onClick={() => navigate('/grupos-entrar')}>Ver Grupos</button>
        </div>
        <div className="grupos-menu-bloco">
          <h3>Quero criar um grupo</h3>
          <button onClick={() => navigate('/grupos-criar')}>Criar Grupo</button>
        </div>
      </div>
    </div>
  );
}
