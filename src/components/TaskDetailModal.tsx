import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Flag, User as UserIcon, Tag, 
  CheckSquare, Plus, Trash2, Clock, Layers, 
  ChevronRight, AlertCircle 
} from 'lucide-react';
import { Task, User, Priority, Status, Subtask } from '../types';
import { cn } from '../lib/utils';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  users: User[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetailModal({ 
  isOpen, 
  onClose, 
  task, 
  users, 
  onUpdate, 
  onDelete 
}: TaskDetailModalProps) {
  if (!task) return null;

  const [localTask, setLocalTask] = useState<Task>(task);
  const [newSubtask, setNewSubtask] = useState('');

  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  const statuses: Status[] = ['Planning', 'To Do', 'In Progress', 'In Review', 'Blocked', 'Done'];

  const handleUpdate = (updates: Partial<Task>) => {
    const updated = { ...localTask, ...updates };
    setLocalTask(updated);
    onUpdate(updated);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const sub: Subtask = {
      id: crypto.randomUUID(),
      title: newSubtask,
      completed: false
    };
    handleUpdate({ subtasks: [...(localTask.subtasks || []), sub] });
    setNewSubtask('');
  };

  const toggleSubtask = (id: string) => {
    handleUpdate({
      subtasks: (localTask.subtasks || []).map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    });
  };

  const removeSubtask = (id: string) => {
    handleUpdate({
      subtasks: (localTask.subtasks || []).filter(s => s.id !== id)
    });
  };

  const statusColors: Record<Status, string> = {
    'Planning': 'bg-blue-500/20 text-blue-300',
    'To Do': 'bg-white/10 text-white/70',
    'In Progress': 'bg-primary/20 text-indigo-300',
    'In Review': 'bg-amber-500/20 text-amber-300',
    'Blocked': 'bg-rose-500/20 text-rose-300',
    'Done': 'bg-emerald-500/20 text-emerald-300'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0a0a0c] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleUpdate({ completed: !localTask.completed })}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2",
                    localTask.completed 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : "bg-white/5 border-white/10 text-white/30 hover:border-white/30"
                  )}
                >
                  <CheckSquare className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-sm font-black text-white/40 uppercase tracking-widest">Task Details</h2>
                  <p className="text-xs font-bold text-primary">ID: {localTask.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    onDelete(localTask.id);
                    onClose();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl border border-rose-500/20 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/50 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              {/* Title & Description */}
              <div className="space-y-6">
                <input 
                  value={localTask.title}
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  className="text-4xl font-black bg-transparent border-none outline-none text-white w-full placeholder:text-white/10 focus:ring-1 focus:ring-primary/20 rounded-xl p-2 -ml-2"
                  placeholder="Task Title"
                />
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Description
                  </label>
                  <textarea 
                    value={localTask.description}
                    onChange={(e) => handleUpdate({ description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white/80 outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px] resize-none leading-relaxed"
                    placeholder="Describe the task or add rich instructions..."
                  />
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status Selection */}
                <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Status</label>
                  <select 
                    value={localTask.status}
                    onChange={(e) => handleUpdate({ status: e.target.value as Status })}
                    className={cn(
                      "w-full px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest outline-none border-none cursor-pointer",
                      statusColors[localTask.status]
                    )}
                  >
                    {statuses.map(s => <option key={s} value={s} className="bg-[#1a1a1e]">{s}</option>)}
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Priority</label>
                  <select 
                    value={localTask.priority}
                    onChange={(e) => handleUpdate({ priority: e.target.value as Priority })}
                    className="w-full bg-white/10 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white outline-none border-none cursor-pointer"
                  >
                    {priorities.map(p => <option key={p} value={p} className="bg-[#1a1a1e]">{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Start Date
                  </label>
                  <input 
                    type="date"
                    value={localTask.startDate ? new Date(localTask.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdate({ startDate: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/30 color-scheme-dark"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Flag className="w-3 h-3" /> Due Date
                  </label>
                  <input 
                    type="date"
                    value={localTask.dueDate ? new Date(localTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdate({ dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/30 color-scheme-dark"
                  />
                </div>
              </div>

              {/* Assignees */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <UserIcon className="w-3 h-3" /> Assignees
                </label>
                <div className="flex flex-wrap gap-3">
                  {users.map(user => {
                    const isAssigned = (localTask.assignees || []).includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          const newAssignees = isAssigned 
                            ? (localTask.assignees || []).filter(id => id !== user.id)
                            : [...(localTask.assignees || []), user.id];
                          handleUpdate({ assignees: newAssignees });
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all",
                          isAssigned 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                          {user.name.slice(0, 1)}
                        </div>
                        <span className="text-xs font-bold">{user.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checklist / Subtasks */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <CheckSquare className="w-3 h-3" /> Subtasks
                </label>
                <div className="space-y-2">
                  {(localTask.subtasks || []).map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 group">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleSubtask(sub.id)}
                          className={cn(
                            "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                            sub.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20"
                          )}
                        >
                          {sub.completed && <CheckSquare className="w-3 h-3" />}
                        </button>
                        <span className={cn("text-sm font-medium", sub.completed ? "text-white/20 line-through" : "text-white/80")}>
                          {sub.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeSubtask(sub.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-rose-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <input 
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="Add a subtask..."
                    />
                    <button 
                      onClick={addSubtask}
                      className="p-3 bg-white text-accent-black rounded-2xl hover:bg-lavender transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {(localTask.tags || []).map(tag => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white/70">
                      {tag}
                      <button 
                        onClick={() => handleUpdate({ tags: (localTask.tags || []).filter(t => t !== tag) })}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button className="px-3 py-1.5 rounded-full bg-white/5 border border-dashed border-white/20 text-[10px] font-bold text-white/30 hover:text-white hover:border-white/40 transition-all">
                    + Add New
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Footer Info */}
            <div className="p-8 border-t border-white/10 bg-white/[0.01] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
              <div className="flex gap-6">
                <span>Created {new Date(localTask.createdAt).toLocaleDateString()}</span>
                {localTask.completed && <span>Completed</span>}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Active Link</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
