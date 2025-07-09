import express, { RequestHandler } from 'express';
import { createTask, getTasks } from '../controllers/taskscontrollers.js';

const router = express.Router();
router.post('/tasks', createTask as RequestHandler);
router.get('/tasks', getTasks as RequestHandler);

export default router;