import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import './Login.css'

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
    setUsuario('');
    setSenha('');
  }
  };

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <div className="container_login">
      <form onSubmit={onSubmit} className='form_login'>
        <h2 className='title_login'>Kanban</h2>
        <div className="input_group_login">
          <input  placeholder=' ' value={usuario} onChange={e => setUsuario(e.target.value)} />
          <label htmlFor="">usuario</label>
        </div>
        <div className="input_group_login">
          <input type="password" placeholder=' ' value={senha} maxLength={8}  onChange={e => setSenha(e.target.value)} />
          <label htmlFor="">senha</label>
        </div>
        <div className="group_button_login">
          <button type="submit">Entrar</button>
          <button type="button" onClick={handleRegister}>Cadastrar</button>
        </div>

      </form>
    </div>
  );
}
