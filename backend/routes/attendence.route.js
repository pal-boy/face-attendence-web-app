import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getAttendanceByUser, markAttendance } from '../controllers/attendence.controller.js';

const attendanceRoutes = express.Router();

attendanceRoutes.post('/mark', verifyToken, markAttendance);
attendanceRoutes.get('/:userId', verifyToken, getAttendanceByUser);

export default attendanceRoutes;