import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

const AdminNotifications = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', date: '', time: '' });
  const [target, setTarget] = useState('notifications'); // notifications | updates | events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    if (target === 'events') {
      if (!form.date || !form.time) {
        setError('Date and Time are required for events');
        return;
      }
    }
    try {
      // duplicate check per target
      if (target === 'events') {
        const existingRes = await fetch(`${API}/events`);
        const existing = existingRes.ok ? await existingRes.json() : [];
        const key = (s) => (s || '').trim().toLowerCase();
        const isDupEv = Array.isArray(existing) && existing.some(ev =>
          key(ev.title) === key(form.title) &&
          key(ev.description) === key(form.message) &&
          key(ev.date) === key(form.date)
        );
        if (isDupEv) {
          setError('Duplicate event detected (same title, description, and date).');
          return;
        }
      } else {
        const dupRes = await fetch(`${API}/${target}`);
        const dupList = (dupRes.ok ? await dupRes.json() : []).map((x) => ({
          title: (x.title || '').trim().toLowerCase(),
          text: ((x.message || x.description || '')).trim().toLowerCase()
        }));
        const newTitle = form.title.trim().toLowerCase();
        const newText = form.message.trim().toLowerCase();
        const isDup = dupList.some((d) => d.title === newTitle && d.text === newText);
        if (isDup) {
          setError('Duplicate detected in the selected section. Please modify the content.');
          return;
        }
      }

      const endpoint = target === 'events' ? `${API}/events` : `${API}/${target}`;
      const payload = target === 'updates'
        ? { title: form.title, description: form.message, type: form.type, time: 'today' }
        : target === 'events'
          ? { title: form.title, description: form.message, date: form.date, time: form.time }
          : { title: form.title, message: form.message, type: form.type, time: 'just now', read: false };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('create failed');
      setForm({ title: '', message: '', type: 'info', date: '', time: '' });
      // If we added to notifications, refresh list; updates are not shown here but still created
      if (target === 'notifications') {
        load();
      }
      // broadcast data change for user UI to refresh immediately
      try { window.dispatchEvent(new Event('data-change')); } catch {}
      // show success popup and auto-dismiss
      const label = target === 'events' ? 'Event' : (target === 'updates' ? 'Update' : 'Notification');
      setSuccess(`${label} added successfully`);
      setTimeout(() => setSuccess(''), 2500);
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
            {success && (
              <div className="success-text" style={{ marginBottom: '0.75rem', background: '#d1fae5', border: '1px solid #34d399', color: '#065f46', padding: '0.6rem 0.75rem', borderRadius: 8 }}>
                {success}
              </div>
            )}

            <form onSubmit={addItem} style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Section</label>
                <select className="form-control" value={target} onChange={(e)=>setTarget(e.target.value)}>
                  <option value="notifications">Notifications (popup)</option>
                  <option value="updates">Updates (Events & Updates page)</option>
                  <option value="events">Events (Events & Updates page)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" name="message" value={form.message} onChange={handleChange} />
              </div>
              {target !== 'events' && (
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                    <option value="info">info</option>
                    <option value="warning">warning</option>
                    <option value="success">success</option>
                  </select>
                </div>
              )}

              {target === 'events' && (
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
              )}
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
