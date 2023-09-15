// src\components\Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Use socket.once() instead of socket.on() to register a one-time listener
        socket.once('msg', (newMessage) => {
            setMessages(() => [...messages, newMessage]);
        });
    }, []);

    const sendMessage = () => {
        // Use socket.broadcast.emit() instead of socket.emit() to send the message to everyone except yourself
        socket.emit('msg', { username, message, timestamp: new Date() });
        setMessage('');
    };

    return (
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
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

