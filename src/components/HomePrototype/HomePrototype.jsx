import React, { useState, useEffect } from 'react';
import PostList from '../PostList/PostList';
import './HomePrototype.css';

export default function HomePrototype() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

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

  return (
    <div className="home-wrapper">
      <header className="header">
        <button className="home-button">🏠 Home</button>
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
        <PostList />
      </main>
    </div>
  );
}
