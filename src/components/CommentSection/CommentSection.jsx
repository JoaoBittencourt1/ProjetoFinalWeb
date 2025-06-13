import React, { useEffect, useState } from 'react';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
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
};

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

    useEffect(() => {
        fetchComments();
    }, []);

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
                    <div key={comment.id} className="comment">
                        <img
                            src={comment.foto_perfil ? `http://localhost:3001/uploads/${comment.foto_perfil}` : 'https://via.placeholder.com/30'}
                            alt="User"
                            className="comment-avatar"
                        />
                        <div className="comment-body">
                            <strong>{comment.username}</strong>
                            <p>{comment.conteudo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
