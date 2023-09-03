import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function RoomId(userId1, userId2) {
  return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;
}

function App() { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [recipientUserId, setRecipientUserId] = useState('');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stateRoomId , setstateRoomId ] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/register', { username, password });
      setToken(response.data.token);
      setLoggedInUserId(response.data.userId);
      // setUsername('');
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
      setLoggedInUserId(response.data.userId);
      // setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    setToken('');
    setLoggedInUserId('');
    setRecipientUserId('');
    setRecipientUsername('');
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    try {
      const timestamp = new Date().toISOString();
      const newMessage = {
        roomId: RoomId(loggedInUserId, recipientUserId),
        message: input,
        name: username, // Use the user's username for the message
        timestamp,
      };
  
      // Send message to the backend API with the auth-token header
      await axios.post('/api/messages', newMessage);  
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };  

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/user/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    // Initialize the socket connection inside the useEffect
    if (!loggedInUserId || !recipientUserId || !token) return;
    setstateRoomId(RoomId(loggedInUserId, recipientUserId));    

    const fetchMessages = async () => {
      try {
        const computedRoomId = RoomId(loggedInUserId, recipientUserId);
        console.log('Fetching messages for room:', computedRoomId); // Add this log
        const response = await axios.get(`/api/messages/${computedRoomId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const localSocket = io('http://localhost:3000');

    // Listen for updates to messages
    localSocket.on('newMessage', (newMessage) => {
        console.log('Received new message:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // If loggedInUserId and recipientUserId are set, join the room
    if (loggedInUserId && recipientUserId) {
        const roomId = RoomId(loggedInUserId, recipientUserId);
        console.log('Joining room:', roomId);
        if (localSocket.connected) {
          localSocket.emit('joinRoom', roomId);
          fetchMessages();
        } else {
          // If the socket isn't connected yet, wait for it to connect
          localSocket.on('connect', () => {
            localSocket.emit('joinRoom', roomId);
            fetchMessages();
          });
        }
        localSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
      });
      }
    // Return the cleanup function
    return () => {
        console.log('Disconnecting socket');
        localSocket.disconnect();
    };
}, [loggedInUserId, recipientUserId, token]); // Dependencies ensure that the room is joined when these values change

  return (
    <BrowserRouter> 
      {token ? (
        <div className="app">
            <Sidebar users={users} setRecipientUserId={setRecipientUserId} setRecipientUsername={setRecipientUsername} />
          <Routes>
            <Route path="/chat/:recipientUserId" element={
              <div className="app__body">
                {stateRoomId && (
                  <Chat
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  handleSendMessage={handleSendMessage}
                  recipientUsername={recipientUsername}
                />
                )}
              </div>
            } />
            <Route path="/" element={<h1>Welcome to MERNChat</h1>} />
          </Routes>
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
    </BrowserRouter>
  );
}

export default App;
