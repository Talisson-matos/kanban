import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export async function listarTarefas(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('💥 Erro ao buscar tarefas:', err);
    res.status(500).json({ message: 'Erro interno ao buscar tarefas' });
  }
}

export async function criarTarefa(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { titulo, status } = req.body;

    if (!titulo || !status) {
      return res.status(400).json({ message: 'Título e status obrigatórios.' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (titulo, status, user_id) VALUES (?, ?, ?)',
      [titulo, status, userId]
    );

    res.status(201).json({
      id: (result as any).insertId,
      titulo,
      status
    });
  } catch (err) {
    console.error('💥 Erro ao criar tarefa:', err);
    res.status(500).json({ message: 'Erro ao salvar tarefa' });
  }
}
