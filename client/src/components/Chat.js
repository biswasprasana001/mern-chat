// components/Chat.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';
import io from 'socket.io-client'; // Import Socket.IO
const socket = io('http://localhost:5000'); // Replace with your backend server URL


function Chat({ messages, input, setInput, handleSendMessage }) {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch messages from the backend API
    // const fetchMessages = async () => {
    //   try {
    //     const response = await axios.get(`/api/messages/${roomId}`);
    //     setMessages(response.data);
    //   } catch (error) {
    //     console.error('Error fetching messages:', error);
    //   }
    // };

    // fetchMessages();

    // Use Socket.IO to listen for new messages
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  return (
    <div className="chat">
      <div className="chat__messages">
        {messages.map((message) => (
          <p key={message._id}>{message.name}: {message.message}</p>
        ))}
      </div>
      <div className="chat__input">
        <form>
          <input type="text" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={handleSendMessage} type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
