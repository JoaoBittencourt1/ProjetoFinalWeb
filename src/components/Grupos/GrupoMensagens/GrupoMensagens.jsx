import React, { useEffect, useState } from 'react';
import './CreatePost.css';


export default function GrupoMensagens({ grupoId }) {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function carregarMensagens() {
    if (!grupoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/grupo-mensagens/${grupoId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao carregar mensagens: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar mensagens do grupo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  async function carregarMensagens() {
    if (!grupoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/grupo-mensagens/${grupoId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao carregar mensagens: ${res.status} - ${text}`);
      }
      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar mensagens do grupo.');
    } finally {
      setLoading(false);
    }
  }

  carregarMensagens();
}, [grupoId]);


  async function handleEnviarMensagem(e) {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setEnviando(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/grupo-mensagens', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ grupoId, conteudo: novaMensagem.trim() }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || `Erro ao enviar mensagem (${res.status})`);
      }

      setNovaMensagem('');
      await carregarMensagens();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="create-post" style={{ maxWidth: 600, margin: '0 auto' }}>
      <form onSubmit={handleEnviarMensagem}>
        <textarea
          rows={3}
          value={novaMensagem}
          onChange={e => setNovaMensagem(e.target.value)}
          placeholder="Escreva sua mensagem no grupo..."
          disabled={enviando}
          required
        />
        <button type="submit" disabled={enviando || !novaMensagem.trim()} className="submit-button">
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {loading && <p>Carregando mensagens...</p>}
      {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

      {!loading && mensagens.length === 0 && <p>Sem mensagens neste grupo.</p>}

      {mensagens.map(msg => (
        <div
          key={msg.id}
          style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0', marginTop: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={
                msg.foto_perfil
                  ? `http://localhost:3001/uploads/${msg.foto_perfil}`
                  : 'https://via.placeholder.com/30'
              }
              alt="Foto usuário"
              style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
            />
            <strong>{msg.username}</strong>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
              {new Date(msg.data_criacao).toLocaleString()}
            </span>
          </div>
          <p style={{ marginTop: 4 }}>{msg.conteudo}</p>
        </div>
      ))}
    </div>
  );
}
