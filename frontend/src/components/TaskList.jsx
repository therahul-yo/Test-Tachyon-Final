import React from 'react';
import API from '../api';

function TaskCard({task, onChange}){
  const toggle = async () => {
    const next = task.status === 'done' ? 'pending' : 'done';
    await API.put(`/api/tasks/${task.id}`, { status: next });
    onChange && onChange();
  };
  const remove = async () => {
    if(!confirm('Delete this task?')) return;
    await API.delete(`/api/tasks/${task.id}`);
    onChange && onChange();
  };
  return (
    <div className={'task-card '+(task.status==='done'?'done':'')}>
      <div className="task-main">
        <h3>{task.title}</h3>
        <p className="muted small">{task.description}</p>
      </div>
      <div className="task-actions">
        <small className="muted">{task.dueDate || 'No due'}</small>
        <div className="btns">
          <button className="btn ghost" onClick={toggle}>{task.status==='done'?'Undo':'Done'}</button>
          <button className="btn danger" onClick={remove}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({tasks, onChange}){
  if(!tasks.length) return <div className="card"><p className="muted">No tasks yet — create one!</p></div>;
  return (
    <div className="card list">
      {tasks.map(t=> <TaskCard key={t.id} task={t} onChange={onChange} />)}
    </div>
  );
}
