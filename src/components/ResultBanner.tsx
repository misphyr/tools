"use client";

import React, { ReactNode } from 'react';

interface ResultBannerProps {
  isValid: boolean;
  title: string;
  children?: ReactNode;
}

const ResultBanner: React.FC<ResultBannerProps> = ({ isValid, title, children }) => {
  const toneClasses = isValid
    ? { box: 'border-success/60 bg-success/10 text-success', divider: 'border-success/25' }
    : { box: 'border-danger/60 bg-danger/10 text-danger', divider: 'border-danger/25' };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-[10px] border px-4 py-3 animate-fade-in ${toneClasses.box}`}
    >
      <p className="flex items-center gap-2 font-semibold">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {isValid ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6L6 18" />}
        </svg>
        {title}
      </p>
      {children && (
        <div className={`mt-3 pt-3 border-t ${toneClasses.divider} text-fg`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ResultBanner;
