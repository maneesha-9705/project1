import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Discussion from './pages/Discussion';
import ProtectedRoute from './components/ProtectedRoute';
import QuickRegister from './pages/QuickRegister';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminEvents from './pages/admin/AdminEvents';

function App() {
  const [registered, setRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState({ email: 'user@example.com', name: 'User' });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Event Added",
      message: "Career Fair 2024 has been scheduled for October 15th",
      time: "2 minutes ago",
      type: "event",
      read: false
    },
    {
      id: 2,
      title: "Library Hours Extended",
      message: "The main library will now be open until 11 PM during exam season",
      time: "1 hour ago",
      type: "update",
      read: false
    },
    {
      id: 3,
      title: "New Discussion",
      message: "Best study techniques for finals - new discussion started",
      time: "3 hours ago",
      type: "discussion",
      read: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const reg = localStorage.getItem('registered') === 'true';
    setRegistered(reg);
    const handler = () => setRegistered(localStorage.getItem('registered') === 'true');
    window.addEventListener('registered-change', handler);
    return () => window.removeEventListener('registered-change', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Authentication functions
  const login = () => true;

  const register = (data) => true;

  const logout = () => {
    localStorage.removeItem('registered');
    setRegistered(false);
    setShowNotifications(false);
    window.location.assign('/register');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setShowNotifications(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          isLoggedIn={registered}
          currentUser={currentUser}
          login={login}
          register={register}
          logout={logout}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
          markNotificationAsRead={markNotificationAsRead}
          removeNotification={removeNotification}
          unreadCount={unreadCount}
        />

        <Routes>
          <Route path="/register" element={<QuickRegister onSuccess={() => { localStorage.setItem('registered', 'true'); setRegistered(true); }} />} />
          <Route path="/" element={
            <ProtectedRoute isLoggedIn={registered}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute isLoggedIn={registered}>
              <About />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute isLoggedIn={registered}>
              <Events isLoggedIn={registered} />
            </ProtectedRoute>
          } />
          <Route path="/discussion" element={
            <ProtectedRoute isLoggedIn={registered}>
              <Discussion isLoggedIn={registered} />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <AdminProtectedRoute>
              <AdminNotifications />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <AdminProtectedRoute>
              <AdminEvents />
            </AdminProtectedRoute>
          } />
          {/* Admin aliases and wildcard */}
          <Route path="/admin/notification" element={<Navigate to="/admin/notifications" replace />} />
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <Navigate to="/admin/notifications" replace />
            </AdminProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
