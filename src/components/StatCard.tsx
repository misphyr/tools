"use client";

import React from 'react';

interface StatCardProps {
  value: number | string;
  label: string;
  color: 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'cyan';
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color, icon }) => {
  const colorClasses = {
    blue: 'text-blue-400 from-blue-500/20 to-blue-600/20 border-blue-500/30',
    violet: 'text-violet-400 from-violet-500/20 to-violet-600/20 border-violet-500/30',
    green: 'text-green-400 from-green-500/20 to-green-600/20 border-green-500/30',
    amber: 'text-amber-400 from-amber-500/20 to-amber-600/20 border-amber-500/30',
    red: 'text-red-400 from-red-500/20 to-red-600/20 border-red-500/30',
    cyan: 'text-cyan-400 from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  };

  const colorClass = colorClasses[color];

  return (
    <div className={`relative overflow-hidden backdrop-filter backdrop-blur-16 bg-gradient-to-br ${colorClass} border rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {icon && (
          <div className="text-2xl mb-2">{icon}</div>
        )}
        <div className={`text-2xl font-bold ${colorClass.split(' ')[0]}`}>
          {value}
        </div>
        <div className="text-sm text-slate-400 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
