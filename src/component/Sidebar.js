import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link 
            className={`nav-link ${isActive('/')}`} 
            to="/"
          >
            <i className="fas fa-home me-2"></i>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className={`nav-link ${isActive('/tasks')}`} 
            to="/tasks"
          >
            <i className="fas fa-tasks me-2"></i>
            Tasks
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className={`nav-link ${isActive('/analytics')}`} 
            to="/analytics"
          >
            <i className="fas fa-chart-bar me-2"></i>
            Analytics
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className={`nav-link ${isActive('/shared')}`} 
            to="/shared"
          >
            <i className="fas fa-share-alt me-2"></i>
            Shared with Me
          </Link>
        </li>
      </ul>
      
      <hr />
      
      <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted text-uppercase">
        Workspaces
      </h6>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="fas fa-briefcase me-2"></i>
            Personal
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="fas fa-users me-2"></i>
            Team Projects
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;