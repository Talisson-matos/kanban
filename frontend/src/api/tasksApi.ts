// src/services/taskApi.ts
import api from './auth'; // importa o axios já configurado com baseURL

export const getTarefas = () => api.get('/tasks');

export const criarTarefa = (data: { title: string, description: string, isChecked: boolean }) =>
  api.post('/tasks', data);
