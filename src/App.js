import React, { useState } from 'react';
import './App.css';
import configData from './config/config-file.json';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const runWorkflow = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("TOKEN");
    const owner = "kanaiyathacker1980";
    const repo = "react-app";
    const workflowFileName = "main-sec.yml";

    fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFileName}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: "master" })
    })
      .then(response => {
        if (response.status === 204) {
          return {};
        }
        return response.json();
      })
      .then(data => {
        alert("Workflow triggered successfully!");
        console.log(data);
      })
      .catch(error => {
        alert("Error triggering workflow");
        console.error(error);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted: \nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
  };

  const readFile = (e) => {
    e.preventDefault();
    // simplyfy json data
    const simplifiedData = JSON.stringify(configData, null, 2);
    alert(simplifiedData);
  };

  const readFileFromGitHub = (e) => {
    e.preventDefault();
    // simplyfy json data

    const owner = 'kanaiyathacker1980';
    const repo = 'react-app';
    const filePath = 'new-folder/newfile.json';
    // In create-react-app, environment variables must be prefixed with REACT_APP_ to be accessible at runtime.
    // Replace process.env.GITHUB_TOKEN with the following:
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("TOKEN");
    
    alert(token);
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        const fileContent = atob(data.content);
        alert(JSON.stringify(JSON.parse(fileContent), null, 2));
      })
      .catch(error => console.error('Error:', error));
  };

  const writeFile = (e) => {
    e.preventDefault();
    const newContent = { exampleKey: 'exampleValue' };

    const owner = 'kanaiyathacker1980';
    const repo = 'react-app';
    const filePath = 'new-folder/newfile.json';
    

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("TOKEN");
    
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        const sha = data.sha;
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Create or update file',
            content: btoa(JSON.stringify(newContent)),
            sha: sha
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log('File created or updated:', data))
          .catch((error) => console.error('Error:', error));
      })
      .catch(error => console.error('Error fetching file:', error));
  
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Form</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={{ padding: '8px', width: '200px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '8px', width: '200px' }}
          />
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            style={{ padding: '8px', width: '200px', height: '80px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Submit
          </button>
          <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={readFile}>
            Read File
          </button>
          <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={readFileFromGitHub}>
            Read File from GitHub
          </button>
          <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={writeFile}>
            Write File
          </button>
          <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={runWorkflow}>
            Run Workflow
          </button>

        </form>
      </header>
    </div>
  );
}

export default App;

