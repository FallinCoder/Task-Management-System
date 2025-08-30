import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleNotifications, toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <button 
          className="btn btn-outline-light me-2"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <Link className="navbar-brand" to="/">
          <i className="fas fa-tasks me-2"></i>
          TaskFlow
        </Link>
        
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-light me-2"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={darkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          
          <button 
            className="btn btn-outline-light me-3 position-relative"
            onClick={toggleNotifications}
          >
            <i className="fas fa-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-user me-1"></i>
              {user?.name}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  <i className="fas fa-user me-2"></i>Profile
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;