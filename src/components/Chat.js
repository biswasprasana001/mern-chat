// components/Chat.js
import React from 'react';

function Chat({ messages, input, setInput, handleSendMessage, recipientUsername }) {
  return (
    <div className="chat">
      <div className="chat__messages">
        <h3>{recipientUsername}</h3>
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
