require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoute');
const taskRouter = express.Router()
const path = require('path')

const app = express();
app.use(express.json());    
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

    // Static file serving for production (optional)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// taskRouter.get('/tasks', async (req, res) => {
//     console.log('Tasks endpoint hit');
//     try {
//         const tasks = await Task.find(); // Adjust based on your Mongoose model
//         res.json(tasks);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// Routes
app.use('/api/tasks', taskRoutes);

// Fallback to frontend app for unmatched routes (optional for production)
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
