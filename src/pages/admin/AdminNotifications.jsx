import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

const AdminNotifications = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', message: '', type: 'info' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/notifications`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const addItem = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and Message are required');
      return;
    }
    try {
      const res = await fetch(`${API}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, time: 'just now', read: false })
      });
      if (!res.ok) throw new Error('create failed');
      setForm({ title: '', message: '', type: 'info' });
      load();
    } catch {
      setError('Failed to create notification');
    }
  };

  const remove = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API}/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError('Failed to delete');
    }
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setEditForm({ title: n.title || '', message: n.message || '', type: n.type || 'info' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', message: '', type: 'info' });
  };

  const saveEdit = async (id) => {
    setError('');
    if (!editForm.title.trim() || !editForm.message.trim()) {
      setError('Title and Message are required');
      return;
    }
    try {
      const res = await fetch(`${API}/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm })
      });
      if (!res.ok) throw new Error('update failed');
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...editForm } : x)));
      cancelEdit();
    } catch {
      setError('Failed to update');
    }
  };

  const filtered = items.filter((n) =>
    [n.title, n.message, n.type].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="about-section" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Admin • Notifications</h2>
            <p className="muted">Create announcements for users. This does not disturb the user UI.</p>
            {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}

            <form onSubmit={addItem} style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" name="message" value={form.message} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                  <option value="info">info</option>
                  <option value="warning">warning</option>
                  <option value="success">success</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">Add Notification</button>
            </form>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <h3>Existing</h3>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <input className="form-control" placeholder="Search..." value={query} onChange={(e)=>setQuery(e.target.value)} />
              </div>
              {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {filtered.length === 0 && <p>No notifications</p>}
                  {filtered.map((n) => (
                    <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                      <div>
                        {editingId === n.id ? (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input className="form-control" value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} />
                            <textarea className="form-control" value={editForm.message} onChange={(e)=>setEditForm({...editForm, message: e.target.value})} />
                            <select className="form-control" value={editForm.type} onChange={(e)=>setEditForm({...editForm, type: e.target.value})}>
                              <option value="info">info</option>
                              <option value="warning">warning</option>
                              <option value="success">success</option>
                            </select>
                          </div>
                        ) : (
                          <>
                            <strong>[{n.type}]</strong> {n.title}
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{n.message}</div>
                          </>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {editingId === n.id ? (
                          <>
                            <button className="btn btn-primary" onClick={()=>saveEdit(n.id)}>Save</button>
                            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-primary" onClick={()=>startEdit(n)}>Edit</button>
                            <button className="btn btn-secondary" onClick={() => remove(n.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '1rem' }}>
                <Link className="btn btn-secondary" to="/admin">Back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminNotifications;
