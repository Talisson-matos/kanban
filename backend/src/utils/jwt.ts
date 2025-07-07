import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const expiresIn = process.env.JWT_EXPIRES_IN;

if (!secret || typeof secret !== 'string') {
  throw new Error('❌ JWT_SECRET ausente ou inválido nas variáveis de ambiente.');
}

if (!expiresIn || typeof expiresIn !== 'string') {
  throw new Error('❌ JWT_EXPIRES_IN ausente ou inválido nas variáveis de ambiente.');
}

const jwtOptions: SignOptions = {
  expiresIn: expiresIn as SignOptions['expiresIn'], // ou apenas `expiresIn` já tipado como string
};

export function signToken(payload: object): string {
  return jwt.sign(payload, secret, jwtOptions);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, secret) as T;
}
