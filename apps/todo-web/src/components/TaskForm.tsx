import { useState, useEffect } from 'react';
import { TaskRequest, TaskResponse } from '@my-workspace/shared-dtos';

interface TaskFormProps {
  onSubmit: (task: TaskRequest) => Promise<void>;
  initialData?: TaskResponse;
  submitLabel?: string;
  disabled?: boolean;
}

export function TaskForm({
  onSubmit,
  initialData,
  submitLabel = 'Criar',
  disabled = false,
}: TaskFormProps) {
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

    const taskRequest: TaskRequest = {
      title: title.trim(),
      description: description.trim(),
      completed,
    };

    await onSubmit(taskRequest);

    if (!initialData) {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          placeholder="Digite o título da tarefa"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={disabled}
          placeholder="Digite a descrição da tarefa"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
          Marcar como concluída
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Processando...' : submitLabel}
      </button>
    </form>
  );
}
