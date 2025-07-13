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
    const { title, description, isChecked } = req.body
    const file = req.file
    const urgent = isChecked === 'true' ? 1 : 0;
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' })
    }

    const filePath = file?.filename ?? null // Armazena só o nome, não o path completo

    await pool.query(
      'INSERT INTO tasks (title, description, urgent, file_path) VALUES (?, ?, ?, ?)',
      [title, description, urgent, filePath]
    )

    const [tasks] = await pool.query('SELECT * FROM tasks')
    res.json(tasks)
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    res.status(500).json({ message: 'Erro interno ao criar tarefa.' })
  }
}

// ⬇️ Rota para buscar todas as tarefas
export const getTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao buscar tarefas' })
  }
}

// rota de atualização

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, isChecked } = req.body;
  const urgent = isChecked === 'true' || isChecked === true ? 1 : 0;

  try {
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, urgent = ? WHERE id = ?',
      [title, description, urgent, id]
    );
    res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar tarefa.' });
  }
};


// deletar tarefa

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
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