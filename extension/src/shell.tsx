import React, { Suspense, useEffect, useState } from 'react';
import { ToolPageCompactContext } from '@/components/ToolPage';
import {
  canOpenSidePanel,
  extensionApi,
  extensionSections,
  findTool,
  openInSidePanel,
  openInTab,
  toolPages,
} from './tools';
import { Theme, applyTheme, getCurrentTheme } from './theme';

export type ShellVariant = 'popup' | 'panel' | 'tab';

const lastToolKey = 'lastTool';

const readHashPath = () => window.location.hash.replace(/^#/, '') || '/';

const useHashPath = () => {
  const [path, setPath] = useState(readHashPath);
  useEffect(() => {
    const onHashChange = () => setPath(readHashPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return path;
};

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const iconProps = {
  className: 'w-4 h-4',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const ThemeButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);
  const iconSize = small ? 'w-4 h-4' : 'w-5 h-5';

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`btn-secondary ${small ? '!p-1.5' : '!p-2'}`}
      aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
    >
      {theme === 'dark' ? (
        <svg {...iconProps} className={iconSize}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg {...iconProps} className={iconSize}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

const Brand: React.FC<{ large?: boolean }> = ({ large }) => (
  <a href="#/" className={`font-mono font-bold text-accent tracking-tight hover:text-accent-strong transition-colors ${large ? 'text-lg' : ''}`}>
    tools<span className="text-muted">.misphyr</span>
  </a>
);

const favoritesKey = 'favoriteTools';

const readFavorites = (): string[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) ?? '[]');
    return Array.isArray(saved) ? saved.filter((path) => typeof path === 'string' && path in toolPages) : [];
  } catch {
    return [];
  }
};

// Favoritos ficam no localStorage da extensão, compartilhado entre popup, painel e aba
const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === favoritesKey) setFavorites(readFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = (path: string) => {
    const next = favorites.includes(path) ? favorites.filter((item) => item !== path) : [...favorites, path];
    setFavorites(next);
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(next));
    } catch {
      // sem armazenamento, o favorito vale só enquanto a página está aberta
    }
  };

  return { favorites, toggleFavorite };
};

interface ListTool {
  title: string;
  description: string;
  path: string;
}

const CompactItem: React.FC<{ tool: ListTool; favorite: boolean; onToggleFavorite: () => void }> = ({ tool, favorite, onToggleFavorite }) => (
  <li className="group flex items-center rounded-lg transition-colors hover:bg-surface-hover focus-within:bg-surface-hover">
    <a href={`#${tool.path}`} className="flex-1 min-w-0 px-2 py-1.5 rounded-lg">
      <span className="block text-[0.92rem] font-medium">{tool.title}</span>
      <span className="block text-xs text-muted">{tool.description}</span>
    </a>
    <button
      onClick={onToggleFavorite}
      className={`shrink-0 p-2 mr-1 rounded-lg transition-[color,opacity] hover:text-accent ${favorite
        ? 'text-accent'
        : 'text-muted opacity-40 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      aria-pressed={favorite}
      aria-label={favorite ? `Desfavoritar ${tool.title}` : `Favoritar ${tool.title}`}
      title={favorite ? 'Desfavoritar' : 'Favoritar'}
    >
      <svg {...iconProps} fill={favorite ? 'currentColor' : 'none'}>
        <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.77l-5.2 2.75.99-5.8-4.21-4.1 5.82-.85L12 3.5z" />
      </svg>
    </button>
  </li>
);

// Lista com busca usada no popup e no painel lateral
const CompactList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite } = useFavorites();
  const term = normalize(search.trim());

  const matchesSearch = (tool: ListTool, singular: string) => !term || normalize(`${singular} ${tool.title} ${tool.description}`).includes(term);

  // Favoritos sobem para o topo, na ordem em que foram marcados, e saem da seção de origem
  const favoriteTools = favorites.flatMap((path): ListTool[] => {
    const section = extensionSections.find((item) => item.tools.some((tool) => tool.path === path));
    const tool = section?.tools.find((item) => item.path === path);
    return tool && section && matchesSearch(tool, section.singular) ? [tool] : [];
  });

  const sections = [
    ...(favoriteTools.length > 0 ? [{ category: 'favoritos', label: 'Favoritos', tools: favoriteTools }] : []),
    ...extensionSections.map((section) => ({
      category: section.category as string,
      label: section.label,
      tools: section.tools.filter((tool) => !favorites.includes(tool.path) && matchesSearch(tool, section.singular)),
    })),
  ].filter((section) => section.tools.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const firstTool = sections[0]?.tools[0];
    if (firstTool) window.location.hash = firstTool.path;
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ferramenta..."
          aria-label="Buscar ferramenta"
          className="input-modern !py-2"
        />
      </form>
      <nav className="space-y-3">
        {sections.map((section) => (
          <div key={section.category} className="space-y-1">
            <h2 className="eyebrow px-2">{section.label}</h2>
            <ul>
              {section.tools.map((tool) => (
                <CompactItem
                  key={tool.path}
                  tool={tool}
                  favorite={favorites.includes(tool.path)}
                  onToggleFavorite={() => toggleFavorite(tool.path)}
                />
              ))}
            </ul>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="px-2 py-4 text-sm text-muted text-center">Nenhuma ferramenta encontrada.</p>
        )}
      </nav>
    </div>
  );
};

// Grade de cartões usada na aba
const GridList: React.FC = () => (
  <div className="py-10 sm:py-14 space-y-12 animate-fade-in">
    <div>
      <p className="font-mono text-accent text-sm">~/misphyr.tools</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Ferramentas de teste</h1>
      <p className="mt-3 text-muted text-lg">Geradores e validadores do dia a dia, direto do navegador.</p>
    </div>
    {extensionSections.map((section, sectionIndex) => (
      <section key={section.category}>
        <h2 className="text-2xl font-semibold tracking-tight mb-5">
          <span className="font-mono text-base text-accent mr-2">0{sectionIndex + 1}.</span>
          {section.label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.tools.map((tool) => (
            <a
              key={tool.path}
              href={`#${tool.path}`}
              className="group card-modern flex items-start gap-4 !p-4 transition-colors hover:bg-surface-hover hover:border-accent"
            >
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <strong className="font-semibold">{tool.title}</strong>
                  <span className="text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden>→</span>
                </span>
                <span className="block text-sm text-muted mt-0.5">{tool.description}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    ))}
  </div>
);

interface CompactHeaderProps {
  variant: ShellVariant;
  path: string;
  windowId?: number;
}

const CompactHeader: React.FC<CompactHeaderProps> = ({ variant, path, windowId }) => (
  <header className="sticky top-0 z-50 glass border-b border-line">
    <div className="h-12 px-3 flex items-center justify-between gap-2">
      {path in toolPages ? (
        <a href="#/" className="flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors">
          <svg {...iconProps}><path d="M15 18l-6-6 6-6" /></svg>
          Ferramentas
        </a>
      ) : <Brand />}
      <div className="flex items-center gap-1.5">
        {variant === 'popup' && canOpenSidePanel() && (
          <button
            onClick={() => openInSidePanel(path, windowId)}
            className="btn-secondary !p-1.5"
            title="Abrir no painel lateral"
            aria-label="Abrir no painel lateral"
          >
            <svg {...iconProps}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg>
          </button>
        )}
        <button
          onClick={() => openInTab(path)}
          className="btn-secondary !p-1.5"
          title="Abrir em uma aba"
          aria-label="Abrir em uma aba"
        >
          <svg {...iconProps}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
        </button>
        <ThemeButton small />
      </div>
    </div>
  </header>
);

const TabHeader: React.FC = () => (
  <header className="sticky top-0 z-50 w-full glass border-b border-line">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
      <Brand large />
      <ThemeButton />
    </div>
  </header>
);

const ExtensionShell: React.FC<{ variant: ShellVariant }> = ({ variant }) => {
  const path = useHashPath();
  const Page = toolPages[path];
  const [windowId, setWindowId] = useState<number>();

  useEffect(() => {
    const tool = findTool(path);
    document.title = tool ? `${tool.title} · misphyr.tools` : 'misphyr.tools';
    document.body.classList.toggle('popup-tool', variant === 'popup' && Boolean(tool));
    window.scrollTo(0, 0);
    if (variant === 'popup') {
      try {
        localStorage.setItem(lastToolKey, path);
      } catch {
        // sem armazenamento, o popup sempre abre na lista
      }
    }
  }, [path, variant]);

  useEffect(() => {
    // O popup volta na última ferramenta usada, já que fecha ao clicar fora
    if (variant === 'popup') {
      try {
        const lastTool = localStorage.getItem(lastToolKey);
        if (readHashPath() === '/' && lastTool && lastTool in toolPages) window.location.hash = lastTool;
      } catch {
        // segue na lista
      }
    }

    const api = extensionApi();
    if (!api) return;

    if (variant === 'popup') {
      api.windows.getCurrent().then((currentWindow) => setWindowId(currentWindow.id)).catch(() => undefined);
    }

    // O painel lateral troca de ferramenta quando o popup pede
    if (variant === 'panel') {
      const onMessage = (message: ExtensionMessage) => {
        if (message?.type === 'open-tool') window.location.hash = message.path;
      };
      api.runtime.onMessage.addListener(onMessage);
      return () => api.runtime.onMessage.removeListener(onMessage);
    }
  }, [variant]);

  const content = Page ? (
    <Suspense fallback={<p className="py-6 text-sm text-muted">Carregando...</p>}>
      <Page key={path} />
    </Suspense>
  ) : null;

  if (variant === 'tab') {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <TabHeader />
        <main className="flex-1 w-full">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
            {content ?? <GridList />}
          </div>
        </main>
      </div>
    );
  }

  return (
    <ToolPageCompactContext.Provider value>
      <CompactHeader variant={variant} path={path} windowId={windowId} />
      <main className="px-3 pb-4">
        {content ?? <div className="pt-3"><CompactList /></div>}
      </main>
    </ToolPageCompactContext.Provider>
  );
};

export default ExtensionShell;
