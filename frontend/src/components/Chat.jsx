import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const room = 'global';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', room);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('message', (m) => {
      setMessages((prev) => [...prev, m]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    socketRef.current.emit('message', { 
      room, 
      user: user?.username || 'Anonymous', 
      text 
    });
    setText('');
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Live Chat</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: connected ? '#10b981' : '#ef4444'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connected ? '#10b981' : '#ef4444',
            display: 'inline-block'
          }}></span>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="chat-message">
              <div className="chat-user">{msg.user}</div>
              <div className="chat-text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={send}>
        <div className="chat-input-group">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!connected}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!connected || !text.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}