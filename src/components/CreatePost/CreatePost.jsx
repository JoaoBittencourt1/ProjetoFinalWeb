import React, { useState } from 'react';
import './CreatePost.css';

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [postType, setPostType] = useState('texto');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('conteudo', content);
            formData.append('tipo', postType);

            if (postType === 'imagem' && imagePreview) {
                formData.append('imagem', imagePreview);
            }

            const response = await fetch('http://localhost:3001/api/posts', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Você precisa estar logado para criar um post');
                }
                throw new Error('Erro ao criar post');
            }

            setContent('');
            setImagePreview(null);
            onPostCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(file);
            setContent(URL.createObjectURL(file));
        }
    };

    return (
        <div className="create-post">
            <form onSubmit={handleSubmit}>
                <div className="post-type-selector">
                    <button
                        type="button"
                        className={`type-button ${postType === 'texto' ? 'active' : ''}`}
                        onClick={() => setPostType('texto')}
                    >
                        📝 Texto
                    </button>
                    <button
                        type="button"
                        className={`type-button ${postType === 'imagem' ? 'active' : ''}`}
                        onClick={() => setPostType('imagem')}
                    >
                        🖼️ Imagem
                    </button>
                </div>

                {postType === 'texto' ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="O que você está pensando?"
                        required
                    />
                ) : (
                    <div className="image-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        {imagePreview && (
                            <img
                                src={URL.createObjectURL(imagePreview)}
                                alt="Preview"
                                className="image-preview"
                            />
                        )}
                    </div>
                )}

                {error && <div className="error">{error}</div>}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !content}
                >
                    {loading ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
    );
} 