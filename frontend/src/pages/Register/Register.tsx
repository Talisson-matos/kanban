import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import './Register.css'

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
      setUsuario('');
      setSenha('');
      setConfirmar('');
      
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
    <div className="container_register">
      <form onSubmit={onSubmit} className='form_register'>
        <h2 className='title_register'>Register</h2>
        <div className="input_group_register">
          <input placeholder=" " onChange={e => setUsuario(e.target.value)} />
          <label htmlFor="">Usuario</label>
        </div>
        <div className="input_group_register">
          <input type="password" maxLength={8} placeholder=" " value={senha} onChange={e => setSenha(e.target.value)} />
          <label htmlFor="">Senha</label>
        </div>
        <div className="input_group_register">
          <input type="password" maxLength={8} placeholder=" " value={confirmar} onChange={e => setConfirmar(e.target.value)} />
          <label htmlFor="">Confirmar senha</label>
        </div>
        <button className='btn_register' type="submit">Registrar</button>
      </form>
    </div>
  );
}
