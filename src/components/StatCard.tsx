"use client";

import React from 'react';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'cyan';
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color = 'violet', icon }) => {
  const colorClasses = {
    blue: 'text-info',
    violet: 'text-accent',
    green: 'text-success',
    amber: 'text-warning',
    red: 'text-danger',
    cyan: 'text-info',
  };

  return (
    <div className="card-modern !p-4 text-center">
      {icon && (
        <div className="text-2xl mb-2">{icon}</div>
      )}
      <div className={`font-mono text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted mt-1">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
