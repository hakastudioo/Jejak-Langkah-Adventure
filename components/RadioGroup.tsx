
import React from 'react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className = '', 
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 transition-colors">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl transition-colors">
        {options.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`relative py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 overflow-hidden ${
                isActive ? 'text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
              }`}
            >
              <span className="relative z-10">{option}</span>
              {isActive && (
                <div className="absolute inset-0 bg-brand-red shadow-lg animate-in fade-in zoom-in duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
