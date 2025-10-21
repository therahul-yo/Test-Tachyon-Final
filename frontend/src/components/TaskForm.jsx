import React, {useState} from 'react';
import API from '../api';

export default function TaskForm({onCreated}){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [dueDate,setDueDate]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    if(!title) return alert('Title required');
    try {
      await API.post('/api/tasks',{ title, description, dueDate });
      setTitle(''); setDescription(''); setDueDate('');
      onCreated && onCreated();
    } catch (err){ console.error(err); alert('Failed to create'); }
  };
  return (
    <form className="card form" onSubmit={submit}>
      <h2>New Task</h2>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
      <div className="row">
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <button className="btn" type="submit">Create</button>
      </div>
    </form>
  );
}
