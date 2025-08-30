import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';

const ShareTaskModal = ({ task, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // This would typically come from a users API endpoint
      // For now, we'll simulate some users
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { _id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
        { _id: '4', name: 'Alice Williams', email: 'alice@example.com' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to share with');
      return;
    }

    setLoading(true);
    try {
      await tasksAPI.shareTask(task._id, selectedUsers);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error sharing task:', error);
      alert('Failed to share task');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Task: {task.title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="userSearch" className="form-label">Search Users</label>
              <input
                type="text"
                className="form-control"
                id="userSearch"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="user-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <p className="text-muted text-center py-3">No users found</p>
              ) : (
                filteredUsers.map(user => (
                  <div key={user._id} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`user-${user._id}`}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                    />
                    <label className="form-check-label" htmlFor={`user-${user._id}`}>
                      {user.name} ({user.email})
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleShare}
              disabled={loading || selectedUsers.length === 0}
            >
              {loading ? 'Sharing...' : `Share with ${selectedUsers.length} user(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTaskModal;