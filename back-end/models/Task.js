const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: String,
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    status: { type: String, enum: ['pending', 'completed'], required: true },
    assignedUsers: [{ type: String }]
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
