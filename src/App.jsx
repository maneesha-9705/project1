import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Discussion from './pages/Discussion';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  // Authentication functions
  const login = (email, password) => {
    // Simple mock authentication - in real app this would call an API
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentUser({ email, name: email.split('@')[0] });
      return true;
    }
    return false;
  };

  const register = (email, password, name) => {
    // Simple mock registration - in real app this would call an API
    if (email && password && name) {
      setIsLoggedIn(true);
      setCurrentUser({ email, name });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowNotifications(false);
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

  return (
    <Router>
      <div className="App">
        <Navbar
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          login={login}
          register={register}
          logout={logout}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
          markNotificationAsRead={markNotificationAsRead}
          unreadCount={unreadCount}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Events isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          } />
          <Route path="/discussion" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Discussion isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
