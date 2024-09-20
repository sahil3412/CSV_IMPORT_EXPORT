const express = require('express');
const { exportTasks, importTasks, getTasks, filterTasks } = require('../controllers/taskController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Export tasks to CSV
router.get('/export', exportTasks);

// Import tasks from CSV
// router.post('/import', upload.single('file'), async (req, res) => {
//     try {
//       const file = req.file;
      
//       if (!file) {
//         return res.status(400).send({ message: 'No file uploaded' });
//       }
  
//       const tasks = [];
      
//       // Parse CSV file (example)
//       fs.createReadStream(file.path)
//         .pipe(csv())
//         .on('data', (row) => {
//             if (row.title && row.dueDate) {
//                 tasks.push({
//                   title: row.title,
//                   description: row.description || '',
//                   dueDate: new Date(row.dueDate),
//                   priority: row.priority || 'medium', // Default value
//                   status: row.status || 'pending', // Default value
//                   assignedUsers: row.assignedUsers ? row.assignedUsers.split(',') : []
//                 });
//               } else {
//                 console.log('Invalid row:', row); // Log invalid rows for debugging
//               }
//             })
//         .on('end', async () => {
//           try {
//             // Insert tasks into MongoDB
//             await Task.insertMany(tasks);
//             res.status(200).send({ message: 'Tasks imported successfully' });
//           } catch (err) {
//             console.error('Database Error:', err);
//             res.status(500).send({ message: 'Failed to import tasks into the database' });
//           }
//         });
  
//     } catch (error) {
//       console.error('Task Import Error:', error);
//       res.status(500).send({ message: 'Server Error: Task import failed' });
//     }
//   });

router.post('/import', upload.single('file'), importTasks);

// Get tasks with filtering and pagination
// router.get('/', getTasks);
// router.get('/tasks', async (req, res) => {
//     console.log('Tasks endpoint hit');
//     try {
//         const tasks = await Task.find(); // Assuming Task is your Mongoose model
//         res.json(tasks);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

router.get('/', getTasks);

// Filter tasks with advanced criteria
router.post('/filter', filterTasks);

module.exports = router;
