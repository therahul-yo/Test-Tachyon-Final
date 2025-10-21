import React, { useState } from 'react';
import API from '../api';

function TaskCard({ task, onChange }) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const next = task.status === 'done' ? 'pending' : 'done';
      await API.put(`/api/tasks/${task.id}`, { status: next });
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await API.delete(`/api/tasks/${task.id}`);
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`task-item ${task.status === 'done' ? 'completed' : ''}`}>
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span>Status: {task.status === 'done' ? '✅ Completed' : '⏳ Pending'}</span>
          {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button 
          className="btn btn-secondary" 
          onClick={toggle}
          disabled={loading}
          style={{ padding: '0.5rem 1rem' }}
        >
          {task.status === 'done' ? 'Undo' : 'Complete'}
        </button>
        <button 
          className="btn btn-danger" 
          onClick={remove}
          disabled={loading}
          style={{ padding: '0.5rem 1rem' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TaskList({ tasks, onChange }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="card-title">All Tasks ({tasks.length})</h3>
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}