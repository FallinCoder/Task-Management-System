import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './services/socket';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Navbar 
              toggleSidebar={toggleSidebar} 
              toggleNotifications={toggleNotifications}
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
            />
            <div className="container-fluid">
              <div className="row">
                {sidebarOpen && (
                  <div className="col-md-3 col-lg-2 sidebar">
                    <Sidebar />
                  </div>
                )}
                <main className={`col-md-9 ${sidebarOpen ? 'col-lg-10' : 'col-12'} main-content`}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Routes>
                </main>
              </div>
            </div>
            <NotificationCenter 
              isOpen={notificationsOpen} 
              onClose={toggleNotifications} 
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;