    import express, { RequestHandler } from 'express';
import { createTask, getTasks, upload, downloadFile } from '../controllers/taskscontrollers.js';

    const router = express.Router();
    router.post('/tasks', upload.single('file'), createTask as RequestHandler);
    router.get('/tasks', getTasks as RequestHandler);
    router.get('/download/:file', downloadFile as RequestHandler);

    export default router;