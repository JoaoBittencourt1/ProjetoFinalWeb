import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import GrupoPostList from '../GrupoPostList/GrupoPostList';
import './HomePrototype.css';
import GrupoPostForm from '../GrupoPostList/GrupoPostForm'; 

export default function GrupoHome() {
  const { id_grupo } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.username,
        email: parsedUser.email,
        profilePic: parsedUser.foto_perfil 
          ? `http://localhost:3001/uploads/${parsedUser.foto_perfil}`
          : 'https://via.placeholder.com/50'
      });
    }
  }, []);

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/grupos/grupo/${id_grupo}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setGrupo(data);
        } else {
          console.error('Erro do servidor:', data.message || data.error);
        }
      } catch (err) {
        console.error('Erro no fetchGrupo:', err);
      }
    };

    fetchGrupo();
  }, [id_grupo]);

  if (!grupo) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Carregando grupo...</div>;
  }

  return (
    <div className="home-wrapper">
      <header className="header">
        <div className="left-buttons">
          <button className="home-button" onClick={() => navigate('/home-prototype')}>🏠 Home</button>
          <button className="grupos-button" onClick={() => navigate('/grupos')}>
            <FaUsers style={{ marginRight: '0.5rem' }} /> Grupos
          </button>
        </div>
        <div className="profile-section">
          <button className="profile-toggle" onClick={() => setShowProfile(!showProfile)}>
            {user?.profilePic ? (
              <img 
                src={user.profilePic} 
                alt="Foto de perfil" 
                className="profile-pic"
              />
            ) : (
              '👤'
            )}
          </button>
          {showProfile && user && (
            <div className="profile-dropdown">
              <img 
                src={user.profilePic} 
                alt="Foto de perfil" 
                className="profile-dropdown-pic"
              />
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        <h1 style={{ textAlign: 'center' }}>{grupo.nome}</h1>
        <GrupoPostForm grupoId={id_grupo} onPostCreated={() => window.location.reload()} />
        <GrupoPostList grupoId={id_grupo} />
      </main>
    </div>
  );
}
