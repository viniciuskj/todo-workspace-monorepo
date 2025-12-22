import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userClient } from '../client/user-client';
import { UserRequest } from '@my-workspace/shared-dtos';

export function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRequest>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await userClient.createUser(formData);
      navigate('/login', {
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
      console.error('Erro ao criar conta:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Todo App</h1>
          <h2 className="text-2xl font-semibold text-slate-300">Criar nova conta</h2>
          <p className="mt-2 text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Faça login
            </Link>
          </p>
        </div>

        <div className="bg-slate-800 py-8 px-6 shadow-lg rounded-lg border border-slate-700">
          {error && (
            <div className="mb-4 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={1}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
                placeholder="Mínimo 3 caracteres"
              />
              <p className="mt-1 text-xs text-slate-400">
                A senha deve ter no mínimo 3 caracteres
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
