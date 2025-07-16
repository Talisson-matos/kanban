import type { Request, Response } from 'express'
import { pool } from '../config/database.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// ⬇️ Interface para permitir acesso a req.file (vindo do multer)
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

// ⬇️ Cria diretório de uploads (se ainda não existir)
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// ⬇️ Configura onde salvar os arquivos e com que nome
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// ⬇️ Middleware multer configurado e exportado
export const upload = multer({ storage })

// ⬇️ Rota para criar nova tarefa com upload

export const createTask = async (req: MulterRequest, res: Response) => {
  try {
    const { title, description, isChecked, status } = req.body;
    const file = req.file;
    const urgent = isChecked === 'true' ? 1 : 0;
    const userId = (req as any).user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }

    const filePath = file?.filename ?? null;

    await pool.query(
      'INSERT INTO tasks (title, description, urgent, file_path, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, urgent, filePath, status, userId]
    );

    // ⬅️ Aqui o ajuste
    const [tasksDoUsuario] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );

    res.json(tasksDoUsuario); // ⬅️ Retorna só as tarefas do usuário
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro interno ao criar tarefa.' });
  }
};

// ⬇️ Rota para buscar todas as tarefas
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = (req as any).user.id; // 🔐 ID obtido do token JWT

    const [tarefasDoUsuario] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [usuarioId]
    );

    res.json(tarefasDoUsuario);
  } catch (err) {
    console.error('❌ Erro ao buscar tarefas do usuário:', err);
    res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
}


// rota de atualização

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, isChecked } = req.body;
  const urgent = isChecked === 'true' || isChecked === true ? 1 : 0;
  const userId = (req as any).user.id;

  try {
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, urgent = ? WHERE id = ? AND user_id = ?',
      [title, description, urgent, id, userId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para editar esta tarefa.' });
    }

    const [tasksDoUsuario] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );

    res.status(200).json(tasksDoUsuario);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar tarefa.' });
  }
};


// deletar tarefa

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa.' });
    }

    const [tasksDoUsuario] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );

    res.status(200).json(tasksDoUsuario);
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ message: 'Erro interno ao excluir tarefa.' });
  }
};


// ⬇️ Nova rota para download de arquivos
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.file
    const filePath = path.join(process.cwd(), 'uploads', fileName)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' })
    }
    res.download(filePath, fileName)
  } catch (err) {
    console.error('Erro ao baixar arquivo:', err)
    res.status(500).json({ message: 'Erro interno ao baixar arquivo' })
  }
}


// rota de controle para status

export const updateStatus = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  const userId = (req as any).user.id;

  const validStatus = ['a_fazer', 'fazendo', 'feito'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  try {
    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

    // 🔁 Após atualizar, buscar tarefas filtradas por usuário
    const [tasksDoUsuario] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );

    res.status(200).json(tasksDoUsuario);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar status.' });
  }
};
