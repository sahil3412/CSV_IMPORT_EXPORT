const Task = require('../models/Task');
const fastcsv = require('fast-csv');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path')

exports.exportTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        const csvFilePath = path.join(__dirname, '../../tasks.csv');
        const ws = fs.createWriteStream('tasks.csv');

        fastcsv
            .write(tasks, { headers: true })
            .pipe(ws)
            .on('finish', function () {
                res.download(csvFilePath, 'tasks.csv', (err) => {
                  if (err) {
                    console.error('Error downloading CSV:', err);
                  }
                  // Delete file after download
                  fs.unlinkSync(csvFilePath);
                });
              });
    } catch (error) {
        res.status(500).json({ message: 'Error exporting tasks' });
    }
};

exports.importTasks = (req, res) => {
    const fileRows = [];
    const file = req.file;
    
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', file);
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            // Validation checks for row
            if (!row.title || !row.dueDate) {
                fileRows.push({ error: 'Missing required fields', row });
            } else {
                fileRows.push(row);
            }
        })
        .on('end', async () => {
            try {
                await Task.insertMany(fileRows);
                res.status(200).json({ message: 'Tasks imported successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error importing tasks' });
            }
        });
};

// exports.getTasks = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, sortBy = 'dueDate', order = 'asc' } = req.query;
//         const tasks = await Task.find({})
//             .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
//             .limit(limit * 1)
//             .skip((page - 1) * limit);

//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching tasks' });
//     }
// };

exports.getTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Set a limit for pagination

    try {
        const tasks = await Task.find() // Assuming you're using Mongoose
            .skip((page - 1) * limit)
            .limit(limit);
        
        res.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error); // Log the error
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
};

exports.filterTasks = async (req, res) => {
    try {
        const { status, priority, dueDateFrom, dueDateTo, assignee } = req.body;
        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (dueDateFrom && dueDateTo) query.dueDate = { $gte: dueDateFrom, $lte: dueDateTo };
        if (assignee) query.assignedUsers = assignee;

        const tasks = await Task.find(query);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering tasks' });
    }
};

