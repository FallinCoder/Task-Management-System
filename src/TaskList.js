import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(filters);
      setTasks(response.tasks);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        total: response.total
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks(); // Refresh the task list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading) return <div className="text-center mt-4">Loading tasks...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="task-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="statusFilter" className="form-label">Status</label>
          <select 
            id="statusFilter"
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="priorityFilter" className="form-label">Priority</label>
          <select 
            id="priorityFilter"
            className="form-select"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm 
          task={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
          <h4>No tasks found</h4>
          <p>Create your first task to get started</p>
        </div>
      ) : (
        <>
          <div className="row">
            {tasks.map(task => (
              <div key={task._id} className="col-md-6 col-lg-4 mb-4">
                <TaskItem 
                  task={task} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdate={fetchTasks}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${filters.page === index + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${filters.page === pagination.totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;