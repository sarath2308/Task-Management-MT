import React, { useState } from 'react';
import { 
  Plus, Pencil, Trash2, CheckCircle, X, 
  ListFilter, Loader2, Clock, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useGetTasks } from '../hook/tasks/task.get.hook';
import { useCreateTask } from '../hook/tasks/task.create.hook';
import { useUpdateTask } from '../hook/tasks/task.update.hook';
import { useRemoveTask } from '../hook/tasks/task.remove.hook';
import { useToggleStatus } from '../hook/tasks/task.toggle.status.hook';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

type TabType = 'pending' | 'completed';

const TasksPage: React.FC = () => {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // --- API Hooks ---
  const { data: taskResponse, isLoading, refetch, isError } = useGetTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const removeTaskMutation = useRemoveTask();
  const toggleStatusMutation = useToggleStatus();

  // --- Data Logic ---
  const pendingTasks: Task[] = taskResponse?.pendingTask ?? [];
  const completedTasks: Task[] = taskResponse?.completedTask ?? [];
  const displayTasks = activeTab === 'pending' ? pendingTasks : completedTasks;

  // --- Action Handlers ---
  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({ title: task.title, description: task.description });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({taskId: editingTask.id, payload:{title: formData.title, description: formData.description}});
      } else {
        await createTaskMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Mutation failed:", err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await removeTaskMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // --- Loading & Error States ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your workspace...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-400 mt-2">We couldn't fetch your tasks. Please try again later.</p>
        <button onClick={() => refetch()} className="mt-6 bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-xl transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">My Tasks</h1>
          <p className="text-gray-500 font-medium mt-1 text-lg">Manage your flow and crush your goals.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95 hover:-translate-y-1"
        >
          <Plus size={22} /> Create Task
        </button>
      </div>

      {/* Tabs System */}
      <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-[20px] border border-gray-800 w-fit mb-10 shadow-inner">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'pending' 
            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg' 
            : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Clock size={18} />
          Pending
          <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full ${activeTab === 'pending' ? 'bg-blue-500/20' : 'bg-gray-800'}`}>
            {pendingTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'completed' 
            ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-lg' 
            : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <CheckCircle2 size={18} />
          Completed
          <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full ${activeTab === 'completed' ? 'bg-emerald-500/20' : 'bg-gray-800'}`}>
            {completedTasks.length}
          </span>
        </button>
      </div>

      {/* Task List */}
      <div className="grid gap-5">
        {displayTasks.length === 0 ? (
          <div className="text-center py-28 bg-gray-900/30 border-2 border-dashed border-gray-800/50 rounded-[40px] animate-in zoom-in-95">
            <ListFilter className="mx-auto text-gray-700 mb-6" size={64} />
            <h3 className="text-2xl font-bold text-gray-400">No {activeTab} tasks</h3>
            <p className="text-gray-600 mt-2 max-w-xs mx-auto">Looks like you're all caught up! Take a break or create something new.</p>
          </div>
        ) : (
          displayTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-gray-900/60 border border-gray-800/50 p-6 rounded-[28px] flex items-center justify-between group hover:border-blue-500/30 hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-blue-500/5"
            >
              <div className="flex items-center gap-6 flex-1">
                <button 
                  onClick={() => handleToggle(task.id)}
                  disabled={toggleStatusMutation.isPending}
                  className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                    task.status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'border-gray-700 hover:border-blue-500 bg-gray-800/50'
                  }`}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle size={20} className="text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-blue-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold tracking-tight transition-all duration-500 ${
                    task.status === 'completed' ? 'text-gray-600 line-through opacity-50' : 'text-gray-100'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-gray-500 text-base mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {task.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => handleOpenModal(task)} 
                  className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all active:scale-90"
                >
                  <Pencil size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(task.id)} 
                  disabled={removeTaskMutation.isPending}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-gray-950 border border-gray-800 w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <Plus className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition p-2 bg-gray-900 rounded-full hover:rotate-90 duration-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                  placeholder="What's the mission?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Details</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-gray-700" 
                  placeholder="Add some context here..."
                />
              </div>
              <button 
                onClick={handleSave}
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg tracking-tight"
              >
                {(createTaskMutation.isPending || updateTaskMutation.isPending) && <Loader2 className="w-6 h-6 animate-spin" />}
                {editingTask ? 'Save Changes' : 'Launch Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;