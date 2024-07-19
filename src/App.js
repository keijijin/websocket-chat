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
        // 重複して追加しないようにメッセージが他のユーザーからのものか確認
        if (data.user !== userName) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      // コンポーネントのアンマウント時にクリーンアップ
      return () => {
        socket.off('message');
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket, userName]);

  const handleConnect = () => {
    const newSocket = socketIOClient(ENDPOINT, { query: { userName } });
    setSocket(newSocket);
  };

  const handleSendMessage = () => {
    if (message && socket) {
      const newMessage = { user: userName, message };
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // 自分のメッセージを直接追加
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!socket ? (
        <div className="connect-container">
          <h2>Enter your chat user name</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="username-input"
          />
          <button onClick={handleConnect} className="connect-button">Connect</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">Chat</div>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.user === userName ? 'user' : 'other'}`}>
                <strong>{msg.user}: </strong>{msg.message}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
