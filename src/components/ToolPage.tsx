"use client";

import React, { ReactNode, createContext, useContext } from 'react';
import Link from 'next/link';
import { toolSections, ToolCategory } from '../data/tools';

// Versão enxuta (sem navegação e rodapé) para espaços pequenos, como o popup da extensão
export const ToolPageCompactContext = createContext(false);

interface ToolPageProps {
  title: string;
  description: string;
  category: ToolCategory;
  children: ReactNode;
}

const ToolPage: React.FC<ToolPageProps> = ({
  title,
  description,
  category,
  children
}) => {
  const section = toolSections.find((item) => item.category === category);
  const compact = useContext(ToolPageCompactContext);

  if (compact) {
    return (
      <div className="py-4 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <nav className="font-mono text-sm text-muted flex items-center gap-2">
            <Link href="/" className="hover:text-accent transition-colors">início</Link>
            <span aria-hidden>/</span>
            <Link href={`/#${category}`} className="hover:text-accent transition-colors">
              {section?.label.toLowerCase()}
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            {description}
          </p>
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          {children}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-line flex flex-wrap justify-between gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">← Todas as ferramentas</Link>
          <span>
            {section?.singular} · por <a href="https://misphyr.com" className="text-fg hover:text-accent transition-colors">Misphyr</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
