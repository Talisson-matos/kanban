import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js'; // ✅ extensão .js para ESM

export function ensureAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('🚫 Requisição sem token.');
    res.status(401).json({ message: 'Token ausente.' });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = verifyToken(token);
    (req as any).user = payload; // 👈 Anexamos o payload JWT à requisição
    console.log('🔐 Token válido. Usuário autenticado:', payload);
    next();
  } catch (err) {
    console.error('❌ Falha na verificação do token:', err);
    res.status(401).json({ message: 'Token inválido.' });
  }
}
