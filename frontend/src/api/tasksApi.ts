import api from './auth'; // importa o axios já configurado com baseURL

export const getTarefas = () => api.get('/tasks');


export const criarTarefa = (formData: FormData) =>
  api.post('/tasks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

