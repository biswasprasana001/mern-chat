import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [recipientUserId, setRecipientUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/register', { username, password });
      setToken(response.data.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/login', { username, password });
      setToken(response.data.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    setToken('');
    setLoggedInUserId('');
    setRecipientUserId('');
    setMessages([]);
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Emit a login event with the user's ID when they log in
    socket.emit('login', userId); // Replace userId with the actual user ID

    return () => {
      socket.disconnect();
    };
  }, [userId]); // Add userId as a dependency

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const timestamp = new Date().toISOString();
      const newMessage = {
        roomId: loggedInUserId < recipientUserId ? `${loggedInUserId}-${recipientUserId}` : `${recipientUserId}-${loggedInUserId}`,
        message: input,
        name: 'Your Name', // Replace with the user's name
        timestamp,
        received: false,
      };

      // Send message to the backend API with the auth-token header
      await axios.post('/api/messages', newMessage, {
        headers: {
          'auth-token': token,
        },
      });

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/user/all', {
          headers: {
            'auth-token': token,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const roomId = loggedInUserId < recipientUserId ? `${loggedInUserId}-${recipientUserId}` : `${recipientUserId}-${loggedInUserId}`;
        const response = await axios.get(`/api/messages/${roomId}`, {
          headers: {
            'auth-token': token,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (loggedInUserId && recipientUserId) {
      fetchMessages();
    }
  }, [loggedInUserId, recipientUserId, token]);

  return (
    <Router>
      {token ? (
        <div className="app">
          <Switch>
            <Route path="/chat/:recipientUserId">
              <div className="app__body">
                <Sidebar users={users} setRecipientUserId={setRecipientUserId} />
                <Chat
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </Route>
            <Route path="/">
              <h1>Welcome to MERNChat</h1>
            </Route>
          </Switch>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="app__login">
          <form>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      )}
    </Router>
  );
}

export default App;
