import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import your custom CSS file

function App() {
  const [title, setTitle] = useState('');
  const [TaskCreator, setTaskCreator] = useState('');
  const [jobtitle, setJobTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited
  const [marsImage, setMarsImage] = useState('');

  // Load data from local storage on component mount
  useEffect(() => {
    const storedWorkers = JSON.parse(localStorage.getItem('workers'));
    if (storedWorkers) {
      setWorkers(storedWorkers); // Set workers state with data retrieved from localStorage
    }
  }, []);

  // Update local storage whenever workers state changes
  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers)); // Save workers state to localStorage
  }, [workers]);

  // Fetch Mars image asynchronously
  useEffect(() => {
    fetch('https://source.unsplash.com/random/800x600/?mars')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.url;
      })
      .then(imageUrl => setMarsImage(imageUrl))
      .catch(error => console.error('Error fetching image:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing task if edit mode is active
      const updatedWorkers = [...workers];
      updatedWorkers[editIndex] = { Title: title, TaskCreator: TaskCreator, JobTitle: jobtitle, Assignee: assignee };
      setWorkers(updatedWorkers);
      setEditIndex(null); // Exit edit mode after updating
    } else {
      // Add new task if edit mode is not active
      const newWorker = { Title: title, TaskCreator: TaskCreator, JobTitle: jobtitle, Assignee: assignee };
      setWorkers([...workers, newWorker]);
    }
    // Clear input fields after submitting
    setTitle('');
    setTaskCreator('');
    setJobTitle('');
    setAssignee('');
    setShowForm(false); // Hide the form after submission
  };

  const handleDelete = (index) => {
    setWorkers((prevWorkers) => {
      const updatedWorkers = [...prevWorkers];
      updatedWorkers.splice(index, 1);
      return updatedWorkers;
    });
  };

  const handleEdit = (index) => {
    const workerToEdit = workers[index];
    setTitle(workerToEdit.Title);
    setTaskCreator(workerToEdit.TaskCreator);
    setJobTitle(workerToEdit.JobTitle);
    setAssignee(workerToEdit.Assignee);
    setEditIndex(index); // Activate edit mode and set the index
    setShowForm(true); // Show the form
  };

  return (
    <div className="App">
      {/* Colored header with fixed position */}
      <div className="header">
        <h1>Mars Mission {marsImage && <img src={marsImage} alt="Mars" className="mars-image" />} {/* Render Mars image */}</h1> 
      </div>
      {/* Main content */}
      <div className="side-panel">
        <h2>TASK</h2>
        <p>Current User: <span id="current-user">{TaskCreator}</span></p>
        <p>Number of Tasks: <span id="task-count">{workers.length}</span></p>
        <button
          id="delete-all-tasks"
          className="btn btn-danger btn-delete-all"
          onClick={() => setWorkers([])}
        >
          Delete All Tasks
        </button>
        <button
          id="create-task"
          className="btn btn-primary mt-3"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null); // Reset edit index when creating a new task
          }}
        >
          Create Task
        </button>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center main">
        {showForm && (
  <form onSubmit={handleSubmit} id="task-form" className="row justify-content-center mb-4">
    <div className="col-8 mb-3">
      <label htmlFor="title">Title</label>
      <input
        className="form-control"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        id="title"
        type="text"
        placeholder="Enter task title"
      />
    </div>
    <div className="col-8 mb-3">
      <label htmlFor="TaskCreator">Task Creator</label>
      <input
        className="form-control"
        value={TaskCreator}
        onChange={(e) => setTaskCreator(e.target.value)}
        id="TaskCreator"
        type="text"
        placeholder="Enter task creator"
      />
    </div>
    <div className="col-8 mb-3">
      <label htmlFor="jobtitle">Job Title</label>
      <input
        className="form-control"
        value={jobtitle}
        onChange={(e) => setJobTitle(e.target.value)}
        id="jobtitle"
        type="text"
        placeholder="Enter job title"
      />
    </div>
    <div className="col-8 mb-3">
      <label htmlFor="assignee">Assignee</label>
      <input
        className="form-control"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        id="assignee"
        type="text"
        placeholder="Enter assignee"
      />
    </div>
    <div className="col-8">
      <button className="btn btn-success add-btn" type="submit">
        {editIndex !== null ? 'Update Task' : 'Create Task'} {/* Change button text based on edit mode */}
      </button>
    </div>
  </form>
)}
          <div className="col-8 mt-5">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Task Creator</th>
                  <th>Job Title</th>
                  <th>Assignee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="task-list">
                {workers.map((x, i) => (
                  <tr key={i}>
                    <td>{x.Title}</td>
                    <td>{x.TaskCreator}</td>
                    <td>{x.JobTitle}</td>
                    <td>{x.Assignee}</td>
                    <td>
                      <button className="btn btn-warning btn-sm edit" onClick={() => handleEdit(i)}>Edit</button>
                      <button className="btn btn-delete btn-sm delete" onClick={() => handleDelete(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
