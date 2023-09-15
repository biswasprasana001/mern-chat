// src\App.js
import React, { useState } from 'react';
import Chat from './components/Chat';
import Auth from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (token, username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  return (
    <div>
      {isAuthenticated ? <Chat username={username} /> : <Auth onLogin={handleLogin} />}
    </div>
  );
}

export default App;