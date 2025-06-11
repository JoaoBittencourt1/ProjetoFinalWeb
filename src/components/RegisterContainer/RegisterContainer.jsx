import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterContainer.css';

export default function RegisterContainer() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dataNascimento: '',
    foto: null,
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFirstStepSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', form.name); // nome do campo no backend
      formData.append('email', form.email);
      formData.append('senha', form.password); // senha em texto plano
      formData.append('dataNascimento', form.dataNascimento);
      if (form.foto) formData.append('foto', form.foto);

      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar usuário');
      }

      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (error) {
      setError(error.message);
      console.error('Erro:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="box">
        {step === 1 ? (
          <>
            <h2>Criar Conta</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleFirstStepSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <div className="senha-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="senha-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="register-button">
                Próxima Etapa
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => navigate('/login')}
              >
                Voltar para Login
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Dados Adicionais</h2>
            {error && <div className="error-message">{error}</div>}
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="profile-preview" />
              </div>
            )}
            <form onSubmit={handleFinalSubmit}>
              <div className="form-group">
                <label htmlFor="dataNascimento">Data de Nascimento</label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="foto">Foto de Perfil</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="register-button">
                Finalizar Cadastro
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
