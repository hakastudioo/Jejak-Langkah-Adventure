
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextArea?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, isTextArea, error, ...props }) => {
  const baseClasses = `w-full px-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 font-sans font-bold text-sm md:text-base ${
    error 
      ? "border-brand-red ring-4 ring-brand-red/10" 
      : "focus:border-brand-red focus:ring-4 focus:ring-brand-red/5"
  }`;
  
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 group-focus-within:text-brand-red uppercase tracking-widest px-2 transition-colors">
        {label}
      </label>
      {isTextArea ? (
        <textarea 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
          className={`${baseClasses} min-h-[120px] leading-relaxed resize-none`}
        />
      ) : (
        <input 
          {...props} 
          className={baseClasses}
        />
      )}
      {error && (
        <span className="text-[10px] font-bold text-brand-red uppercase px-2">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
