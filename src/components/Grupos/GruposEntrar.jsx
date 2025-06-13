import React, { useEffect, useState } from 'react';
import './GruposEntrar.css';

export default function GruposEntrar() {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/grupos/listar', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGrupos(data);
        } else {
          console.error('Erro ao buscar grupos:', data);
        }
      })
      .catch((err) => console.error('Erro de rede:', err));
  }, []);

  const entrarGrupo = async (grupo) => {
    try {
      const response = await fetch('http://localhost:3001/api/grupos/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // necessário para sessão
        body: JSON.stringify({ id_grupo: grupo.id }), // não envia mais id_usuario
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Você entrou no grupo com sucesso!');
      } else {
        alert(data.message || data.error || 'Erro ao entrar no grupo.');
      }
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
      alert('Erro ao tentar entrar no grupo.');
    }
  };

  return (
    <div className="grupos-entrar-container">
      <h2>Grupos Disponíveis</h2>
      {grupos.length === 0 ? (
        <p>Nenhum grupo disponível.</p>
      ) : (
        grupos.map((grupo) => (
          <div key={grupo.id} className="grupos-entrar-item">
            <h4>{grupo.nome}</h4>
            <p>{grupo.descricao}</p>
            <button onClick={() => entrarGrupo(grupo)}>Entrar</button>
          </div>
        ))
      )}
    </div>
  );
}
