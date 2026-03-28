import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function Dashboard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleUpdatingId, setRoleUpdatingId] = useState('');

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

  const fetchUsers = useCallback(async () => {
    if (user?.role !== 'admin') return;

    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        showMessage('error', data.message || 'Failed to load users');
      }
    } catch {
      showMessage('error', 'Network error. Could not load users.');
    } finally {
      setUsersLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

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

  const handleUpdateTask = async (task) => {
    const title = window.prompt('Update title', task.title);
    if (title === null) return;

    const description = window.prompt(
      'Update description',
      task.description || ''
    );
    if (description === null) return;

    const status = window.prompt(
      'Update status: pending, in-progress, completed',
      task.status
    );
    if (status === null) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', data.message || 'Task updated successfully');
        fetchTasks();
      } else {
        showMessage('error', data.message || 'Failed to update task');
      }
    } catch {
      showMessage('error', 'Network error. Could not update task.');
    }
  };

  const statusClass = (status) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'in-progress') return 'status-in-progress';
    return 'status-pending';
  };

  const handleRoleChange = async (userId, role) => {
    setRoleUpdatingId(userId);

    try {
      const res = await fetch(`${API_BASE}/auth/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage('success', data.message || 'User role updated');
        fetchUsers();
      } else {
        const errMsg = data.errors?.[0]?.msg || data.message || 'Failed to update role';
        showMessage('error', errMsg);
      }
    } catch {
      showMessage('error', 'Network error. Could not update role.');
    } finally {
      setRoleUpdatingId('');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          Welcome, {user?.name}{' '}
          <span style={{ fontSize: 13, color: '#4c7e60' }}>({user?.role})</span>
        </h1>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {message.text && (
        <div className={message.type === 'error' ? 'msg-error' : 'msg-success'}>
          {message.text}
        </div>
      )}

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
                className="btn-secondary"
                onClick={() => handleUpdateTask(task)}
                style={{ marginRight: 8 }}
              >
                Edit
              </button>
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

      {user?.role === 'admin' && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>User Management</h3>
            <button className="btn-secondary" onClick={fetchUsers} disabled={usersLoading}>
              {usersLoading ? 'Refreshing...' : 'Refresh Users'}
            </button>
          </div>

          {users.length === 0 ? (
            <p style={{ color: '#4b6555' }}>No users found.</p>
          ) : (
            <div className="users-list">
              {users.map((u) => (
                <div className="user-row" key={u._id || u.id}>
                  <div className="user-info">
                    <strong>{u.name}</strong>
                    <span>{u.email}</span>
                  </div>

                  <div className="user-actions">
                    <span className="role-chip">{u.role}</span>
                    {u.role !== 'admin' ? (
                      <button
                        className="btn-secondary"
                        disabled={roleUpdatingId === (u._id || u.id)}
                        onClick={() => handleRoleChange(u._id || u.id, 'admin')}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="btn-danger"
                        disabled={roleUpdatingId === (u._id || u.id)}
                        onClick={() => handleRoleChange(u._id || u.id, 'user')}
                      >
                        Make User
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
