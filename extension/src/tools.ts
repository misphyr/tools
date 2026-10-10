import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { toolSections } from '@/data/tools';

// Ferramentas do site que entram na extensão (as de uso diário em testes)
export const toolPages: Record<string, LazyExoticComponent<ComponentType>> = {
  '/utils/caracteres': lazy(() => import('@/app/utils/caracteres/page')),
  '/utils/strings': lazy(() => import('@/app/utils/strings/page')),
  '/utils/indentador': lazy(() => import('@/app/utils/indentador/page')),
  '/utils/lorem': lazy(() => import('@/app/utils/lorem/page')),
  '/utils/base64': lazy(() => import('@/app/utils/base64/page')),
  '/utils/case': lazy(() => import('@/app/utils/case/page')),
  '/utils/datas': lazy(() => import('@/app/utils/datas/page')),
  '/utils/cronometro': lazy(() => import('@/app/utils/cronometro/page')),
  '/utils/unidades': lazy(() => import('@/app/utils/unidades/page')),
  '/geradores/cpf-cnpj': lazy(() => import('@/app/geradores/cpf-cnpj/page')),
  '/geradores/cep': lazy(() => import('@/app/geradores/cep/page')),
  '/geradores/uuid': lazy(() => import('@/app/geradores/uuid/page')),
  '/validadores/cpf-cnpj': lazy(() => import('@/app/validadores/cpf-cnpj/page')),
  '/validadores/cep': lazy(() => import('@/app/validadores/cep/page')),
};

export const extensionSections = toolSections
  .map((section) => ({ ...section, tools: section.tools.filter((tool) => tool.path in toolPages) }))
  .filter((section) => section.tools.length > 0);

export const findTool = (path: string) => extensionSections.flatMap((section) => section.tools).find((tool) => tool.path === path);

// Fora da extensão (ex.: página aberta direto) o Chrome ainda expõe window.chrome, mas sem as APIs
export const extensionApi = () => {
  const api = typeof browser !== 'undefined' ? browser : typeof chrome !== 'undefined' ? chrome : undefined;
  return api?.runtime?.getURL ? api : undefined;
};

export const openInTab = async (path = '/') => {
  const api = extensionApi();
  if (!api) return;
  await api.tabs.create({ url: api.runtime.getURL(`app.html#${path}`) });
  window.close();
};

export const canOpenSidePanel = () => {
  const api = extensionApi();
  return Boolean(api?.sidePanel || api?.sidebarAction);
};

// Precisa rodar direto no clique: Chrome e Firefox só abrem o painel em resposta a uma ação do usuário,
// por isso as chamadas não esperam umas pelas outras
export const openInSidePanel = (path: string, windowId?: number) => {
  const api = extensionApi();
  if (!api) return;
  const panelPath = `panel.html#${path}`;
  if (api.sidePanel && windowId !== undefined) {
    api.sidePanel.setOptions({ path: panelPath, enabled: true }).catch(() => undefined);
    api.sidePanel.open({ windowId }).catch(() => undefined);
  } else if (api.sidebarAction) {
    api.sidebarAction.setPanel({ panel: api.runtime.getURL(panelPath) }).catch(() => undefined);
    api.sidebarAction.open().catch(() => undefined);
  }
  // Se o painel já estava aberto, ele troca de ferramenta por mensagem
  api.runtime.sendMessage({ type: 'open-tool', path }).catch(() => undefined);
  setTimeout(() => window.close(), 150);
};
