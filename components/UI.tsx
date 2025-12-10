
import React from 'react';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isRTL } from '../services/localization';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 hover:bg-indigo-500",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-700",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    outline: "border-2 border-slate-700 text-slate-300 hover:border-slate-500",
    ghost: "bg-transparent text-slate-400 hover:text-slate-100",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm rounded-xl",
    md: "h-12 px-5 text-base rounded-2xl",
    lg: "h-14 px-6 text-lg rounded-2xl", 
    xl: "h-20 px-8 text-xl rounded-3xl", 
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`me-2.5 ${size === 'lg' || size === 'xl' ? 'w-6 h-6' : 'w-5 h-5'}`} />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-900 rounded-3xl p-5 ${onClick ? 'active:bg-slate-800 transition-colors cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ms-1">{label}</label>}
    <input 
      className={`w-full bg-slate-800/50 text-slate-100 text-lg rounded-2xl h-14 px-4 placeholder:text-slate-600 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

export const BackButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const rtl = isRTL();
  
  return (
    <button
      onClick={() => navigate(-1)}
      className={`p-2.5 -ms-2 rounded-full text-slate-400 active:bg-slate-800 active:text-slate-100 transition-colors ${className}`}
      aria-label="Go back"
    >
      {rtl ? <ChevronRight className="w-7 h-7" strokeWidth={2.5} /> : <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />}
    </button>
  );
};

export const ScreenHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="flex items-center gap-2 mb-6 pt-2">
      <BackButton />
      <h2 className="text-3xl font-bold text-slate-100 flex-1 tracking-tight">{title}</h2>
      {children}
    </div>
  );
};

export const SegmentedControl: React.FC<{
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}> = ({ options, value, onChange }) => {
  return (
    <div className="bg-slate-900 p-1.5 rounded-2xl flex relative z-0">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${
              isActive ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {opt.label}
            {isActive && (
              <div className="absolute inset-0 bg-slate-800 rounded-xl -z-10 shadow-md transform transition-transform" />
            )}
          </button>
        );
      })}
    </div>
  );
};
