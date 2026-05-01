import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Task, Priority } from '../types';
import TaskItem from '../components/TaskItem';
import Background from '../components/Background';
import { cn } from '../lib/utils';

interface CalendarPageProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onTaskClick: (task: Task) => void;
}

export default function CalendarPage({ tasks, onToggleTask, onDeleteTask, onPriorityChange, onTaskClick }: CalendarPageProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate.getFullYear() === selectedDate.getFullYear() &&
           taskDate.getMonth() === selectedDate.getMonth() &&
           taskDate.getDate() === selectedDate.getDate();
  });

  const calendarDays = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Fill empty slots
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  // Fill days
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  return (
    <div className="h-screen w-screen overflow-hidden p-4 md:p-8 flex items-center justify-center">
      <Background />
      
      <main className="glass-panel w-full h-full max-w-7xl flex flex-col rounded-[32px] overflow-hidden">
        <header className="flex items-center justify-between px-10 py-6 border-b border-white/10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Scheduler
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <button onClick={prevMonth} className="text-white/50 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm font-black uppercase tracking-widest min-w-[120px] text-center">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} className="text-white/50 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Calendar Sidebar */}
          <div className="w-[400px] border-r border-white/10 p-8 overflow-y-auto custom-scrollbar bg-white/[0.02]">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-black text-white/30 uppercase text-center py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
                
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                const hasTasks = tasks.some(t => new Date(t.createdAt).toDateString() === date.toDateString());

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "aspect-square rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1",
                      isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-white/60 hover:bg-white/5 hover:text-white",
                      isToday && !isSelected && "border border-primary/50 text-primary"
                    )}
                  >
                    {date.getDate()}
                    {hasTasks && !isSelected && (
                      <div className="w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-primary/10 border border-primary/20">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Selected Date</h4>
              <p className="text-xl font-black text-white">
                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-sm font-medium text-white/40 mt-1">
                {monthTasks.length} {monthTasks.length === 1 ? 'task' : 'tasks'} found
              </p>
            </div>
          </div>

          {/* Task View */}
          <section className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-black/20">
            <AnimatePresence mode="popLayout">
              {monthTasks.length > 0 ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
                >
                  {monthTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onPriorityChange={onPriorityChange}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-white/20 gap-4"
                >
                  <CalendarIcon className="w-16 h-16 opacity-10" />
                  <p className="text-lg font-black italic tracking-widest uppercase">Clear Schedule</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
