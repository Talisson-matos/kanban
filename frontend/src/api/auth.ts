// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth' // 🔗 Ajuste essa URL em produção!
});

// 📝 Registro de novo usuário
export const register = (data: {
  usuario: string;
  senha: string;
  confirmarSenha: string;
}) => api.post('/register', data);

// 🔐 Login de usuário
export const login = (data: {
  usuario: string;
  senha: string;
}) => api.post('/login', data);

export default api;


