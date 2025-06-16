import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GrupoPostList.css';
import '../PostList/PostList.css';
import CommentSection from '../CommentSection/CommentSection'; 

export default function GrupoPostList({ grupoId }) {
  const [posts, setPosts] = useState([]);
  const [comentariosVisiveis, setComentariosVisiveis] = useState({});

  useEffect(() => {
    const fetchGrupoPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/posts/grupo/${grupoId}`, {
          withCredentials: true
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Erro ao buscar posts do grupo:', err);
      }
    };

    if (grupoId) fetchGrupoPosts();
  }, [grupoId]);

  const toggleComentarios = (postId) => {
    setComentariosVisiveis((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const enviarAvaliacao = async (tipoAlvo, idAlvo, valor) => {
    try {
      await axios.post('http://localhost:3001/api/avaliacoes', {
        tipo_alvo: tipoAlvo,
        id_alvo: idAlvo,
        valor: valor
      }, { withCredentials: true });

      const res = await axios.get(`http://localhost:3001/api/posts/grupo/${grupoId}`, {
        withCredentials: true
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Erro ao avaliar:', err);
    }
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString();
  };

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Nenhum post neste grupo ainda.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img 
                src={`http://localhost:3001/uploads/${post.foto_perfil || 'default.png'}`} 
                alt="avatar" 
                className="post-profile-pic" 
              />
              <div className="post-info">
                <h3>{post.username}</h3>
                <p className="post-date">{formatarData(post.data_criacao)}</p>
              </div>
            </div>

            <div className="post-content">
              <p>{post.conteudo}</p>
            </div>

            <div className="post-actions">
              <div className="vote-buttons">
                <button onClick={() => enviarAvaliacao('postagem', post.id, 'positivo')}>👍</button>
                <span>{post.likes || 0}</span>
                <button onClick={() => enviarAvaliacao('postagem', post.id, 'negativo')}>👎</button>
                <span>{post.dislikes || 0}</span>
              </div>
              <button className="comment-button" onClick={() => toggleComentarios(post.id)}>
                💬 Comentários
              </button>
            </div>

           
            {comentariosVisiveis[post.id] && (
              <CommentSection postId={post.id} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
