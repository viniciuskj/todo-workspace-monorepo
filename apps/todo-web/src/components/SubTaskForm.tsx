import { useState, useEffect } from 'react';
import { SubTaskRequest, SubTaskResponse } from '@my-workspace/shared-dtos';

interface SubTaskFormProps {
  taskIdentifier: string;
  onSubmit: (subTask: SubTaskRequest) => Promise<void>;
  initialData?: SubTaskResponse;
  submitLabel?: string;
  disabled?: boolean;
}

export function SubTaskForm({
  taskIdentifier,
  onSubmit,
  initialData,
  submitLabel = 'Criar',
  disabled = false,
}: SubTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCompleted(initialData.completed);
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const subTaskRequest: SubTaskRequest = {
      title: title.trim(),
      description: description.trim(),
      completed,
      taskIdentifier,
    };

    await onSubmit(subTaskRequest);

    if (!initialData) {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="subtask-title"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Título da Subtarefa
        </label>
        <input
          id="subtask-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          placeholder="Digite o título da subtarefa"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-800 disabled:cursor-not-allowed placeholder:text-slate-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="subtask-description"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Descrição
        </label>
        <textarea
          id="subtask-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={disabled}
          placeholder="Digite a descrição da subtarefa"
          rows={3}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-800 disabled:cursor-not-allowed placeholder:text-slate-500"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="subtask-completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700 disabled:cursor-not-allowed"
        />
        <label htmlFor="subtask-completed" className="ml-2 block text-sm text-slate-300">
          Marcar como concluída
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Processando...' : submitLabel}
      </button>
    </form>
  );
}
