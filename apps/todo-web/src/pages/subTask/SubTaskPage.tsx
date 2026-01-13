import { useState, useEffect } from 'react';
import {
  SubTaskRequest,
  SubTaskResponse,
  TaskResponse,
} from '@my-workspace/shared-dtos';
import { subTaskClient } from '../../client/subtask-client';
import { SubTaskCard } from '../../components/SubTaskCard';
import { SubTaskForm } from '../../components/SubTaskForm';
import { Modal } from '../../components/Modal';

interface SubTaskPageProps {
  task: TaskResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function SubTaskPage({ task, isOpen, onClose }: SubTaskPageProps) {
  const [subTasks, setSubTasks] = useState<SubTaskResponse[]>([]);
  const [selectedSubTask, setSelectedSubTask] =
    useState<SubTaskResponse | null>(null);
  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSubTasks();
    }
  }, [isOpen, task.identifier]);

  const loadSubTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const taskSubTasks = await subTaskClient.getSubTasks(task.identifier);
      setSubTasks(taskSubTasks);
    } catch (err) {
      setError('Erro ao carregar subtarefas');
      console.error('Error loading subtasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubTask = async (subTaskRequest: SubTaskRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newSubTask = await subTaskClient.createSubTask(subTaskRequest);
      setSubTasks([...subTasks, newSubTask]);
      setIsSubTaskModalOpen(false);
    } catch (err) {
      setError('Erro ao criar subtarefa');
      console.error('Error creating subtask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubTask = async (subTaskRequest: SubTaskRequest) => {
    if (!selectedSubTask) return;

    try {
      setIsLoading(true);
      setError(null);
      const updatedSubTask = await subTaskClient.updateSubTask(
        selectedSubTask.identifier,
        subTaskRequest
      );
      setSubTasks(
        subTasks.map((st) =>
          st.identifier === updatedSubTask.identifier ? updatedSubTask : st
        )
      );
      setIsSubTaskModalOpen(false);
      setSelectedSubTask(null);
    } catch (err) {
      setError('Erro ao atualizar subtarefa');
      console.error('Error updating subtask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (subTask: SubTaskResponse) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSubTask = await subTaskClient.updateSubTask(
        subTask.identifier,
        {
          title: subTask.title,
          description: subTask.description,
          completed: !subTask.completed,
          taskIdentifier: task.identifier,
        }
      );
      setSubTasks(
        subTasks.map((st) =>
          st.identifier === updatedSubTask.identifier ? updatedSubTask : st
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status da subtarefa');
      console.error('Error toggling subtask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubTask = async (subTask: SubTaskResponse) => {
    if (!confirm('Tem certeza que deseja excluir esta subtarefa?')) return;

    try {
      setIsLoading(true);
      setError(null);
      await subTaskClient.delete(subTask.identifier);
      setSubTasks(
        subTasks.filter((st) => st.identifier !== subTask.identifier)
      );
    } catch (err) {
      setError('Erro ao excluir subtarefa');
      console.error('Error deleting subtask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubTask = (subTask: SubTaskResponse) => {
    setSelectedSubTask(subTask);
    setIsSubTaskModalOpen(true);
  };

  const handleNewSubTask = () => {
    setSelectedSubTask(null);
    setIsSubTaskModalOpen(true);
  };

  const handleCloseSubTaskModal = () => {
    setIsSubTaskModalOpen(false);
    setSelectedSubTask(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Subtarefas - ${task.title}`}
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-md text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleNewSubTask}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nova Subtarefa
          </button>

          {isLoading && subTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Carregando subtarefas...
            </div>
          ) : subTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhuma subtarefa encontrada. Crie a primeira!
            </div>
          ) : (
            <div className="space-y-2">
              {subTasks.map((subTask) => (
                <SubTaskCard
                  key={subTask.identifier}
                  subTask={subTask}
                  onEdit={handleEditSubTask}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteSubTask}
                  disabled={isLoading}
                />
              ))}
            </div>
          )}

          <div className="text-xs text-slate-400 text-center pt-2">
            Total: {subTasks.length} subtarefa(s) | Concluídas:{' '}
            {subTasks.filter((st) => st.completed).length}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSubTaskModalOpen}
        onClose={handleCloseSubTaskModal}
        title={selectedSubTask ? 'Editar Subtarefa' : 'Nova Subtarefa'}
      >
        <SubTaskForm
          taskIdentifier={task.identifier}
          onSubmit={selectedSubTask ? handleUpdateSubTask : handleCreateSubTask}
          initialData={selectedSubTask || undefined}
          submitLabel={selectedSubTask ? 'Salvar' : 'Criar'}
          disabled={isLoading}
        />
      </Modal>
    </>
  );
}
