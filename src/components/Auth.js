// src\components\Auth.js
import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/${isLogin ? 'login' : 'register'}`, { username, password });
      if (res.data.token) {
        onLogin(res.data.token, res.data.userId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>{isLogin ? 'Login' : 'Register'}</button>
      <button onClick={() => setIsLogin((prev) => !prev)}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
    </div>
  );
}

export default Auth;