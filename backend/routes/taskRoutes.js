const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const taskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(taskLimiter);
router.use(protect);

const taskValidation = [
  body('title').notEmpty().withMessage('Task title is required'),
];

router.route('/').get(getTasks).post(taskValidation, createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
