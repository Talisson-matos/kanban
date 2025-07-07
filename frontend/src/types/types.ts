export interface Tarefa {
  id: number;
  titulo: string;
  status: 'todo' | 'doing' | 'done';
}
