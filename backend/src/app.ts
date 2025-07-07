import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/tasksRoutes.js';

dotenv.config();

const app = express();

// Log de inicialização
console.log('🔧 Inicializando servidor...');

// Middleware CORS
app.use(cors());
console.log('✅ Middleware de CORS ativado.');

app.use('/api/tasks', taskRoutes);
console.log('✅ Rotas /api/tasks carregadas.');

// Middleware JSON
app.use(express.json());
console.log('✅ Middleware express.json ativado.');

// Log de todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`📩 Requisição recebida: [${req.method}] ${req.url}`);
  if (req.method === 'POST') {
    console.log('📦 Corpo da requisição:', req.body);
  }
  next();
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);
console.log('✅ Rotas /api/auth carregadas.');

// Rota principal
app.get('/', (req, res) => {
  console.log('🌐 Acessaram a rota raiz "/"');
  res.send('servidor rodando com sucesso');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));
