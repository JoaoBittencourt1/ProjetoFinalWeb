import React from 'react';
import './GruposEntrar.css';

export default function GruposEntrar() {
  const gruposFake = [
    { id: 1, nome: 'Amantes de Café', descricao: 'Para quem ama um bom café!' },
    { id: 2, nome: 'Programadores JS', descricao: 'Discussões sobre JavaScript' },
  ];

  const entrarGrupo = (grupo) => {
    console.log(`Entrando no grupo: ${grupo.nome}`);
    // lógica de inscrição futura
  };

  return (
    <div className="grupos-entrar-container">
      <h2>Grupos Disponíveis</h2>
      {gruposFake.map((grupo) => (
        <div key={grupo.id} className="grupos-entrar-item">
          <h4>{grupo.nome}</h4>
          <p>{grupo.descricao}</p>
          <button onClick={() => entrarGrupo(grupo)}>Entrar</button>
        </div>
      ))}
    </div>
  );
}
