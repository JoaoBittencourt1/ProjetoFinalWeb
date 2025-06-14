import React, { useEffect, useState, useCallback } from 'react';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/comentarios/${postId}`, {
                credentials: 'include'
            });

            const contentType = res.headers.get('content-type');
            if (!res.ok || !contentType.includes('application/json')) {
                throw new Error('Resposta inválida da API de comentários');
            }

            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error('Erro ao buscar comentários:', err);
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await fetch('http://localhost:3001/api/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id_postagem: postId, conteudo: newComment })
        });

        setNewComment('');
        fetchComments();
    };

    const avaliarComentario = async (comentarioId, valor) => {
        try {
            const res = await fetch('http://localhost:3001/api/avaliacoes', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipo_alvo: 'comentario',
                    id_alvo: comentarioId,
                    valor
                })
            });

            if (!res.ok) {
                const data = await res.json();
                console.error('Erro da API:', data);
            } else {
                fetchComments();
            }
        } catch (err) {
            console.error('Erro ao avaliar comentário:', err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className="comment-section">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Comentar</button>
            </form>
            <div className="comments-list">
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        className="comment"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={comment.foto_perfil
                                    ? `http://localhost:3001/uploads/${comment.foto_perfil}`
                                    : 'https://via.placeholder.com/30'}
                                alt="User"
                                className="comment-avatar"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginRight: '10px'
                                }}
                            />
                            <div className="comment-body">
                                <strong>{comment.username}</strong>
                                <p style={{ margin: 0 }}>{comment.conteudo}</p>
                            </div>
                        </div>
                        <div
                            className="comment-actions"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginLeft: 'auto'
                            }}
                        >
                            <button
                                onClick={() => avaliarComentario(comment.id, 'positivo')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    color: '#555',
                                    cursor: 'pointer',
                                    padding: '2px 6px',
                                    transition: 'background-color 0.2s',
                                    borderRadius: '4px'
                                }}
                            >
                                👍
                            </button>
                            <span
                                style={{
                                    fontSize: '13px',
                                    color: '#222',
                                    margin: '0 4px'
                                }}
                            >
                                {comment.likes}
                            </span>
                            <button
                                onClick={() => avaliarComentario(comment.id, 'negativo')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    color: '#555',
                                    cursor: 'pointer',
                                    padding: '2px 6px',
                                    transition: 'background-color 0.2s',
                                    borderRadius: '4px'
                                }}
                            >
                                👎
                            </button>
                            <span
                                style={{
                                    fontSize: '13px',
                                    color: '#222',
                                    margin: '0 4px'
                                }}
                            >
                                {comment.dislikes}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
