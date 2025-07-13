// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth' // 🔗 Ajuste essa URL em produção!
});

// 🛡️ Interceptor para enviar o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // ou sessionStorage, ou contexto
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token enviado na requisição:', token); // ✅ Log aqui
  } else {
    console.warn('⚠️ Nenhum token encontrado. Requisição sem autorização.');
  }
  return config;
}, error => {
  return Promise.reject(error);
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
