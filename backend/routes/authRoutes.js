const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', authLimiter, protect, getMe);
router.get('/admin/users', authLimiter, protect, authorize('admin'), getUsers);
router.patch(
  '/admin/users/:id/role',
  authLimiter,
  protect,
  authorize('admin'),
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  updateUserRole
);

module.exports = router;
