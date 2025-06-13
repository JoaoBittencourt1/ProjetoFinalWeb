import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GruposCriar.css';

export default function GruposCriar() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const novoGrupo = {
      nome,
      descricao,
      dataCriacao: new Date().toISOString()
    };

    console.log('Grupo criado:', novoGrupo);
    navigate('/grupos'); // Voltar para o menu de grupos
  };

  return (
    <div className="grupo-criar-container">
      <h2>Criar Novo Grupo</h2>
      <form className="grupo-criar-form" onSubmit={handleSubmit}>
        <label>Nome do grupo:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Descrição:</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

        <button type="submit">Criar Grupo</button>
      </form>
    </div>
  );
}
