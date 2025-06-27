"use client";

import React, { ReactNode } from 'react';

interface ToolPageProps {
  title: string;
  description: string;
  icon: string;
  category: 'utils' | 'geradores' | 'validadores';
  children: ReactNode;
}

const categoryConfig = {
  utils: {
    color: 'blue',
    label: 'Utilitário',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-300'
  },
  geradores: {
    color: 'green',
    label: 'Gerador',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-300'
  },
  validadores: {
    color: 'orange',
    label: 'Validador',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-300'
  }
};

const ToolPage: React.FC<ToolPageProps> = ({ 
  title, 
  description, 
  icon, 
  category, 
  children 
}) => {
  const config = categoryConfig[category];

  return (
    <div className="min-h-screen py-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center px-4 py-2 ${config.bgColor} rounded-full border ${config.borderColor} backdrop-blur-sm`}>
            <span className={`${config.textColor} text-sm font-medium`}>
              {icon} {config.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-700/50">
          <div className="inline-flex items-center space-x-2 text-slate-400">
            <span>Desenvolvido por</span>
            <span className="font-semibold text-slate-300">Misphyr</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
