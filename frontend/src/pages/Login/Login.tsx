import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const res = await login({ usuario, senha });
    console.log('Token recebido:', res.data.token);
    localStorage.setItem('token', res.data.token);
    navigate('/kanban');
  } catch (err) {
    console.error('Erro no login:', err);
    alert('Falha no login. Verifique suas credenciais.');
  }
  };

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Usuário" onChange={e => setUsuario(e.target.value)} />
      <input type="password" maxLength={8} placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <button type="submit">Entrar</button>
      <button type="button" onClick={handleRegister}>Cadastrar</button>
    </form>
  );
}
