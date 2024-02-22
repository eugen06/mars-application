import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [taskCreatorInput, setTaskCreatorInput] = useState('');
  const [jobtitle, setJobTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [marsImage, setMarsImage] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const storedWorkers = JSON.parse(localStorage.getItem('workers'));
    if (storedWorkers && storedWorkers.length > 0) {
      setWorkers(storedWorkers);
      setTaskCreatorInput(storedWorkers[storedWorkers.length - 1]?.TaskCreator || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
    setTaskCreatorInput(workers[workers.length - 1]?.TaskCreator || '');
  }, [workers]);

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
    let newWorker = {};
    if (editIndex !== null) {
      const updatedWorkers = [...workers];
      updatedWorkers[editIndex] = { Title: title, TaskCreator: taskCreatorInput, JobTitle: jobtitle, Assignee: assignee };
      setWorkers(updatedWorkers);
      setEditIndex(null);
    } else {
      newWorker = { Title: title, TaskCreator: taskCreatorInput, JobTitle: jobtitle, Assignee: assignee };
      setWorkers([...workers, newWorker]);
    }
    setTitle('');
    setTaskCreatorInput('');
    setJobTitle('');
    setAssignee('');
    setShowForm(false);
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
    setTaskCreatorInput(workerToEdit.TaskCreator);
    setJobTitle(workerToEdit.JobTitle);
    setAssignee(workerToEdit.Assignee);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleView = (index) => {
    const selectedTask = workers[index];
    setSelectedTask(selectedTask);
  };

  const TaskModal = ({ task, onClose }) => (
    <div className="modal" style={{ display: task ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Task Details</h2>
        {task && (
          <div>
            <p><strong>Title:</strong> {task.Title}</p>
            <p><strong>Task Creator:</strong> {task.TaskCreator}</p>
            <p><strong>Job Title:</strong> {task.JobTitle}</p>
            <p><strong>Assignee:</strong> {task.Assignee}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="header">
        <h1>Mars Mission </h1> 
      </div>
      <div className="side-panel">
        {marsImage && <img src={marsImage} alt="Mars" className="mars-image" />}
        <br></br>
        <h2 mt-3>Task Manager</h2>
        <p>Current User: <span id="current-user">{taskCreatorInput}</span></p>
        <p>Number of Tasks: <span id="task-count">{workers.length}</span></p>
        <button
          id="create-task"
          className="btn btn-primary mt-3"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
          }}
        >
          Create Task
        </button>
        <button
          id="delete-all-tasks"
          className="btn btn-danger btn-delete-all mt-3"
          onClick={() => setWorkers([])}
        >
          Delete All Tasks
        </button>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center main">
          {showForm && (
            <form onSubmit={handleSubmit} id="task-form" className="row justify-content-center mb-4">
              <div className="col-8 mb-2">
                <label htmlFor="title" style={{ textAlign: 'left', display: 'block' }}>Title</label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  required 
                />
              </div>
              <div className="col-8 mb-3">
                <label htmlFor="TaskCreator" style={{ textAlign: 'left', display: 'block' }}>Task Creator</label>
                <input
                  className="form-control"
                  value={taskCreatorInput}
                  onChange={(e) => setTaskCreatorInput(e.target.value)}
                  id="TaskCreator"
                  type="text"
                  placeholder="Enter task creator"
                  required 
                />
              </div>
              <div className="col-8 mb-3">
                <label htmlFor="jobtitle" style={{ textAlign: 'left', display: 'block' }}>Job Title</label>
                <input
                  className="form-control"
                  value={jobtitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  id="jobtitle"
                  type="text"
                  placeholder="Enter job title"
                  required 
                />
              </div>
              <div className="col-8 mb-3">
                <label htmlFor="assignee" style={{ textAlign: 'left', display: 'block' }}>Assignee</label>
                <input
                  className="form-control"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  id="assignee"
                  type="text"
                  placeholder="Enter assignee"
                  required 
                />
              </div>
              <div className="col-8">
                <button className="btn btn-success add-btn" type="submit">
                  {editIndex !== null ? 'Update Task' : 'Submit'}
                </button>
              </div>
            </form>
          )}
          <div className="col-8 mt-5">
            <table className="table table-striped ">
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
                      <button className="btn btn-info btn-sm View" onClick={() => handleView(i)}>View</button>
                      <button className="btn btn-delete btn-sm delete" onClick={() => handleDelete(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}

export default App;
