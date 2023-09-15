// src\components\Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    socket.on('msg', (newMessage) => {
        setMessages(() => [...messages, newMessage]);
    });

    const sendMessage = () => {
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

