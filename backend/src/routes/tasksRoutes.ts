import { Router, RequestHandler } from 'express';
import { criarTarefa, listarTarefas } from '../controllers/tasksControllers.js';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', ensureAuth as RequestHandler, listarTarefas as RequestHandler);
router.post('/', ensureAuth as RequestHandler, criarTarefa as RequestHandler);

export default router;
