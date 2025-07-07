import  { useEffect, useState } from 'react';
import axios from '../../api/auth'; // <- use seu `axios.create(...)`
import './Kanban.css'; // se estiver estilizando

interface Tarefa {
  id: number;
  titulo: string;
  status: 'todo' | 'doing' | 'done';
}

const Kanban = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // 🔄 Busca tarefas quando o componente monta
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const res = await axios.get('/tasks'); // precisa do token no header
        setTarefas(res.data);
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
      }
    };

    fetchTarefas();
  }, []);

  // 📝 Função para adicionar nova tarefa
  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;
    try {
      const res = await axios.post('/tasks', {
        titulo: novaTarefa,
        status: 'todo'
      });
      setTarefas([...tarefas, res.data]); // renderiza nova tarefa
      setNovaTarefa('');
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
    }
  };

  return (
    <div className="kanban">
      <h2>Minhas Tarefas</h2>

      <div className="kanban-input">
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Nova tarefa"
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div className="kanban-board">
        {['todo', 'doing', 'done'].map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status.toUpperCase()}</h3>
            {tarefas
              .filter((t) => t.status === status)
              .map((t) => (
                <div key={t.id} className="kanban-card">
                  {t.titulo}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
