const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

// CRUD
router.post('/', auth, controller.createTask);
router.get('/', controller.listTasks);
router.get('/:id', controller.getTask);
router.put('/:id', auth, controller.updateTask);
router.delete('/:id', auth, controller.deleteTask);

module.exports = router;
