import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/tasksRoutes.js';
import path from 'path';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', taskRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('📦 Corpo da requisição:', req.body);
  }
  next();
});

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {

  res.send('servidor rodando com sucesso');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));
