import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: ""
  });
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("createdAtDesc");
  const [auth, setAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const API_URL = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user may not be logged in");
        return;
      }
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }

    if (!["Pending", "In Progress", "Completed"].includes(form.status)) {
      setErrorMsg("Invalid status value.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("You must be logged in to save tasks.");
        return;
      }

      if (editId) {
        const res = await axios.put(`${API_URL}/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.map(task => (task._id === editId ? res.data : task)));
        setEditId(null);
      } else {
        const res = await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks([...tasks, res.data]);
      }
      setForm({ title: "", description: "", status: "Pending", dueDate: "" });
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrorMsg(err.response.data.errors[0].msg);
      } else {
        setErrorMsg("Error saving task.");
      }
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete tasks.");
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const editTask = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
    });
    setEditId(task._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    if (auth) fetchTasks();
  }, [auth]);

  // Calculate displayedTasks here:
  let displayedTasks = [...tasks];
  if (filter !== "All") {
    displayedTasks = displayedTasks.filter(task => task.status === filter);
  }
  displayedTasks.sort((a, b) => {
    if (sort === "createdAtAsc") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "createdAtDesc") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "dueDateAsc") return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
    if (sort === "dueDateDesc") return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
    return 0;
  });

  if (!auth) {
    return (
      <div className="auth-container">
        <h1>Task Manager</h1>
        {showLogin ? (
          <>
            <Login setAuth={setAuth} />
            <p className="toggle-text">
              Don’t have an account?{" "}
              <button className="toggle-btn" onClick={() => setShowLogin(false)}>
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <Register />
            <p className="toggle-text">
              Already have an account?{" "}
              <button className="toggle-btn" onClick={() => setShowLogin(true)}>
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h1>Task Manager</h1>

      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="createdAtDesc">Newest Created</option>
          <option value="createdAtAsc">Oldest Created</option>
          <option value="dueDateAsc">Due Date (Soonest)</option>
          <option value="dueDateDesc">Due Date (Latest)</option>
        </select>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedTasks.length === 0 ? (
            <tr>
              <td colSpan="6">No tasks available</td>
            </tr>
          ) : (
            displayedTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                <td>{new Date(task.createdAt).toLocaleString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => editTask(task)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
