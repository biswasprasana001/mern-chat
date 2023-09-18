// src\App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './components/Chat';
import Auth from './components/Auth';
import UserList from './components/UserList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (_token, userId) => {
    setUserId(userId);
    setToken(_token)
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const handleUserSelection = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.post('http://localhost:5000/chatroom', { userId, contactId: user._id });
      setChatRoomId(res.data._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <UserList onSelectUser={handleUserSelection} />
          {selectedUser && <Chat userId={userId} chatRoomId={chatRoomId} />}
        </div>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;