// src/services/taskApi.ts
import api from './auth'; // importa o axios já configurado com baseURL


export const getTarefas = () => api.get('/tasks');
export const criarTarefa = (data: { titulo: string; status: string }) =>
  api.post('/tasks', data);
gi