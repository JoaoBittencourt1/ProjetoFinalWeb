import React, { useState, useEffect } from 'react';
import CreatePost from '../CreatePost/CreatePost';
import CommentSection from '../CommentSection/CommentSection'; // Corrigido aqui
import './PostList.css';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/posts', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
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
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        fetchPosts(); // Atualiza a lista de posts quando um novo post é criado
    };

    if (loading) return <div className="loading">Carregando postagens...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="post-list">
            <CreatePost onPostCreated={handlePostCreated} />
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <div className="post-header">
                        <img 
                            src={post.foto_perfil ? `http://localhost:3001/uploads/${post.foto_perfil}` : 'https://via.placeholder.com/40'} 
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
                            <img src={`http://localhost:3001/uploads/${post.conteudo}`} alt="Post" className="post-image" />
                        )}
                    </div>
                    <div className="post-actions">
                        <button className="action-button">👍 Curtir</button>
                        <button className="action-button">💬 Comentar</button>
                        <button className="action-button">↗️ Compartilhar</button>
                    </div>
                    <CommentSection postId={post.id} /> {/* Aqui incluímos os comentários */}
                </div>
            ))}
        </div>
    );
}
