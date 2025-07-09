import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, isChecked, status = 'afazer'} = req.body;
    console.log('💡 Corpo recebido no backend:', req.body);
    if (!title) {
      return res.status(400).json({ message: 'O título da tarefa é obrigatório.' });
    }
    if (!description) {
      return res.status(400).json({ message: 'A descrição da tarefa é obrigatorio.' });
    }

    await pool.query('INSERT INTO tasks (title, description, urgent, status) VALUES (?,?,?,?)', [title,description,isChecked,status]);
    
    const [tasks] = await pool.query('SELECT * FROM tasks');
    
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro interno ao criar tarefa.' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

