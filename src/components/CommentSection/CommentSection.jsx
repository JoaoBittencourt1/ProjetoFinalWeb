import React, { useEffect, useState, useCallback } from 'react';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [respostaPara, setRespostaPara] = useState(null);

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

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e, comentarioPaiId = null) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await fetch('http://localhost:3001/api/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                id_postagem: postId,
                conteudo: newComment,
                id_comentario_pai: comentarioPaiId
            })
        });

        setNewComment('');
        setRespostaPara(null);
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

    const buildCommentTree = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach(comment => {
            comment.replies = [];
            map[comment.id] = comment;
        });

        comments.forEach(comment => {
            if (comment.id_comentario_pai) {
                map[comment.id_comentario_pai]?.replies.push(comment);
            } else {
                roots.push(comment);
            }
        });

        return roots;
    };

    const renderComments = (comments, level = 0) => {
        return comments.map(comment => (
            <div key={comment.id} style={{ marginLeft: level * 20, marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    
             
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '10px'
                    }}>
                        <strong>{comment.username}</strong>
                        <img
                            src={comment.foto_perfil
                                ? `http://localhost:3001/uploads/${comment.foto_perfil}`
                                : 'https://via.placeholder.com/30'}
                            alt="User"
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginTop: '4px'
                            }}
                        />
                    </div>

                 
                    <div>
                        <p>{comment.conteudo}</p>

                       
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '4px',
                        }}>
                            <button onClick={() => setRespostaPara(comment.id)}>Responder</button>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '18px',
                                color: '#555',
                            }}>
                                <button
                                    onClick={() => avaliarComentario(comment.id, 'positivo')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s',
                                        fontSize: '18px',
                                    }}
                                >
                                    👍
                                </button>
                                <span>{comment.likes}</span>
                                <button
                                    onClick={() => avaliarComentario(comment.id, 'negativo')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s',
                                        fontSize: '18px',
                                    }}
                                >
                                    👎
                                </button>
                                <span>{comment.dislikes}</span>
                            </div>
                        </div>

                      
                        {respostaPara === comment.id && (
                            <form
                                onSubmit={(e) => handleSubmit(e, comment.id)}
                                style={{ marginTop: 10 }}
                            >
                                <input
                                    type="text"
                                    placeholder="Digite sua resposta..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{ width: '80%' }}
                                />
                                <button type="submit">Responder</button>
                                <button type="button" onClick={() => setRespostaPara(null)}>Cancelar</button>
                            </form>
                        )}

                       
                        {comment.replies && renderComments(comment.replies, level + 1)}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="comment-section">
            {!respostaPara && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Escreva um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ width: '80%', marginBottom: '10px' }}
                    />
                    <button type="submit">Comentar</button>
                </form>
            )}

            <div className="comments-list">
                {renderComments(buildCommentTree(comments))}
            </div>
        </div>
    );
}