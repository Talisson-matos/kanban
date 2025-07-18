import { pool } from '../config/database.js'; // 👈 extensão .js obrigatória em ESModules
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js'; // 👈 extensão .js também aqui
export async function register(req, res) {
    try {
        const { usuario, senha, confirmarSenha } = req.body;
        console.log('📥 [register] Dados recebidos:', req.body);
        if (senha !== confirmarSenha) {
            console.warn('⚠️ Senhas não coincidem.');
            return res.status(400).json({ message: 'Senhas não conferem.' });
        }
        const [rows] = await pool.query('SELECT id FROM users WHERE user = ?', [usuario]);
        if (rows.length > 0) {
            console.warn('⚠️ Usuário já existe:', usuario);
            return res.status(400).json({ message: 'Usuário já existe.' });
        }
        const hash = await bcrypt.hash(senha, 10);
        await pool.query('INSERT INTO users (user,password) VALUES (?, ?)', [usuario, hash]);
        console.log('✅ Novo usuário registrado:', usuario);
        return res.status(201).json({ message: 'Registro efetuado.' });
    }
    catch (err) {
        console.error('💥 Erro no registro:', err);
        return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
    }
}
export async function login(req, res) {
    try {
        const { usuario, senha } = req.body;
        console.log('📥 [login] Tentando autenticar:', usuario);
        const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [usuario]);
        const user = rows[0];
        if (!user) {
            console.warn('❌ Usuário não encontrado:', usuario);
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }
        const isValid = await bcrypt.compare(senha, user.password);
        if (!isValid) {
            console.warn('❌ Senha inválida para o usuário:', usuario);
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const token = signToken({ id: user.id, usuario: user.usuario });
        console.log('🔐 Login bem-sucedido para:', usuario);
        return res.json({ token });
    }
    catch (err) {
        console.error('💥 Erro no login:', err);
        return res.status(500).json({ message: 'Erro interno ao autenticar.' });
    }
}
