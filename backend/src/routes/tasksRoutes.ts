    import express, { RequestHandler } from 'express';
import { createTask, getTasks, upload, downloadFile, deleteTask, updateTask, updateStatus   } from '../controllers/taskscontrollers.js';

    const router = express.Router();
    router.post('/tasks', upload.single('file'), createTask as RequestHandler);
    router.post('/tasks/update-status', updateStatus as RequestHandler);
    router.get('/tasks', getTasks as RequestHandler);
    router.get('/download/:file', downloadFile as RequestHandler);
    router.delete('/tasks/:id', deleteTask as RequestHandler);
    router.put('/tasks/:id', updateTask as RequestHandler);

    export default router;