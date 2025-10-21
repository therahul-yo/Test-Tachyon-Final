import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // login or register
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await API.post(url, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      onAuth && onAuth({ username });
      navigate('/'); // redirect to main page
    } catch (err) {
      console.error(err);
      alert('Auth failed');
    }
  };

  const oauthGithub = () => {
    window.location.href = '/auth/github';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '28px' // matches your body padding in styles.css
    }}>
      <div className="card form" style={{
        padding: '40px 30px',
        textAlign: 'center',
        width: '100%',
        maxWidth: 400, // keeps the card from stretching
        borderRadius: '14px', // matches your card style
        display: 'flex',
        flexDirection: 'column',
        gap: 15 // spacing between inputs/buttons
      }}>
        <h2 style={{ marginBottom: 10 }}>{mode === 'login' ? 'Login' : 'Register'}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="row">
          <button className="btn" onClick={e => { e.preventDefault(); submit(e); }} style={{ flex: 1 }}>
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button className="btn ghost" onClick={e => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); }} style={{ flex: 1 }}>
            {mode === 'login' ? 'Switch' : 'Switch'}
          </button>
        </div>

        <button className="btn ghost" onClick={oauthGithub}>
          Login with GitHub
        </button>
      </div>
    </div>
  );
}