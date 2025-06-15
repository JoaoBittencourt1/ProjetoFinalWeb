import React, { useState, useEffect, useCallback } from 'react';
import CreatePost from '../CreatePost/CreatePost';
import CommentSection from '../CommentSection/CommentSection';
import './PostList.css';

export default function PostList({ grupoId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCommentsForPostId, setOpenCommentsForPostId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Busca os posts filtrados por grupoId na query (ajuste conforme sua API)
      const url = grupoId
        ? `http://localhost:3001/api/posts?grupoId=${grupoId}`
        : 'http://localhost:3001/api/posts';

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar postagens');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [grupoId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const toggleComments = (postId) => {
    setOpenCommentsForPostId((prev) => (prev === postId ? null : postId));
  };

  const avaliarPost = async (postId, valor) => {
    try {
      const res = await fetch('http://localhost:3001/api/avaliacoes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_alvo: 'postagem',
          id_alvo: postId,
          valor,
        }),
      });

      if (res.ok) {
        fetchPosts(); // Recarrega os posts atualizados
      } else {
        const data = await res.json();
        console.error('Erro da API:', data);
      }
    } catch (err) {
      console.error('Erro ao avaliar post:', err);
    }
  };

  if (loading) return <div className="loading">Carregando postagens...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      <CreatePost grupoId={grupoId} onPostCreated={handlePostCreated} />
      {posts.length === 0 && <p>Nenhum post encontrado neste grupo.</p>}
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img
              src={
                post.foto_perfil
                  ? `http://localhost:3001/uploads/${post.foto_perfil}`
                  : 'https://via.placeholder.com/40'
              }
              alt="Foto de perfil"
              className="post-profile-pic"
            />
            <div className="post-info">
              <h3>{post.username}</h3>
              <span className="post-date">
                {new Date(post.data_criacao).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="post-content">
            {post.tipo === 'texto' && <p>{post.conteudo}</p>}
            {post.tipo === 'imagem' && (
              <img
                src={`http://localhost:3001/uploads/${post.conteudo}`}
                alt="Post"
                className="post-image"
              />
            )}
          </div>
          <div className="post-actions">
            <div className="vote-buttons">
              <button
                className="vote-button"
                onClick={() => avaliarPost(post.id, 'positivo')}
              >
                👍
              </button>
              <span className="vote-count">{post.likes || 0}</span>
              <button
                className="vote-button"
                onClick={() => avaliarPost(post.id, 'negativo')}
              >
                👎
              </button>
              <span className="vote-count">{post.dislikes || 0}</span>
            </div>
            <button
              className="comment-button"
              onClick={() => toggleComments(post.id)}
            >
              💬 Comentários
            </button>
          </div>

          {openCommentsForPostId === post.id && <CommentSection postId={post.id} />}
        </div>
      ))}
    </div>
  );
}
