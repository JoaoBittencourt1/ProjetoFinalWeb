import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

export default function UserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [conectados, setConectados] = useState(new Set());
  const navigate = useNavigate();

  const usuarioAtual = JSON.parse(localStorage.getItem('user')) || {};
  const idUsuarioAtual = usuarioAtual.id;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/usuarios', { credentials: 'include' });
        const data = await res.json();

        // Remove o usuário atual
        const usuariosFiltrados = data.filter(usuario => usuario.id !== idUsuarioAtual);
        setUsuarios(usuariosFiltrados);

        // Aqui seria ideal buscar conexões do usuário atual, se desejar mostrar conexões pré-existentes
        setConectados(new Set());
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, [idUsuarioAtual]);

  const conectar = async (idUsuario) => {
    try {
      const res = await fetch('http://localhost:3001/api/conexoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_usuario2: idUsuario })
      });

      if (res.ok) {
        setConectados(prev => new Set(prev).add(idUsuario));
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  return (
    <div className="user-list">
      <button 
        className="back-home-button" 
        onClick={() => navigate('/home-prototype')} // ajuste a rota se necessário
      >
        ← Voltar para Home
      </button>

      <h2>Usuários Cadastrados</h2>

      {usuarios.map(usuario => (
        <div key={usuario.id} className="user-card">
          <img 
            src={usuario.foto_perfil
              ? `http://localhost:3001/uploads/${usuario.foto_perfil}`
              : 'https://via.placeholder.com/50'}
            alt="Perfil"
            className="user-avatar"
          />
          <div>
            <strong>{usuario.username}</strong><br />
            <span>{usuario.email}</span>
          </div>
          <button
            disabled={conectados.has(usuario.id)}
            onClick={() => conectar(usuario.id)}
          >
            {conectados.has(usuario.id) ? 'Conectado' : 'Conectar'}
          </button>
        </div>
      ))}
    </div>
  );
}
