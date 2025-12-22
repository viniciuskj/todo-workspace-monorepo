import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { taskClient } from '../../client/task-client';
import { TaskRequest, TaskResponse } from '@my-workspace/shared-dtos';
import { TaskForm } from '../../components/TaskForm';
import { TaskCard } from '../../components/TaskCard';

export function TasksPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksResponse = await taskClient.getTasks();
      setTasks(tasksResponse);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar tarefas');
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskRequest: TaskRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskClient.createTask(taskRequest);
      setTasks((prev) => [newTask, ...prev]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar tarefa');
      console.error('Erro ao criar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskRequest: TaskRequest) => {
    if (!selectedTask) return;

    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskClient.updateTask(
        selectedTask.identifier,
        taskRequest
      );
      setTasks((prev) =>
        prev.map((t) =>
          t.identifier === updatedTask.identifier ? updatedTask : t
        )
      );
      setSelectedTask(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: TaskResponse) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskClient.updateTask(task.identifier, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.identifier === updatedTask.identifier ? updatedTask : t
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (task: TaskResponse) => {
    if (!task.identifier) {
      setError('Erro: task sem identifier');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await taskClient.delete(task.identifier);
      setTasks((prev) => prev.filter((t) => t.identifier !== task.identifier));
      if (selectedTask?.identifier === task.identifier) {
        setSelectedTask(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir tarefa');
      console.error('Erro ao excluir tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
          <p className="text-gray-600 mt-1">
            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''} •{' '}
            {completedCount} concluída{completedCount !== 1 ? 's' : ''}
          </p>
        </div>
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
          <button
            onClick={() => setError(null)}
            className="text-red-700 underline text-sm mt-1"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <TaskForm
              onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
              initialData={selectedTask || undefined}
              submitLabel={selectedTask ? 'Atualizar' : 'Criar Tarefa'}
              disabled={loading}
            />
            {selectedTask && (
              <button
                onClick={() => setSelectedTask(null)}
                disabled={loading}
                className="mt-4 w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Lista de Tarefas
              </h2>
              <button
                onClick={loadTasks}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Atualizar
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pendentes ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Concluídas ({completedCount})
              </button>
            </div>

            {loading && tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando tarefas...</p>
              </div>
            )}

            {!loading && filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {filter === 'all'
                    ? 'Nenhuma tarefa criada ainda.'
                    : filter === 'pending'
                    ? 'Nenhuma tarefa pendente.'
                    : 'Nenhuma tarefa concluída.'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {filter === 'all' && 'Crie sua primeira tarefa para começar!'}
                </p>
              </div>
            )}

            {filteredTasks.length > 0 && (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.identifier}
                    task={task}
                    onEdit={setSelectedTask}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    disabled={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
