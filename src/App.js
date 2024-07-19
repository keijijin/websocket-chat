// src/App.js
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

const ENDPOINT = "http://127.0.0.1:8080";

function App() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    }
  }, [socket]);

  const handleConnect = () => {
    const newSocket = socketIOClient(ENDPOINT, { query: { userName } });
    setSocket(newSocket);
  };

  const handleSendMessage = () => {
    if (message && socket) {
      const newMessage = { user: userName, message };
      socket.emit('message', newMessage);
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!socket ? (
        <div>
          <h2>Enter your chat user name</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        <div>
          <div>
            <h2>Chat</h2>
            <div className="chat-container">
              {messages.map((msg, index) => (
                <div key={index}><strong>{msg.user}: </strong>{msg.message}</div>
              ))}
            </div>
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
