import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

const AdminEvents = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', time: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/events`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError('Failed to load events');
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
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and Description are required');
      return;
    }
    try {
      // duplicate check
      const existingRes = await fetch(`${API}/events`);
      const existing = existingRes.ok ? await existingRes.json() : [];
      const key = (s) => (s || '').trim().toLowerCase();
      const isDup = Array.isArray(existing) && existing.some(ev =>
        key(ev.title) === key(form.title) &&
        key(ev.description) === key(form.description) &&
        key(ev.date) === key(form.date)
      );
      if (isDup) {
        setError('Duplicate event detected (same title, description, and date).');
        return;
      }

      const res = await fetch(`${API}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form })
      });
      if (!res.ok) throw new Error('create failed');
      setForm({ title: '', description: '', date: '', time: '' });
      load();
      setSuccess('Event added successfully');
      setTimeout(() => setSuccess(''), 2500);
      try { window.dispatchEvent(new Event('data-change')); } catch {}
    } catch {
      setError('Failed to create event');
    }
  };

  const remove = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API}/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError('Failed to delete');
    }
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setEditForm({ title: n.title || '', description: n.description || '', date: n.date || '', time: n.time || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', date: '', time: '' });
  };

  const saveEdit = async (id) => {
    setError('');
    if (!editForm.title.trim() || !editForm.description.trim()) {
      setError('Title and Description are required');
      return;
    }
    try {
      const res = await fetch(`${API}/events/${id}`, {
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
    [n.title, n.description, n.date, n.time].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="about-section" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Admin • Events</h2>
            <p className="muted">Create and manage events visible to students.</p>
            {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}
            {success && (
              <div className="success-text" style={{ marginBottom: '0.75rem', background: '#d1fae5', border: '1px solid #34d399', color: '#065f46', padding: '0.6rem 0.75rem', borderRadius: 8 }}>
                {success}
              </div>
            )}

            <form onSubmit={addItem} style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input className="form-control" type="time" name="time" value={form.time} onChange={handleChange} />
                </div>
              </div>
              <button className="btn btn-primary" type="submit">Add Event</button>
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
                  {filtered.length === 0 && <p>No events</p>}
                  {filtered.map((n) => (
                    <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                      <div>
                        {editingId === n.id ? (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input className="form-control" value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} />
                            <textarea className="form-control" value={editForm.description} onChange={(e)=>setEditForm({...editForm, description: e.target.value})} />
                            <div className="form-row">
                              <input className="form-control" type="date" value={editForm.date} onChange={(e)=>setEditForm({...editForm, date: e.target.value})} />
                              <input className="form-control" type="time" value={editForm.time} onChange={(e)=>setEditForm({...editForm, time: e.target.value})} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <strong>{n.title}</strong>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{n.description}</div>
                            <div style={{ color: '#999', fontSize: '0.85rem' }}>{n.date} {n.time}</div>
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

export default AdminEvents;
