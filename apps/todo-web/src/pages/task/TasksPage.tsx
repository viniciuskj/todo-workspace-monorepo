import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { taskClient } from '../../client/task-client';
import { TaskRequest, TaskResponse } from '@my-workspace/shared-dtos';
import { TaskForm } from '../../components/TaskForm';
import { TaskCard } from '../../components/TaskCard';
import { Modal } from '../../components/Modal';
import { SubTaskManager } from '../../components/SubTaskManager';

export function TasksPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [taskForSubTasks, setTaskForSubTasks] = useState<TaskResponse | null>(
    null
  );
  const [isSubTaskManagerOpen, setIsSubTaskManagerOpen] = useState(false);

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
      setSelectedTask(null);
      setIsModalOpen(false);
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
      setIsModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task: TaskResponse) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
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

  const handleManageSubTasks = (task: TaskResponse) => {
    setTaskForSubTasks(task);
    setIsSubTaskManagerOpen(true);
  };

  const handleCloseSubTaskManager = () => {
    setIsSubTaskManagerOpen(false);
    setTaskForSubTasks(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Minhas Tarefas</h1>
          <p className="text-slate-400 mt-1">
            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''} •{' '}
            {completedCount} concluída{completedCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/profile"
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            Meu Perfil
          </Link>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            Criar Task
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Lista de Tarefas
          </h2>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50"
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
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Concluídas ({completedCount})
          </button>
        </div>

        {loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-400">Carregando tarefas...</p>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {filter === 'all'
                ? 'Nenhuma tarefa criada ainda.'
                : filter === 'pending'
                ? 'Nenhuma tarefa pendente.'
                : 'Nenhuma tarefa concluída.'}
            </p>
            <p className="text-slate-500 text-sm mt-2">
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
                onEdit={handleEditClick}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onManageSubTasks={handleManageSubTasks}
                disabled={loading}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <TaskForm
          key={selectedTask?.identifier || 'new'}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          initialData={selectedTask || undefined}
          submitLabel={selectedTask ? 'Atualizar' : 'Criar Tarefa'}
          disabled={loading}
        />
      </Modal>

      {taskForSubTasks && (
        <SubTaskManager
          task={taskForSubTasks}
          isOpen={isSubTaskManagerOpen}
          onClose={handleCloseSubTaskManager}
        />
      )}
    </div>
  );
}
