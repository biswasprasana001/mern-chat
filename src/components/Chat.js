// src\components\Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from 'axios';

const socket = io("http://localhost:5000");

function Chat({ username }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/messages');
                setMessages(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, []);

    socket.on('message', (message) => {
        setMessages([...messages, message]);
    });

    const sendMessage = () => {
        socket.emit('message', { username, message, timestamp: new Date() });
        setMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.username}</b>: {msg.message}
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;