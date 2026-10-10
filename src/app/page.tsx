// src/app/page.tsx
import React from 'react';
import Link from "next/link";
import { toolSections, toolCount } from '../data/tools';

const HomePage: React.FC = () => {
  return (
    <div className="pb-8">
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 animate-fade-in">
        <p className="font-mono text-accent text-sm">~/tools.misphyr</p>
        <h1 className="mt-3 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Ferramentas pequenas<br />
          para o <span className="text-accent">dia a dia</span>.
        </h1>
        <p className="mt-5 max-w-xl text-muted text-lg">
          Formatadores, geradores e validadores pensados para dev e QA.
          Tudo roda no navegador, sem cadastro.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {toolSections.map((section) => (
            <a key={section.category} href={`#${section.category}`} className="tag hover:bg-accent/20 transition-colors">
              {section.label}
              <span className="text-muted">{section.tools.length}</span>
            </a>
          ))}
          <span className="tag !bg-transparent !text-muted">{toolCount} ferramentas</span>
        </div>
      </section>

      {/* Tools Grid */}
      <div className="space-y-14">
        {toolSections.map((section, sectionIndex) => (
          <section key={section.category} id={section.category} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight mb-5">
              <span className="font-mono text-base text-accent mr-2">0{sectionIndex + 1}.</span>
              {section.label}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="group card-modern flex items-start gap-4 !p-4 transition-colors hover:bg-surface-hover hover:border-accent"
                >
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="font-semibold">{tool.title}</strong>
                      <span className="text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden>→</span>
                    </span>
                    <span className="block text-sm text-muted mt-0.5">{tool.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Section */}
      <footer className="mt-20 pt-8 border-t border-line flex flex-wrap justify-between gap-2 text-sm text-muted">
        <span>
          Feito por <a href="https://misphyr.com" className="text-fg hover:text-accent transition-colors">Misphyr</a>
        </span>
        <span className="font-mono">misphyr.tools</span>
      </footer>
    </div>
  );
};

export default HomePage;
