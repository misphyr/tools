"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolSections } from '../data/tools';

type Theme = 'dark' | 'light';

const getCurrentTheme = (): Theme => {
  const forced = document.documentElement.dataset.theme;
  if (forced === 'light' || forced === 'dark') return forced;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const Bar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const pathname = usePathname();

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // armazenamento indisponível: o tema vale só para esta visita
    }
    setTheme(nextTheme);
  };

  const avatarUrl = `https://images-ext-1.discordapp.net/external/Xn2lWea_w0aioJbDMrEGMsbvJG_PIfL7W3vVsLDEFPE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/343957098184572958/a_d70a5bdb058970076a26788c575730c4.gif`;

  const menuNavigation = (
    <nav className="space-y-7">
      {toolSections.map((section) => (
        <div key={section.category} className="space-y-2">
          <h2 className="eyebrow px-3">{section.label}</h2>
          <ul className="space-y-1">
            {section.tools.map((tool) => {
              const isActive = pathname === tool.path;
              return (
                <li key={tool.path}>
                  <Link
                    href={tool.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[0.92rem] transition-colors ${isActive
                      ? 'bg-accent/10 text-accent-strong'
                      : 'text-muted hover:bg-surface-hover hover:text-fg'
                      }`}
                  >
                    <span>{tool.shortTitle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <aside className="flex flex-col w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="btn-secondary !p-2"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="w-5 h-5"
              >
                {isOpen
                  ? <path d="M6 6l12 12M18 6L6 18" />
                  : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            <Link href="/" className="font-mono font-bold text-accent text-lg tracking-tight hover:text-accent-strong transition-colors">
              misphyr<span className="text-muted">.tools</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn-secondary !p-2"
              aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <a
              href="https://misphyr.com"
              className="flex items-center gap-2 group"
              title="misphyr.com"
            >
              <span className="text-muted text-sm font-medium hidden sm:block group-hover:text-fg transition-colors">Misphyr</span>
              <span
                className="block w-9 h-9 rounded-full border border-line-strong group-hover:border-accent transition-colors"
                style={{
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </a>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-surface border-r border-line shadow-2xl transform transition-[transform,visibility] duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0 visible" : "-translate-x-full invisible"}`}
      >
        <div className="px-3 pt-24 pb-6 overflow-y-auto h-full">
          {menuNavigation}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30"
          onClick={toggleSidebar}
        />
      )}
    </aside>
  );

};

export default Bar;
