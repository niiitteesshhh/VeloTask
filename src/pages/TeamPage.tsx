import React from 'react';
import { motion } from 'motion/react';
import { Users, Mail, CheckCircle2, Circle, MessageSquare, Share2, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task, User } from '../types';
import { cn } from '../lib/utils';
import Background from '../components/Background';

interface TeamPageProps {
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
}

export default function TeamPage({ tasks, users, onTaskClick }: TeamPageProps) {
  const navigate = useNavigate();

  const getTasksForUser = (userId: string) => {
    return (tasks || []).filter(task => (task.assignees || []).includes(userId));
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-4 md:p-8 flex items-center justify-center">
      <Background />

      <main className="glass-panel w-full h-full max-w-7xl flex flex-col rounded-[32px] overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Team Collaboration
              </h1>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Manage your team and their workloads</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-pill bg-primary/20 text-primary border border-primary/30 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/20"
            >
              <Share2 className="w-4 h-4" />
              Collaborate
            </motion.button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map(user => {
              const userTasks = getTasksForUser(user.id);
              const completedCount = userTasks.filter(t => t.completed).length;
              const progress = userTasks.length > 0 ? (completedCount / userTasks.length) * 100 : 0;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 flex flex-col gap-6 group relative overflow-hidden border-2 border-white/5 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-xl font-black text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-black text-white tracking-tight">{user.name}</h3>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                      <span>Workload Progress</span>
                      <span className="text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Assigned Tasks ({userTasks.length})
                    </div>
                    
                    <div className="space-y-2">
                      {userTasks.length > 0 ? userTasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group/task"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {task.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-white/20 shrink-0" />
                              )}
                              <span className={cn(
                                "text-[11px] font-bold truncate tracking-tight",
                                task.completed ? "text-white/20 line-through" : "text-white/80 group-hover/task:text-white"
                              )}>
                                {task.title}
                              </span>
                            </div>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              task.priority === 'urgent' ? 'bg-orange-500' :
                              task.priority === 'high' ? 'bg-rose-500' :
                              task.priority === 'medium' ? 'bg-indigo-500' : 'bg-emerald-500'
                            )} />
                          </div>
                        </div>
                      )) : (
                        <div className="py-4 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
                          <Plus className="w-4 h-4 mb-1" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Available for hire</span>
                        </div>
                      )}
                      {userTasks.length > 3 && (
                        <div className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 pt-1">
                          + {userTasks.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors">
                      View Profile
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
