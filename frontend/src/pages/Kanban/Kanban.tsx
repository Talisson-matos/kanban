
import  { useState, useEffect } from 'react'
import axios from 'axios';
import type { ChangeEvent, FormEvent } from 'react'


interface Task {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  created_at: string;
  file_path: string | null;
}

export default function Kanban() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);  
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Busca tarefas ao montar o componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get<Task[]>(
          'http://localhost:3000/api/tasks'
        );
        setTasks(res.data);
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
      }
    };
    fetchTasks();
  }, []);

  // Função para calcular tempo decorrido
  const calcularTempoDecorrido = (createdAt: string): string => {
    const criado = new Date(createdAt);
    const agora = new Date();

    const diffMs = agora.getTime() - criado.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'menos de 1 min';
    if (diffMin < 60) return `${diffMin} min`;

    const horas = Math.floor(diffMin / 60);
    const minutos = diffMin % 60;
    return `${horas}h ${minutos}min`;
  };

  // Captura o arquivo selecionado
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  // Envia formulário usando multipart/form-data
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log(isChecked)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isChecked', String(isChecked));
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await axios.post<Task[]>(
        'http://localhost:3000/api/tasks',
        formData,
       
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTasks(res.data);
      setTitle('');
      setDescription('');
      setIsChecked(false);
      setFile(null);
    } catch (err) {
      console.error('Erro ao enviar tarefa:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nova tarefa"
        />

        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Adicione descrição"
        />

        <label>
          Urgente?
          <input
            type="checkbox"
            checked={isChecked}
            onChange={e =>
              setIsChecked(e.target.checked)
            }
          />
        </label>

        <input
          type="file"
          onChange={handleFileChange}
        />

        {file && <p>Arquivo: {file.name}</p>}

        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> —{' '}
            {task.description} — Urgente:{' '}
            {task.urgent ? 'Sim' : 'Não'}<br />

            Criado em:{' '}
            {new Date(task.created_at).toLocaleString(
              'pt-BR',
              {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              }
            )}{' '}
            | Pendência:{' '}
            {calcularTempoDecorrido(task.created_at)}
            {task.file_path && (
  <a
    href={`http://localhost:3000/uploads/${task.file_path}`}
    target="_blank"
    rel="noopener noreferrer"
    download
  >
    📄 Baixar arquivo
  </a>
)}
          </li>
        ))}
      </ul>
    </div>
  );
}
