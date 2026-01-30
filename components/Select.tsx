
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
  const baseClasses = `w-full appearance-none px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none transition-all cursor-pointer font-sans font-bold text-sm text-slate-900 dark:text-white pr-14 bg-white dark:bg-slate-950 ${
    error 
      ? "border-brand-red ring-4 ring-brand-red/10" 
      : "focus:border-brand-red focus:ring-4 focus:ring-brand-red/5"
  }`;

  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 group-focus-within:text-brand-red uppercase tracking-widest px-2 transition-colors">
        {label}
      </label>
      <div className="relative">
        <select 
          {...props}
          className={baseClasses}
        >
          <option value="" disabled className="dark:bg-slate-900">Pilih Gunung...</option>
          {options.map(opt => (
            <option key={opt} value={opt} className="text-slate-900 dark:text-white py-4 font-sans font-bold dark:bg-slate-900">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-700 group-focus-within:text-brand-red transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-[10px] font-bold text-brand-red uppercase px-2">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
