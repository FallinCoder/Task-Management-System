import React, { useState } from 'react';
import { tasksAPI } from '../services/api';
import ShareTaskModal from './ShareTaskModal';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await tasksAPI.updateTask(task._id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <>
      <div className={`card task-card ${getPriorityClass()}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title">{task.title}</h5>
            <div className="dropdown">
              <button 
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => onEdit(task)}
                  >
                    <i className="fas fa-edit me-2"></i>Edit
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => setShowShareModal(true)}
                  >
                    <i className="fas fa-share me-2"></i>Share
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger"
                    onClick={() => onDelete(task._id)}
                  >
                    <i className="fas fa-trash me-2"></i>Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="card-text text-muted small">
            {task.description || 'No description'}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`badge bg-${isOverdue() ? 'danger' : 'secondary'}`}>
              {isOverdue() ? 'Overdue' : formatDate(task.dueDate)}
            </span>
            <span className={`badge bg-${
              task.status === 'completed' ? 'success' : 
              task.status === 'in-progress' ? 'warning' : 'info'
            }`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <select 
              className="form-select form-select-sm"
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <div className="ms-2">
              {task.sharedWith && task.sharedWith.length > 0 && (
                <span className="badge bg-light text-dark me-1">
                  <i className="fas fa-users me-1"></i>
                  {task.sharedWith.length}
                </span>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <span className="badge bg-light text-dark">
                  <i className="fas fa-paperclip me-1"></i>
                  {task.attachments.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareTaskModal
          task={task}
          onClose={() => setShowShareModal(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};

export default TaskItem;