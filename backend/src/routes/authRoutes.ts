// src/routes/authRoutes.ts
import { RequestHandler, Router } from 'express';
import { register, login } from '../controllers/authControllers.js'; // ⚠️ extensão .js obrigatória em ESM

const router = Router();

// 🔐 Rota de registro de usuário
router.post('/register', register as RequestHandler);

// 🔑 Rota de login de usuário
router.post('/login', login as RequestHandler) ;

export default router;
