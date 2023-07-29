// components/Chat.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';
import io from 'socket.io-client'; // Import Socket.IO
const socket = io('http://localhost:5000'); // Replace with your backend server URL


function Chat() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch messages from the backend API
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${roomId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Use Socket.IO to listen for new messages
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const timestamp = new Date().toISOString();
      const newMessage = {
        roomId,
        message: input,
        name: 'Your Name', // Replace with the user's name
        timestamp,
        received: false,
      };

      // Send message to the backend API
      await axios.post('/api/messages', newMessage);

      // Emit a new message event using Socket.IO to the recipient
      socket.emit('newMessage', newMessage, recipientUserId); // Add recipientUserId as an argument

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat">
      {/* Display messages */}
      {/* Chat input */}
    </div>
  );
}

export default Chat;
