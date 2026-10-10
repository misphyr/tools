/// <reference types="vite/client" />

// Só o pedaço da API de extensões usado aqui (chrome.* no Chrome, browser.* no Firefox)
interface ExtensionMessage {
  type: 'open-tool';
  path: string;
}

interface ExtensionApi {
  runtime: {
    getURL: (path: string) => string;
    sendMessage: (message: ExtensionMessage) => Promise<unknown>;
    onMessage: {
      addListener: (listener: (message: ExtensionMessage) => void) => void;
      removeListener: (listener: (message: ExtensionMessage) => void) => void;
    };
  };
  tabs: { create: (options: { url: string }) => Promise<unknown> };
  windows: { getCurrent: () => Promise<{ id?: number }> };
  // Chrome
  sidePanel?: {
    setOptions: (options: { path: string; enabled?: boolean }) => Promise<void>;
    open: (options: { windowId: number }) => Promise<void>;
  };
  // Firefox
  sidebarAction?: {
    setPanel: (details: { panel: string }) => Promise<void>;
    open: () => Promise<void>;
  };
}

declare const browser: ExtensionApi | undefined;
declare const chrome: ExtensionApi | undefined;
