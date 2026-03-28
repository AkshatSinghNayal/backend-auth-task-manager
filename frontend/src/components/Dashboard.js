import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function Dashboard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      } else {
        showMessage('error', data.message || 'Failed to load tasks');
      }
    } catch {
      showMessage('error', 'Network error. Could not fetch tasks.');
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', data.message);
        setNewTask({ title: '', description: '', status: 'pending' });
        fetchTasks();
      } else {
        const errMsg = data.errors?.[0]?.msg || data.message || 'Failed to create task';
        showMessage('error', errMsg);
      }
    } catch {
      showMessage('error', 'Network error. Could not create task.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', data.message);
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } else {
        showMessage('error', data.message || 'Failed to delete task');
      }
    } catch {
      showMessage('error', 'Network error. Could not delete task.');
    }
  };

  const statusClass = (status) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'in-progress') return 'status-in-progress';
    return 'status-pending';
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>
          Welcome, {user?.name}{' '}
          <span style={{ fontSize: 13, color: '#7f8c8d' }}>({user?.role})</span>
        </h1>
        <button className="btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Feedback messages */}
      {message.text && (
        <div className={message.type === 'error' ? 'msg-error' : 'msg-success'}>
          {message.text}
        </div>
      )}

      {/* Add Task Form */}
      <div className="add-task-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <label>Description</label>
          <input
            type="text"
            placeholder="Optional description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <label>Status</label>
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Task List */}
      <h3>Your Tasks ({tasks.length})</h3>
      {tasks.length === 0 ? (
        <p style={{ color: '#999', marginTop: 12 }}>No tasks yet. Add one above!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-info">
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <span className={`task-status ${statusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <button
                className="btn-danger"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
