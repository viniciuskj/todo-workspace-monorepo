import { UserResponse } from '@my-workspace/shared-dtos';

interface UserCardProps {
  user: UserResponse;
  onEdit?: (user: UserResponse) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Editar
          </button>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium text-gray-700">ID:</span>{' '}
          <span className="text-gray-600 font-mono text-xs">{user.identifier}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Nome:</span>{' '}
          <span className="text-gray-600">{user.name}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Email:</span>{' '}
          <span className="text-gray-600">{user.email}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Criado em:</span>{' '}
          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Atualizado em:</span>{' '}
          <span className="text-gray-600">{formatDate(user.updatedAt)}</span>
        </p>
      </div>
    </div>
  );
}