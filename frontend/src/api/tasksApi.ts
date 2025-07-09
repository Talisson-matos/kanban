import api from './auth'; // importa o axios já configurado com baseURL

export const getTarefas = () => api.get('/tasks');

export type Status = 'afazer' | 'fazendo' | 'feito';

export const criarTarefa = (data: { title: string, description: string, isChecked: boolean, status: Status }) =>
  api.post('/tasks', data);

