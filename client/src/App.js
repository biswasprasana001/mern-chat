import React, { useState, useEffect } from 'react'; // Import useEffect from React
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import io from 'socket.io-client';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/user/login', { username, password });
      setToken(response.data.token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/user/register', { username, password });
      setToken(response.data.token);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Emit a login event with the user's ID when they log in
    socket.emit('login', userId); // Replace userId with the actual user ID

    return () => {
      socket.disconnect();
    };
  }, [userId]); // Add userId as a dependency

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app__body">
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
