import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { analyticsAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewResponse, trendsResponse] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getTrends({ period })
      ]);
      
      setOverview(overviewResponse.data);
      setTrends(trendsResponse.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
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

  if (!overview) {
    return (
      <div className="alert alert-danger">
        Failed to load analytics data
      </div>
    );
  }

  // Prepare data for charts
  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [overview.pendingTasks, overview.inProgressTasks, overview.completedTasks],
        backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0']
      }
    ]
  };

  const priorityData = {
    labels: overview.priorityBreakdown.map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)),
    datasets: [
      {
        data: overview.priorityBreakdown.map(item => item.count),
        backgroundColor: ['#4bc0c0', '#36a2eb', '#ff6384'],
        hoverBackgroundColor: ['#4bc0c0', '#36a2eb', '#ff6384']
      }
    ]
  };

  const trendsData = {
    labels: trends?.completedTrends.map(item => item._id) || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: trends?.completedTrends.map(item => item.count) || [],
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      },
      {
        label: 'Tasks Created',
        data: trends?.createdTrends.map(item => item.count) || [],
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
      }
    ]
  };

  return (
    <div className="analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Analytics Dashboard</h2>
        <select 
          className="form-select w-auto"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">{overview.totalTasks}</h3>
              <p className="card-text text-muted">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-success">{overview.completedTasks}</h3>
              <p className="card-text text-muted">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-warning">{overview.pendingTasks + overview.inProgressTasks}</h3>
              <p className="card-text text-muted">Incomplete</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-danger">{overview.overdueTasks}</h3>
              <p className="card-text text-muted">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Task Status Distribution</h5>
            </div>
            <div className="card-body">
              <Doughnut 
                data={statusData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Task Priority Distribution</h5>
            </div>
            <div className="card-body">
              <Doughnut 
                data={priorityData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Task Trends</h5>
            </div>
            <div className="card-body">
              <Line 
                data={trendsData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Completion Rate</h5>
            </div>
            <div className="card-body">
              <div className="progress" style={{ height: '30px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${overview.completionRate}%` }}
                  aria-valuenow={overview.completionRate}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {overview.completionRate.toFixed(1)}%
                </div>
              </div>
              <p className="mt-2 text-muted">
                {overview.completedTasks} of {overview.totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;  