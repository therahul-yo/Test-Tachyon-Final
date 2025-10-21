import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Chat from './components/Chat';
import Logout from './components/Logout';

function MainPage({ user, fetchTasks }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Task Manager</h1>
        <p className="muted">Sleek, minimal, and production-ready UI — demo</p>
        <button
          className="btn ghost"
          style={{ marginLeft: 20 }}
          onClick={() => navigate('/logout')}
        >
          Logout
        </button>
      </header>
      <main className="content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <strong style={{ fontSize: 14 }}>Signed in as {user.username}</strong>
          </div>
          <TaskForm onCreated={fetchTasks} />
          <Chat user={user} />
        </div>
        <TaskList tasks={[]} onChange={fetchTasks} />
      </main>
      <footer className="footer">
        Built with ❤️ for the Tachyon Systems task — by you
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      fetchTasks();
      setUser({ username: 'User' }); // optional: fetch username from token
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onAuth={(u) => { setUser(u); fetchTasks(); }} />}
        />
        <Route
          path="/logout"
          element={<Logout onLogout={() => setUser(null)} />}
        />
        <Route
          path="/"
          element={
            user ? (
              <MainPage user={user} fetchTasks={fetchTasks} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}