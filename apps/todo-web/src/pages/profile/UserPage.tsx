import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userClient } from '../../client/user-client';
import { UserRequest, UserResponse } from '@my-workspace/shared-dtos';
import { UserForm } from '../../components/UserForm';
import { decodeJWT } from '../../utils/jwt';
import { TOKEN_KEY } from '../../client/api-client';

export function UserPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoadingUser(true);
    setError(null);
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.identifier) {
        throw new Error('Token inválido');
      }

      const userData = await userClient.getUser(decoded.identifier);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dados do usuário');
      console.error('Erro ao carregar usuário:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleUpdateUser = async (userRequest: UserRequest) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userClient.updateUser(user.identifier, userRequest);
      setUser(updatedUser);
      
      if (userRequest.email !== user.email) {
        alert('Email alterado com sucesso! Faça login novamente.');
        logout();
        navigate('/login');
      } else {
        alert('Perfil atualizado com sucesso!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
      console.error('Erro ao atualizar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-4">Erro ao carregar dados do usuário</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Meu Perfil</h1>
          <p className="text-slate-400 mt-1">Gerencie suas informações pessoais</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-300 underline text-sm mt-1"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          Informações do Perfil
        </h2>

        <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Criado em</p>
              <p className="text-slate-200">
                {new Date(user.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
            {user.updatedAt && (
              <div>
                <p className="text-slate-400 mb-1">Atualizado em</p>
                <p className="text-slate-200">
                  {new Date(user.updatedAt).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        <UserForm
          onSubmit={handleUpdateUser}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          submitLabel="Atualizar Perfil"
          isEditMode={true}
        />
      </div>
    </div>
  );
}

