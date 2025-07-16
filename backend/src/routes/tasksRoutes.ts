import express, { RequestHandler } from 'express';
import { ensureAuth } from '../middleware/authMiddleware.js';
import { createTask, getTasks, upload, downloadFile, deleteTask, updateTask, updateStatus   } from '../controllers/tasksControllers.js';

    const router = express.Router();
    router.post('/tasks',ensureAuth, upload.single('file'), createTask as RequestHandler);
    router.post('/tasks/update-status', ensureAuth, updateStatus as RequestHandler);
    router.get('/tasks', ensureAuth, getTasks as RequestHandler);
    router.get('/download/:file', ensureAuth, downloadFile as RequestHandler);
    router.delete('/tasks/:id', ensureAuth, deleteTask as RequestHandler);
    router.put('/tasks/:id', ensureAuth, updateTask as RequestHandler);

    export default router;