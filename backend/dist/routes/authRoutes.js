// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authControllers.js'; // ⚠️ extensão .js obrigatória em ESM
const router = Router();
// 🔐 Rota de registro de usuário
router.post('/register', register);
// 🔑 Rota de login de usuário
router.post('/login', login);
export default router;
