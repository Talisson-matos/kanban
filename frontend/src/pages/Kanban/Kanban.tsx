import { useState, useEffect } from 'react'
import axios from 'axios';
import type { ChangeEvent, FormEvent } from 'react';
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'

interface Task {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  created_at: string;
  file_path: string | null;
  status: string;
}

interface Props {
  task: Task;
  handleDelete: (id: number) => void;
  abrirModalDeEdicao: (task: Task) => void;


}


const baixarArquivo = async (fileName: string) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/download/${fileName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      responseType: 'blob',
    });

    const mimeType = res.headers['content-type'];
    const blob = new Blob([res.data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    // 👇 Abrir diretamente se for visualizável
    if (mimeType.startsWith('image/') || mimeType === 'application/pdf' || mimeType.startsWith('text/')) {
      window.open(url, '_blank');
    } else {
      // 📁 Se não der pra visualizar direto, força download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  } catch (err) {
    console.error('Erro ao baixar:', err);
  }
};



// Função utilitária — certifique-se de que está fora de qualquer componente
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

export function TarefaDraggable({
  task,
  handleDelete,
  abrirModalDeEdicao
}: {
  task: Task;
  handleDelete: (id: number) => void;
  abrirModalDeEdicao: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: String(task.id)
  });

  return (
    <div
      ref={setNodeRef}
      className="task-card bg-white p-4 rounded shadow-md flex flex-col gap-2"
    >
      {/* Handle de arrasto */}
      <div
        {...listeners}
        {...attributes}
        className="drag-handle cursor-grab p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
        title="Arraste aqui para mover a tarefa"
      >
        <span className="text-gray-600">↔️ Mover</span>
      </div>

      {/* Conteúdo da tarefa */}
      <div className="task-content">
        <div className="font-bold">{task.title}</div>
        <div>{task.description}</div>
        <div>Urgente: {task.urgent ? 'Sim' : 'Não'}</div>
        <div>
          Criado em:{' '}
          {new Date(task.created_at).toLocaleString('pt-BR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div>Pendência: {calcularTempoDecorrido(task.created_at)}</div>

        {task.file_path && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              baixarArquivo(task.file_path!);

            }}
            className="text-blue-500 underline"
          >
            📄 Baixar arquivo
          </button>

        )}
      </div>

      {/* Botões de ação */}
      <div className="task-actions flex gap-2 mt-2">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(task.id);
          }}
        >
          🗑️ Deletar
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            abrirModalDeEdicao(task);
          }}
        >
          ✏️ Editar
        </button>
      </div>
    </div>
  );
}


function ColunaDroppable({
  id,
  tarefas,
  handleDelete,
  abrirModalDeEdicao
}: {
  id: string;
  tarefas: Task[];
  handleDelete: (id: number) => void;
  abrirModalDeEdicao: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={{ padding: 10, border: '1px dashed black', minWidth: 250 }}>
      <h3>{id}</h3>
      {tarefas.map(task => (
        <TarefaDraggable
          key={task.id}
          task={task}
          handleDelete={handleDelete}
          abrirModalDeEdicao={abrirModalDeEdicao}
        />
      ))}
    </div>
  );
}

export default function Kanban() {
  // Estados para o formulário de criação
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('a_fazer');

  // Estados para as tarefas
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estados para o modal de edição
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editIsChecked, setEditIsChecked] = useState<boolean>(false);

  // modal
  const abrirModalDeEdicao = (task: Task) => {
    setTaskToEdit(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditIsChecked(Boolean(task.urgent));
    setIsEditing(true);
  };

  // atualizar
  const atualizarTarefa = async () => {
    if (!taskToEdit) return;

    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${taskToEdit.id}`,
        {
          title: editTitle,
          description: editDescription,
          isChecked: editIsChecked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Buscar tarefas atualizadas após edição
      const res = await axios.get<Task[]>('http://localhost:3000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTasks(res.data);
      setIsEditing(false);
      setTaskToEdit(null);
      // Limpar os campos de edição
      setEditTitle('');
      setEditDescription('');
      setEditIsChecked(false);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  // Busca tarefas ao montar o componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get<Task[]>(
          'http://localhost:3000/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
        );
        setTasks(res.data);
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
      }
    };
    fetchTasks();
  }, []);

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
    formData.append('status', status);
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
            Authorization: `Bearer ${localStorage.getItem('token')}`
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

  // deleção
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Atualiza a lista após deletar
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
    }
  };

  // status
  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = parseInt(active.id as string);
    const novoStatus = over.id as string;
    const token = localStorage.getItem('token');

    // Atualizar estado local imediatamente
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: novoStatus }
        : task
    ));

    try {
      await axios.post(
        'http://localhost:3000/api/tasks/update-status',
        {
          id: taskId,
          status: novoStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      // Reverter se der erro
      const res = await axios.get<Task[]>('http://localhost:3000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(res.data);
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

      {isEditing && (
        <div style={{ background: '#eee', padding: '1rem', marginTop: '1rem' }}>
          <h3>Editar Tarefa</h3>

          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Título"
          />

          <input
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            placeholder="Descrição"
          />

          <label>
            Urgente?
            <input
              type="checkbox"
              checked={editIsChecked}
              onChange={e => setEditIsChecked(e.target.checked)}
            />
          </label>

          <button onClick={atualizarTarefa}>Salvar alterações</button>
          <button onClick={() => {
            setIsEditing(false);
            setEditTitle('');
            setEditDescription('');
            setEditIsChecked(false);
            setTaskToEdit(null);
          }}>Cancelar</button>
        </div>
      )}

      <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
        <div style={{ display: 'flex', gap: '2rem', cursor: 'grabbing' }}>
          {['a_fazer', 'fazendo', 'feito'].map(status => (
            <ColunaDroppable
              key={status}
              id={status}
              tarefas={tasks.filter(task => task.status === status)}
              handleDelete={handleDelete}
              abrirModalDeEdicao={abrirModalDeEdicao}

            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}