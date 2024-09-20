import React, { useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

const TaskImportExport = () => {
    const [file, setFile] = useState(null);
    const [tasks, setTasks] = useState([]);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    // const handleImport = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file); // If you're sending a file
      
    //     try {
    //       const response = await axios.post('http://localhost:3000/api/tasks/import',formData);
    //         console.log("success");
            
    //       if (!response.ok) {
    //         const errorMessage = await response.text(); // Get error details from server
    //         throw new Error(`Error: ${errorMessage}`);
    //       }
      
    //       const result = await response.json();
    //       console.log('Import successful:', result);
    //     } catch (error) {
    //       console.error('Error importing tasks:', error.message); // Log error message
    //     }
    //   };

    const handleImport = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          const response = await axios.post('http://localhost:3000/api/tasks/import',formData);
  
          console.log('Response status:', response.status); // Log status
          const result = await response.json();
          console.log('Import result:', result); // Log result
  
          // Check if the result contains expected data
          if (Array.isArray(result.tasks)) {
              setTasks(result.tasks); // Set tasks only if it's an array
          } else {
              console.error('Expected an array but got:', result.tasks);
          }
  
      } catch (error) {
          console.error('Error importing tasks:', error.message);
      }
  };
  

    const handleExport = async () => {
        const response = await axios.get('http://localhost:3000/api/tasks/export', { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'tasks.csv';
        link.click();
    };

    return (
        <div>
            <h3>Import/Export Tasks</h3>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={() => handleImport(file)}>Import CSV</button>

            <button onClick={handleExport}>Export CSV</button>
            <CSVLink data={tasks} filename="tasks.csv">
                Download Exported CSV
            </CSVLink>
        </div>
    );
};

export default TaskImportExport;
