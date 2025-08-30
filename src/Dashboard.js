import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const [recentTasks, setRecentTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse] = await Promise.all([
        tasksAPI.getTasks({ limit: 5 })
      ]);

      setRecentTasks(tasksResponse.data.tasks);
      
      // Calculate stats (this would normally come from the backend)
      const total = tasksResponse.data.total;
      const completed = tasksResponse.data.tasks.filter(t => t.status === 'completed').length;
      const pending = tasksResponse.data.tasks.filter(t => t.status === 'pending').length;
      const overdue = tasksResponse.data.tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length;

      setStats({ total, completed, pending, overdue });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-primary">{stats.total}</h3>
              <p className="card-text text-muted">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-success">{stats.completed}</h3>
              <p className="card-text text-muted">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-warning">{stats.pending}</h3>
              <p className="card-text text-muted">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-danger">{stats.overdue}</h3>
              <p className="card-text text-muted">Overdue</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Tasks</h5>
              <a href="/tasks" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              {recentTasks.length === 0 ? (
                <p className="text-muted text-center py-3">No tasks yet</p>
              ) : (
                <div className="row">
                  {recentTasks.map(task => (
                    <div key={task._id} className="col-md-6 col-lg-4 mb-3">
                      <TaskItem task={task} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;