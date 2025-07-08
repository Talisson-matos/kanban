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
        <input  type="checkbox"  checked={isChecked}  onChange={e => setIsChecked(e.target.checked)}/>
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {tasks.map((task: any) => (
          <nav key={task.id}>
            <li >{task.title}</li>
            <li >{task.description}</li>
            <li>{task.urgent}</li>
          </nav>
          
        ))}
      </ul>
    </div>
  );
}
