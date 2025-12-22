import { useState, FormEvent, useEffect } from 'react';
import { UserRequest } from '@my-workspace/shared-dtos';

interface UserFormProps {
  onSubmit: (userData: UserRequest) => void | Promise<void>;
  initialData?: Partial<UserRequest>;
  submitLabel?: string;
  isEditMode?: boolean;
}

export function UserForm({
  onSubmit,
  initialData,
  submitLabel = 'Criar Usuário',
  isEditMode = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserRequest>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit: UserRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      await onSubmit(dataToSubmit);
      if (!initialData && !isEditMode) {
        setFormData({ name: '', email: '', password: '' });
      } else if (isEditMode) {
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={1}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
          {isEditMode ? 'Nova Senha' : 'Senha'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
          placeholder="Mínimo 3 caracteres"
        />
        {isEditMode && (
          <p className="mt-1 text-xs text-slate-400">
            Digite uma nova senha para alterar ou repita a senha atual para manter
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
}