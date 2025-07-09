import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Kanban() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const [tasks, setTasks] = useState([]);



  // remontar tasks ao recarregar pagina //

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/tasks');
        console.log(res) // Ajuste a URL pro seu backend
        setTasks(res.data); // Supondo que o backend retorna um array de tarefas
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
      }
    };

    fetchTasks();
  }, []);


  // calcular pendencia

  const calcularTempoDecorrido = (createdAt: string): string => {
  const criado = new Date(createdAt);
  const agora = new Date();

  const diffMs = agora.getTime() - criado.getTime(); // diferença em milissegundos
  const diffMin = Math.floor(diffMs / 60000); // convertendo pra minutos

  if (diffMin < 1) return 'menos de 1 min';
  if (diffMin < 60) return `${diffMin} min`;
  const horas = Math.floor(diffMin / 60);
  const minutos = diffMin % 60;
  return `${horas}h ${minutos}min`;
};






  const handleSubmit = async (e: React.FormEvent) => {

   

    e.preventDefault();
    const res = await axios.post('http://localhost:3000/api/tasks', { title, description, isChecked });
    setTasks(res.data);
    setDescription('');
    setTitle('');
  };




  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nova tarefa" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Adicione descrição" />
        <input type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {tasks.map((task: any) => (
          <nav key={task.id}>
            <li >{task.title}</li>
            <li >{task.description}</li>
            <li>{task.urgent}</li>
            <li>
  {task.created_at &&     (() => {
      const data = new Date(task.created_at);

      const hora = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const diaMes = data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
      });

      return `${hora} - ${diaMes}`;
    })()}
</li>

<li>
  Pendência: {task.created_at && calcularTempoDecorrido(task.created_at)}
</li>

          </nav>

        ))}
      </ul>
    </div>
  );
}
