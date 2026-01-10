import { SubTaskResponse } from '@my-workspace/shared-dtos';

interface SubTaskCardProps {
  subTask: SubTaskResponse;
  onEdit: (subTask: SubTaskResponse) => void;
  onToggleComplete: (subTask: SubTaskResponse) => void;
  onDelete: (subTask: SubTaskResponse) => void;
  disabled?: boolean;
}

export function SubTaskCard({
  subTask,
  onEdit,
  onDelete,
  onToggleComplete,
  disabled = false,
}: SubTaskCardProps) {
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
      className={`p-3 border rounded-md transition-all ${
        subTask.completed
          ? 'bg-green-800 border-green-600'
          : 'bg-slate-600 border-slate-500 hover:border-blue-400'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <button
            onClick={() => onToggleComplete(subTask)}
            disabled={disabled}
            className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
              subTask.completed
                ? 'bg-green-500 border-green-500'
                : 'border-slate-400 hover:border-green-500'
            }`}
          >
            {subTask.completed && (
              <svg
                className="w-3 h-3 text-white"
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
            <h4
              className={`text-sm font-medium mb-0.5 ${
                subTask.completed ? 'text-slate-400 line-through' : 'text-slate-100'
              }`}
            >
              {subTask.title}
            </h4>
            <p
              className={`text-xs mb-1 ${
                subTask.completed ? 'text-slate-500' : 'text-slate-300'
              }`}
            >
              {subTask.description}
            </p>
            <div className="flex gap-3 text-xs text-slate-400">
              <span>Criada: {formatDate(subTask.createdAt)}</span>
              {subTask.updatedAt &&
                new Date(subTask.updatedAt).getTime() !==
                  new Date(subTask.createdAt).getTime() && (
                  <span>Atualizada: {formatDate(subTask.updatedAt)}</span>
                )}
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(subTask)}
            disabled={disabled}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(subTask)}
            disabled={disabled}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
