import express from 'express';
import { applyMiddleware, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/fileUpload.js';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Admin Routes
router.post('/admin/register-user', applyMiddleware, requireAdmin, userController.registerUser);
router.post('/admin/upload-excel-register-user', applyMiddleware, requireAdmin, upload.single('file'), userController.uploadExcelRegisterUser);

// Student Routes
router.post('/admin/register/student', applyMiddleware, requireAdmin, userController.registerStudent);

// Faculty Routes
router.post('/admin/register/faculty', applyMiddleware, requireAdmin, userController.registerFaculty);

// User Routes
router.post('/login', authController.loginUser);


// User CRUD Routes
router.get('/user/:username', applyMiddleware, userController.getUser);
router.put('/user/:userId', applyMiddleware, userController.updateUser);
router.delete('/user/:userId', applyMiddleware, requireAdmin, userController.deleteUser);

export default router;
