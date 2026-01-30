
import React, { useEffect } from 'react';
import { AlertCircle, X, Info, BellRing } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 md:top-12 md:left-auto md:right-12 md:translate-x-0 z-[3000] w-[90%] md:w-auto animate-in slide-in-from-top-10 fade-in duration-500">
      <div className="glass-morphism p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex items-center gap-4 md:gap-6 border-l-4 border-l-brand-red group max-w-md">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-red rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-glow-red animate-pulse-glow">
          <BellRing size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">System Alert</p>
          </div>
          <p className="text-xs md:text-sm font-bold text-white leading-relaxed truncate">{message}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 md:p-3 text-slate-600 hover:text-white transition-colors hover:bg-white/5 rounded-xl md:rounded-2xl"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
