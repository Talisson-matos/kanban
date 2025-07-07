import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

export function Register() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !senha || !confirmar) {
    alert('Preencha todos os campos!');
    console.warn('🚫 Registro cancelado: campos em branco.');
    return;
  }

  if (senha !== confirmar) {
    alert('As senhas não coincidem!');
    console.warn('🚫 Registro cancelado: senhas diferentes.');
    return;
  }

  try {
    console.log('📤 Enviando dados de registro via Axios:', { usuario, senha, confirmar });
    const res = await register({ usuario, senha, confirmarSenha: confirmar });
    console.log('✅ Registro concluído:', res.data);
    nav('/');
  } catch (err) {
    console.error('❌ Erro ao registrar:', err);
    alert('Erro ao registrar. Verifique os dados e tente novamente.');
  }
  };

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Usuário" onChange={e => setUsuario(e.target.value)} />
      <input type="password" maxLength={8} placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <input type="password" maxLength={8} placeholder="Confirmar Senha" onChange={e => setConfirmar(e.target.value)} />
      <button type="submit">Registrar</button>
    </form>
  );
}
