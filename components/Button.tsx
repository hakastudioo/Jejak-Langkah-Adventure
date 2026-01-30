
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'ghost' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  fullWidth, 
  loading, 
  variant = 'primary',
  className = '', 
  ...props 
}) => {
  const baseClasses = "relative overflow-hidden py-4 md:py-5 px-8 font-black uppercase tracking-[0.2em] rounded-2xl md:rounded-[2.5rem] transition-all duration-500 active:scale-90 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group z-10 select-none";
  
  const variants = {
    primary: "bg-brand-red text-white hover:bg-brand-red-dark hover:shadow-[0_20px_40px_rgba(225,29,72,0.4)] border border-white/10 shadow-lg",
    secondary: "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg",
    outline: "bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5",
    white: "bg-white text-brand-red hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] shadow-xl",
    ghost: "bg-transparent text-slate-400 hover:text-brand-red hover:bg-brand-red/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Shimmer Effect for almost all variants except ghost */}
      {variant !== 'ghost' && !loading && (
        <div className="absolute inset-0 translate-x-[-150%] group-hover:animate-shimmer pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] blur-md"></div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-[3px] border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] animate-pulse">Processing...</span>
        </div>
      ) : (
        <span className="relative z-20 flex items-center gap-3 transition-transform group-hover:scale-105 duration-300">{children}</span>
      )}
    </button>
  );
};

export default Button;
