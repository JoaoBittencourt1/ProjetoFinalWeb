import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GruposCriar.css';

export default function GruposCriar() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/grupos/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // importante para manter a sessão
        body: JSON.stringify({ nome, descricao }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Grupo criado com sucesso:', data);
        navigate('/grupos'); // Navegar para a lista de grupos
      } else {
        alert(data.message || 'Erro ao criar grupo');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="grupo-criar-container">
      <h2>Criar Novo Grupo</h2>
      <form className="grupo-criar-form" onSubmit={handleSubmit}>
        <label>Nome do grupo:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Descrição:</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <button type="submit">Criar Grupo</button>
      </form>
    </div>
  );
}
