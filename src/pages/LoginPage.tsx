import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Mail, Lock } from 'lucide-react';
import Background from '../components/Background';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden p-4 md:p-8 flex items-center justify-center">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-10 rounded-[32px] flex flex-col gap-8 shadow-2xl relative"
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-accent-black rotate-6 shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">VeloTask</h1>
          <p className="text-white/40 font-semibold uppercase tracking-widest text-xs">Welcome Back</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="w-full bg-white text-accent-black py-4 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-white/5 hover:bg-lavender transition-all"
        >
          Sign In
        </motion.button>

        <p className="text-center text-white/30 text-sm font-medium">
          Don't have an account? <button className="text-white hover:text-primary transition-colors">Join now</button>
        </p>
      </motion.div>
    </div>
  );
}
