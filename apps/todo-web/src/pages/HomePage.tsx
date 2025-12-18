import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserForm } from '../components/UserForm';
import { UserCard } from '../components/UserCard';
import { userClient } from '../client/user-client';
import { UserRequest, UserResponse } from '@my-workspace/shared-dtos';

export function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userIdentifierInput, setUserIdentifierInput] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResponse = await userClient.getUsers();
      setUsers(usersResponse);
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (userRequest: UserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userClient.createUser(userRequest);
      setUsers((prev) => [...prev, newUser]);
      alert('Usuário criado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
      console.error('Erro ao criar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userRequest: UserRequest) => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userClient.updateUser(
        selectedUser.identifier,
        userRequest
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.identifier === updatedUser.identifier ? updatedUser : u
        )
      );
      setSelectedUser(null);
      alert('Usuário atualizado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar usuário');
      console.error('Erro ao atualizar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadUser = async () => {
    if (!userIdentifierInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const user = await userClient.getUser(userIdentifierInput.trim());
      setUsers((prev) => {
        const exists = prev.find((u) => u.identifier === user.identifier);
        return exists ? prev : [...prev, user];
      });
      setUserIdentifierInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar usuário');
      console.error('Erro ao carregar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersResponse = await userClient.getUsers();
      setUsers(usersResponse);
      setUserIdentifierInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao listar usuários');
      console.error('Erro ao listar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Todo App - Gerenciamento de Usuários
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Sair
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
          </h2>
          <UserForm
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            initialData={selectedUser || undefined}
            submitLabel={selectedUser ? 'Atualizar Usuário' : 'Criar Usuário'}
          />
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuários</h2>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Digite o ID do usuário"
              value={userIdentifierInput}
              onChange={(e) => setUserIdentifierInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLoadUser();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleLoadUser}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors"
            >
              Carregar
            </button>
            <button
              onClick={handleGetUsers}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors"
            >
              Listar Usuários
            </button>
          </div>

          {loading && (
            <p className="text-gray-600 text-center py-4">Carregando...</p>
          )}

          {users.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Nenhum usuário carregado. Crie um novo ou carregue um existente.
            </p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {users.map((user) => (
                <UserCard
                  key={user.identifier}
                  user={user}
                  onEdit={setSelectedUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
