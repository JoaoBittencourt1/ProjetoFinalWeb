import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GruposEntrar.css';

export default function GruposEntrar() {
  const [grupos, setGrupos] = useState([]);
  const [meusGrupos, setMeusGrupos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/grupos/listar', {
          credentials: 'include',
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setGrupos(data);
        } else {
          console.error('Resposta inesperada:', data);
        }
      } catch (err) {
        console.error('Erro ao buscar grupos:', err);
      }
    };

    const fetchMeusGrupos = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/grupos/meus', {
          credentials: 'include',
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMeusGrupos(data.map(g => g.id));
        } else {
          console.error('Erro ao buscar grupos do usuário:', data);
        }
      } catch (err) {
        console.error('Erro ao buscar meus grupos:', err);
      }
    };

    fetchGrupos();
    fetchMeusGrupos();
  }, []);

  const entrarGrupo = async (grupo) => {
    try {
      const response = await fetch('http://localhost:3001/api/grupos/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_grupo: grupo.id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Você entrou no grupo com sucesso!');
        navigate(`/grupo/${grupo.id}`);
      } else {
        alert(data.message || data.error || 'Erro ao entrar no grupo.');
      }
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
      alert('Erro ao tentar entrar no grupo.');
    }
  };

  const sairGrupo = async (grupoId) => {
    try {
      const response = await fetch('http://localhost:3001/api/grupos/sair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_grupo: grupoId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Você saiu do grupo com sucesso.');
        setMeusGrupos(prev => prev.filter(id => id !== grupoId));
      } else {
        alert(data.message || data.error || 'Erro ao sair do grupo.');
      }
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      alert('Erro ao tentar sair do grupo.');
    }
  };

  return (
    <div className="grupos-entrar-container">
      <button className="entrar-voltar-button" onClick={() => navigate('/grupos')}>
        ⬅ Voltar
      </button>

      <h2>Grupos Disponíveis</h2>
      {grupos.length === 0 ? (
        <p>Nenhum grupo disponível.</p>
      ) : (
        grupos.map((grupo) => {
          const participa = meusGrupos.includes(grupo.id);
          return (
            <div key={grupo.id} className="grupos-entrar-item">
              <h4>{grupo.nome}</h4>
              <p>{grupo.descricao}</p>
              {participa ? (
                <>
                  <button onClick={() => navigate(`/grupo/${grupo.id}`)}>Entrar</button>
                  <button onClick={() => sairGrupo(grupo.id)} style={{ float: 'right', backgroundColor: '#f44336' }}>
                    Sair
                  </button>
                </>
              ) : (
                <button onClick={() => entrarGrupo(grupo)}>Participar</button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
