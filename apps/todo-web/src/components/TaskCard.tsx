import { TaskResponse } from '@my-workspace/shared-dtos';

interface TaskCardProps {
  task: TaskResponse;
  onEdit: (task: TaskResponse) => void;
  onToggleComplete: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
  disabled?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  disabled = false,
}: TaskCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        task.completed
          ? 'bg-green-50 border-green-300'
          : 'bg-white border-gray-300 hover:border-blue-400'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleComplete(task)}
            disabled={disabled}
            className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>

          <div className="flex-1">
            <h3
              className={`text-lg font-semibold mb-1 ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {task.title}
            </h3>
            <p
              className={`text-sm mb-2 ${
                task.completed ? 'text-gray-500' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Criada: {formatDate(task.createdAt)}</span>
              {task.updatedAt &&
                new Date(task.updatedAt).getTime() !==
                  new Date(task.createdAt).getTime() && (
                  <span>Atualizada: {formatDate(task.updatedAt)}</span>
                )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onEdit(task)}
          disabled={disabled}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(task)}
          disabled={disabled}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
