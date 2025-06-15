import React, { useState } from 'react';
import '../PostList/PostList.css';

export default function GrupoPostForm({ grupoId, onPostCreated }) {
  const [conteudo, setConteudo] = useState('');
  const [postType, setPostType] = useState('texto');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setConteudo(''); // resetar conteúdo textual
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('conteudo', conteudo || '');
      formData.append('tipo', postType);
      formData.append('id_grupo', grupoId);
      formData.append('id_usuario', userData.id);

      if (postType === 'imagem' && imageFile) {
        formData.append('imagem', imageFile);
      }

      const res = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setConteudo('');
        setImageFile(null);
        setPreviewUrl(null);
        setStatus(null);
        if (onPostCreated) onPostCreated();
      } else {
        setStatus(data.error || 'Erro ao criar post');
      }
    } catch (error) {
      console.error(error);
      setStatus('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
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
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="O que você está pensando?"
        />
      ) : (
        <div className="image-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
        </div>
      )}

      {status && <p className="error">{status}</p>}

      <button
        className="submit-button"
        type="submit"
        disabled={
          loading || (postType === 'texto' && !conteudo.trim()) || (postType === 'imagem' && !imageFile)
        }
      >
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
}
