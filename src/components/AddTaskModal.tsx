import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, Calendar, User as UserIcon, Layers } from 'lucide-react';
import { Priority, Task, Project, User, Status } from '../types';
import { cn } from '../lib/utils';
import { suggestTaskPriority } from '../services/geminiService';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  workspaceId: string;
  projects: Project[];
  users: User[];
}

export default function AddTaskModal({ isOpen, onClose, onAdd, workspaceId, projects, users }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [tags, setTags] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [projects, projectId]);

  const handleSuggest = async () => {
    if (!title) return;
    setIsSuggesting(true);
    setAiNote('');
    const result = await suggestTaskPriority(title, description);
    setPriority(result.priority);
    setAiNote(result.reasoning);
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      workspaceId,
      projectId,
      title,
      description,
      priority,
      status: 'To Do',
      assignees,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      subtasks: []
    });
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags('');
    setAiNote('');
    setAssignees([]);
    setDueDate('');
    onClose();
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
            className="fixed inset-0 bg-accent-black/10 backdrop-blur-sm z-50 overflow-hidden"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 z-[60]"
          >
            <div className="glass-panel rounded-[32px] p-8 shadow-2xl flex flex-col gap-6">
              <div className="flex justify-between items-center group/header">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black tracking-tight text-white group-hover/header:text-primary transition-colors">New Task</h2>
                  <p className="text-xs font-black text-white/60 uppercase tracking-widest mt-0.5">Define your goal</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 ml-1">Task Details</label>
                  <input
                    autoFocus
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold text-white placeholder:text-white/30 shadow-inner"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add optional notes..."
                    rows={2}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 mt-2 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm font-medium text-white/90 placeholder:text-white/30 resize-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 ml-1 flex items-center gap-2">
                       <Layers className="w-3 h-3" /> Project
                    </label>
                    <select 
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-primary/40 shadow-inner appearance-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#1a1a1e]">{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 ml-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-xs font-semibold text-white color-scheme-dark shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                   <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60">Priority</label>
                      <button
                        type="button"
                        onClick={handleSuggest}
                        disabled={isSuggesting || !title}
                        className="text-[9px] font-black uppercase text-primary hover:text-indigo-300 disabled:opacity-30 flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Optmize
                      </button>
                   </div>
                   <div className="flex p-1 bg-white/10 rounded-xl border border-white/20 shadow-inner">
                      {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                            priority === p 
                              ? p === 'urgent' ? "bg-orange-500 text-white shadow-lg" : "bg-white text-accent-black shadow-lg" 
                              : "text-white/40 hover:text-white"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 ml-1">Context Tags</label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="comma, split"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-xs font-semibold text-white placeholder:text-white/30 shadow-inner"
                  />
                </div>

                {aiNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-[11px] font-medium text-indigo-200 italic">"{aiNote}"</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-pill btn-black py-4 mt-2 text-sm font-black uppercase tracking-widest shadow-2xl shadow-white/5 flex items-center justify-center gap-3"
                >
                  Create Entry
                  <Plus className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
