
import React, { useEffect } from 'react';
import { AlertCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 md:right-12 z-[2000] animate-in slide-in-from-right-10 fade-in duration-500">
      <div className="bg-navy-900/90 backdrop-blur-2xl border border-white/10 border-r-4 border-r-brand-red p-6 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex items-center gap-5 min-w-[300px] md:min-w-[420px] max-w-[500px]">
        <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red shrink-0 shadow-inner group">
          <AlertCircle size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Info size={10} className="text-slate-500" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">System Message</p>
          </div>
          <p className="text-xs md:text-sm font-bold text-white leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 text-slate-600 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
