import React, {useEffect, useState, useRef} from 'react';
import { io } from 'socket.io-client';

export default function Chat({user}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const room = 'global';

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    socketRef.current = socket;
    socket.emit('join', room);
    socket.on('message', (m) => setMessages(prev => [...prev, m]));
    return () => socket.disconnect();
  }, []);

  const send = () => {
    if(!text) return;
    socketRef.current.emit('message', { room, user: user?.username||'anon', text });
    setText('');
  };

  return (
    <div className="card">
      <h2>Live Chat</h2>
      <div style={{maxHeight:240, overflow:'auto', marginBottom:10, padding:8, background:'rgba(255,255,255,0.02)', borderRadius:8}}>
        {messages.map((m,i)=> <div key={i} style={{marginBottom:6}}><strong style={{color:'#fff'}}>{m.user}:</strong> <span style={{color:'#cfe'}}>{m.text}</span></div>)}
      </div>
      <div className="row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Say something..." />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
