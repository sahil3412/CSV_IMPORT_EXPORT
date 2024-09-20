import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [page, filters]);

    // const fetchTasks = async () => {
    //     const response = await axios.get(`/api/tasks?page=${page}`, { params: filters });
    //     setTasks(response.data);
    // };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/tasks?page=${page}`);
            console.log('Fetched tasks:', response.data); // Log the response
            setTasks(response.data.tasks || []); // Ensure tasks is an array
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
            setError('Failed to fetch tasks. Please try again later.');
            setTasks([]); // Reset tasks on error
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h3>Task List</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <input name="status" placeholder="Status" onChange={handleFilterChange} />
                <input name="priority" placeholder="Priority" onChange={handleFilterChange} />
            </div>
            <ul>
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map(task => (
                        <li key={task._id}>
                            {task.title} - {task.status}
                        </li>
                    ))
                ) : (
                    <li>No tasks found.</li>
                )}
            </ul>
            <button onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TaskList;
