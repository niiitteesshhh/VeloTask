import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Trash2, AlertCircle, 
  LayoutGrid, ChevronDown, Clock, User as UserIcon,
  X, ListTodo
} from 'lucide-react';
import { Task, Priority } from '../types';
import { cn } from '../lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onClick: () => void;
  key?: string | number;
}

export default function TaskItem({ task, onToggle, onDelete, onPriorityChange, onClick }: TaskItemProps) {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [showSubtasksOverlay, setShowSubtasksOverlay] = useState(false);

  const statusClasses: Record<Priority, string> = {
    urgent: "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] animate-pulse",
    high: "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    medium: "bg-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    low: "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  };

  const cardClasses: Record<Priority, string> = {
    urgent: "bg-orange-500/10 border-orange-500/50 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]",
    high: "bg-rose-500/10 border-rose-500/30",
    medium: "bg-primary/10 border-primary/30",
    low: "bg-emerald-500/10 border-emerald-500/30",
  };

  const priorityMenuClasses: Record<Priority, string> = {
    urgent: "bg-orange-950 border-orange-500",
    high: "bg-rose-950 border-rose-500",
    medium: "bg-indigo-950 border-indigo-500",
    low: "bg-emerald-950 border-emerald-500",
  };

  const IconMap = {
    design: <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 text-orange-400"><LayoutGrid className="w-4 h-4" /></div>,
    development: <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 text-indigo-400"><CheckCircle2 className="w-4 h-4" /></div>,
    brand: <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 text-emerald-400"><AlertCircle className="w-4 h-4" /></div>,
    default: <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 text-white/30"><Circle className="w-4 h-4" /></div>
  };

  const mainTag = task.tags[0] as keyof typeof IconMap || 'default';
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

  const completedSubtasks = (task.subtasks || []).filter(s => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "glass-card p-4 flex flex-col justify-between min-h-[280px] group relative overflow-visible border-2 cursor-pointer transition-all duration-300 hover:z-10",
        task.completed ? "opacity-50 border-white/5 bg-white/5" : cardClasses[task.priority]
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 relative min-w-0">
          <div className="relative inline-flex flex-wrap items-center gap-1.5 mb-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsPriorityOpen(!isPriorityOpen);
              }}
              disabled={task.completed}
              className={cn(
                "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all flex items-center gap-1.5",
                task.completed ? "bg-white/10 text-white/60" : statusClasses[task.priority],
                !task.completed && "hover:scale-105 active:scale-95 cursor-pointer"
              )}
            >
              {task.completed ? "Done" : task.priority}
              {!task.completed && <ChevronDown className={cn("w-2.5 h-2.5 transition-transform", isPriorityOpen && "rotate-180")} />}
            </button>

            {task.status && !task.completed && (
              <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/50 border border-white/5">
                {task.status}
              </span>
            )}

            {totalSubtasks > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasksOverlay(true);
                }}
                className="text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded bg-primary text-white border border-primary/20 hover:bg-lavender hover:text-accent-black transition-all shadow-lg shadow-primary/20"
              >
                Show sub-tasks
              </button>
            )}

            {isPriorityOpen && !task.completed && (
              <div className={cn(
                "absolute top-full left-0 mt-2 z-50 p-1 rounded-xl shadow-2xl border min-w-[110px]",
                priorityMenuClasses[task.priority]
              )}>
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriorityChange(task.id, p);
                      setIsPriorityOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors",
                      task.priority === p ? "bg-white text-accent-black" : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h3 className={cn(
            "font-extrabold text-xs leading-tight text-white transition-all hover:text-primary cursor-default line-clamp-2",
            task.completed && "line-through text-white/40"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-[9px] mt-1 line-clamp-2 leading-relaxed transition-colors",
              task.completed ? "text-white/30" : "text-white/60 group-hover:text-white/80"
            )}>
              {task.description}
            </p>
          )}

          {/* Subtask Progress */}
          {totalSubtasks > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
              <span className="text-[7px] font-black text-white/40 uppercase">{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-white/20" />}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {/* Assignees and Due Date */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5" id="assignees-container">
            {(task.assignees || []).length > 0 ? (
              (task.assignees || []).map((id, idx) => (
                <div key={id + idx} className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[7px] font-bold uppercase text-white shadow-sm">
                  {id.slice(1, 2)}
                </div>
              ))
            ) : (
                <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <UserIcon className="w-2.5 h-2.5 text-white/20" />
                </div>
            )}
          </div>

          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg",
              Date.now() > task.dueDate && "bg-rose-500 text-white animate-pulse"
            )}>
              <Clock className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex -space-x-1">
            {(task.tags || []).slice(0, 2).map((tag, idx) => (
              <div key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-bold uppercase text-white/30">
                {tag}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition-all bg-white/5 p-1 rounded-lg"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.15em] flex flex-col items-end leading-none">
              <span>Added {Math.floor((Date.now() - task.createdAt) / (1000 * 60 * 60 * 24)) === 0 
                ? 'Today' 
                : `${Math.floor((Date.now() - task.createdAt) / (1000 * 60 * 60 * 24))}d ago`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSubtasksOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute inset-0 z-[50] bg-accent-black/95 backdrop-blur-xl border-2 border-primary/30 rounded-[2rem] p-6 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">Sub-tasks</h4>
              </div>
              <button 
                onClick={() => setShowSubtasksOverlay(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
              {(task.subtasks || []).length > 0 ? (task.subtasks || []).map(sub => (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group/sub">
                  <div className={cn(
                    "w-4 h-4 rounded-lg border flex items-center justify-center transition-all",
                    sub.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20"
                  )}>
                    {sub.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold leading-tight",
                    sub.completed ? "text-white/20 line-through" : "text-white/70"
                  )}>
                    {sub.title}
                  </span>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-white/20">
                  <ListTodo className="w-8 h-8 mb-2 opacity-10" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No sub-tasks</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                {completedSubtasks}/{totalSubtasks} Completed
              </span>
              <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-primary"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                 />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
