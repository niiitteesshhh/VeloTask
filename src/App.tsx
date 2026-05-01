import { useState, useMemo, useEffect } from 'react';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, CheckCircle2, Circle } from 'lucide-react';
import Background from './components/Background';
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import { Task, TaskFilter, Priority, Workspace, User, Project, Status } from './types';
import { cn } from './lib/utils';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import TeamPage from './pages/TeamPage';
import { Calendar as CalendarGrid, Users } from 'lucide-react';

function Dashboard({ 
  tasks, 
  setTasks, 
  onToggleTask, 
  onDeleteTask, 
  onPriorityChange,
  onTaskClick,
  workspaces,
  projects,
  users
}: { 
  tasks: Task[], 
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onToggleTask: (id: string) => void,
  onDeleteTask: (id: string) => void,
  onPriorityChange: (id: string, priority: Priority) => void,
  onTaskClick: (task: Task) => void,
  workspaces: Workspace[],
  projects: Project[],
  users: User[]
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]?.id);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesWorkspace = task.workspaceId === activeWorkspace;
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                              task.description.toLowerCase().includes(search.toLowerCase()) ||
                              (task.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
        
        if (!matchesWorkspace) return false;

        if (filter === 'active') return matchesSearch && !task.completed;
        if (filter === 'completed') return matchesSearch && task.completed;
        if (filter !== 'all') return matchesSearch && task.status === filter;
        
        return matchesSearch;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, search, filter, activeWorkspace]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    setTasks(prev => [{ ...taskData, id: crypto.randomUUID(), createdAt: Date.now(), completed: false }, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-4 md:p-8 flex items-center justify-center">
      <Background />

      <main className="glass-panel w-full h-full max-w-7xl flex flex-col rounded-[32px] overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-white/10">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-accent-black rotate-6 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              VeloTask
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-white/70">
              <a href="#" className="text-white hover:text-primary transition-colors">Dashboard</a>
              <button 
                onClick={() => navigate('/team')}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                Team
              </button>
              <button 
                onClick={() => navigate('/calendar')}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <CalendarGrid className="w-4 h-4" />
                Calendar
              </button>
              <a href="#" className="hover:text-white transition-colors">Archive</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="btn-pill btn-outline hidden sm:flex"
            >
              Log In
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-pill btn-black"
            >
              Sign Up
            </motion.button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 p-6 border-r border-white/10 hidden md:flex flex-col">
            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-5 mb-2 block">Workspaces</label>
              <div className="space-y-1">
                {workspaces.map(ws => (
                  <motion.button
                    key={ws.id}
                    onClick={() => setActiveWorkspace(ws.id)}
                    className={cn(
                      "w-full px-5 py-3 rounded-2xl flex items-center justify-between text-sm font-bold transition-all",
                      activeWorkspace === ws.id ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {ws.name}
                    {activeWorkspace === ws.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-5 mb-2 block">Filters</label>
              <div className="space-y-1">
                {[
                  { label: 'All Tasks', active: filter === 'all', icon: <span className="w-2 h-2 rounded-full bg-white" />, filter: 'all' as TaskFilter },
                  { label: 'Active', active: filter === 'active', icon: <span className="w-2 h-2 rounded-full bg-primary" />, filter: 'active' as TaskFilter },
                  { label: 'Completed', active: filter === 'completed', icon: <span className="w-2 h-2 rounded-full bg-emerald-400" />, filter: 'completed' as TaskFilter }
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter(item.filter)}
                    className={cn(
                      "w-full px-5 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all",
                      item.active ? "bg-white/10 text-white border border-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="mb-4 px-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Projects</div>
              <div className="space-y-1">
                {projects.filter(p => p.workspaceId === activeWorkspace).map(project => (
                  <motion.button 
                    key={project.id} 
                    whileHover={{ x: 4, color: '#ffffff' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-5 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium text-white/40 hover:bg-white/5 transition-all"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          {/* Activity Section */}
          <section className="flex-1 p-8 flex flex-col gap-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <h1 className="text-3xl font-extrabold tracking-tight text-white hover:text-primary transition-colors cursor-default">Daily Overview</h1>
                <p className="text-white/60 text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-full pl-11 pr-6 py-2.5 text-sm w-48 lg:w-64 outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium text-white placeholder:text-white/40 shadow-inner"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="btn-pill btn-black"
                >
                  Add Task
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12"
                  >
                    {filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        onPriorityChange={onPriorityChange}
                        onClick={() => onTaskClick(task)}
                      />
                    ))}
                    <motion.div
                      layout
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsModalOpen(true)}
                      className="glass-card flex-col aspect-auto min-h-[280px] border-dashed border-2 border-white/10 hover:border-primary/60 bg-white/[0.01] flex items-center justify-center cursor-pointer transition-all hover:bg-white/[0.03]"
                    >
                      <div className="flex flex-col items-center text-white/20 group">
                        <Plus className="w-10 h-10 group-hover:scale-110 transition-transform group-hover:text-primary/60" />
                        <span className="text-xs font-black uppercase tracking-widest mt-4 group-hover:text-white/40">Add Entry</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/20">
                    <p className="font-semibold italic">No tasks found for this view</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-10 py-5 border-t border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex gap-6 text-white/50">
            <motion.button 
              whileHover={{ scale: 1.2, color: '#ffffff' }}
              whileTap={{ scale: 0.8 }}
              className="transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.2, color: '#ffffff' }}
              whileTap={{ scale: 0.8 }}
              onClick={() => navigate('/calendar')}
              className="transition-colors"
            >
              <CalendarGrid className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] hover:text-white/60 transition-colors cursor-default">
            © 2026 VeloTask Systems Inc.
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse"></div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Cloud Synced</span>
          </div>
        </footer>

      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
        workspaceId={activeWorkspace}
        projects={projects.filter(p => p.workspaceId === activeWorkspace)}
        users={users}
      />
    </div>
  );
}

export default function App() {
  const [users] = useState<User[]>([
    { id: 'u1', name: 'Alex Rivera', email: 'alex@example.com' },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah@example.com' },
    { id: 'u3', name: 'Marcus Bell', email: 'marcus@example.com' }
  ]);

  const [workspaces] = useState<Workspace[]>([
    { id: 'w1', name: 'Marketing', description: 'Growth and brand identity' },
    { id: 'w2', name: 'Product', description: 'Development and design' }
  ]);

  const [projects] = useState<Project[]>([
    { id: 'p1', workspaceId: 'w1', name: 'Q4 Campaign', color: '#8b5cf6' },
    { id: 'p2', workspaceId: 'w1', name: 'Social Media', color: '#10b981' },
    { id: 'p3', workspaceId: 'w2', name: 'VeloTask Core', color: '#f59e0b' },
    { id: 'p4', workspaceId: 'w2', name: 'Mobile App', color: '#ef4444' }
  ]);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('velotask-tasks');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        workspaceId: 'w2',
        projectId: 'p3',
        title: 'Review Brand Guidelines',
        description: 'Update the typography scale for Q4 assets.',
        priority: 'high',
        status: 'In Review',
        completed: false,
        createdAt: Date.now(),
        assignees: ['u1', 'u2'],
        tags: ['design', 'brand'],
        subtasks: [
          { id: 's1', title: 'Check contrast ratios', completed: true },
          { id: 's2', title: 'Update font weights', completed: false }
        ]
      },
      {
        id: '2',
        workspaceId: 'w2',
        projectId: 'p3',
        title: 'API Schema Refactor',
        description: 'Moving to GraphQL for the analytics module.',
        priority: 'medium',
        status: 'In Progress',
        completed: false,
        createdAt: Date.now() - 100000,
        assignees: ['u3'],
        tags: ['development'],
        subtasks: []
      },
      {
        id: '3',
        workspaceId: 'w2',
        projectId: 'p4',
        title: 'UX Audit: Checkout Flow',
        description: 'Identify friction points in the payment gateway integration.',
        priority: 'urgent',
        status: 'Blocked',
        completed: false,
        createdAt: Date.now() - 200000,
        assignees: ['u2'],
        tags: ['design', 'product'],
        subtasks: []
      }
    ];
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('velotask-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const handlePriorityChange = (id: string, priority: Priority) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard 
          tasks={tasks} 
          setTasks={setTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onPriorityChange={handlePriorityChange}
          onTaskClick={setSelectedTask}
          workspaces={workspaces}
          projects={projects}
          users={users}
        />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage 
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onPriorityChange={handlePriorityChange}
          onTaskClick={setSelectedTask}
        />} />
        <Route path="/team" element={<TeamPage 
          tasks={tasks}
          users={users}
          onTaskClick={setSelectedTask}
        />} />
      </Routes>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        users={users}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
