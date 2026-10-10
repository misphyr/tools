'use client';

import React, { useEffect, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';
import { md5 } from '@/utils/md5';

type InputMode = 'text' | 'file';

const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algorithm = typeof algorithms[number];

const toHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

const computeHashes = async (bytes: Uint8Array): Promise<Record<Algorithm, string>> => {
  const shaResults = await Promise.all(
    (['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const).map(async (name) => [name, toHex(await crypto.subtle.digest(name, bytes as BufferSource))] as const),
  );
  return { MD5: md5(bytes), ...Object.fromEntries(shaResults) } as Record<Algorithm, string>;
};

const formatBytes = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 ** 2).toFixed(1)} MB`;
};

const HashGeneratorPage: React.FC = () => {
  const [mode, setMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<Algorithm, string> | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [compareValue, setCompareValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Texto: recalcula automaticamente enquanto digita
  useEffect(() => {
    if (mode !== 'text') return;
    let isCancelled = false;
    if (!inputText) {
      setHashes(null);
      return;
    }
    computeHashes(new TextEncoder().encode(inputText))
      .then((result) => { if (!isCancelled) setHashes(result); })
      .catch(() => { if (!isCancelled) setError('Seu navegador não permite calcular hashes nesta página (exige HTTPS).'); });
    return () => { isCancelled = true; };
  }, [inputText, mode]);

  const handleFile = async (selected: File | undefined) => {
    if (!selected) return;
    setFile(selected);
    setIsLoading(true);
    setError('');
    try {
      const bytes = new Uint8Array(await selected.arrayBuffer());
      setHashes(await computeHashes(bytes));
    } catch {
      setError('Não foi possível ler o arquivo.');
      setHashes(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (next: InputMode) => {
    setMode(next);
    setHashes(null);
    setFile(null);
    setError('');
  };

  const normalizedCompare = compareValue.trim().toLowerCase();
  const matchedAlgorithm = hashes && normalizedCompare
    ? algorithms.find((algorithm) => hashes[algorithm] === normalizedCompare)
    : undefined;

  return (
    <ToolPage
      title="Gerador de Hash"
      description="Calcule hashes MD5, SHA-1, SHA-256, SHA-384 e SHA-512 de textos ou arquivos, tudo localmente no navegador"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <SegmentedControl
            ariaLabel="Tipo de entrada"
            options={[{ value: 'text', label: 'Texto' }, { value: 'file', label: 'Arquivo' }]}
            value={mode}
            onChange={handleModeChange}
          />

          {mode === 'text' ? (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite o texto para gerar os hashes..."
              className="input-modern h-32 font-mono text-sm"
            />
          ) : (
            <label className="block border-2 border-dashed border-line-strong rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
              <input type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              <p className="text-fg mb-1">{file ? file.name : 'Clique para selecionar um arquivo'}</p>
              <p className="text-sm text-muted">
                {file ? formatBytes(file.size) : 'O arquivo é processado no seu navegador e não é enviado para lugar nenhum'}
              </p>
            </label>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="checkbox-modern"
            />
            <span className="text-fg">Hexadecimal em maiúsculas</span>
          </label>
        </div>

        {isLoading && <div className="notice notice-info text-sm">Calculando hashes...</div>}
        {error && <div className="notice notice-error text-danger text-sm">{error}</div>}

        {hashes && !isLoading && (
          <div className="space-y-3">
            {algorithms.map((algorithm) => {
              const value = uppercase ? hashes[algorithm].toUpperCase() : hashes[algorithm];
              const isMatch = matchedAlgorithm === algorithm;
              return (
                <div key={algorithm} className={`card-modern !p-4 flex items-center justify-between gap-3 ${isMatch ? '!border-success' : ''}`}>
                  <div className="min-w-0">
                    <span className="eyebrow block">{algorithm}{isMatch && <span className="text-success"> · confere</span>}</span>
                    <code className="text-sm break-all">{value}</code>
                  </div>
                  <CopyButton text={value} label="" className="btn-secondary !p-2 shrink-0" />
                </div>
              );
            })}
          </div>
        )}

        <div className="card-modern space-y-2">
          <label className="block space-y-2">
            <span className="eyebrow block">Comparar com um hash esperado</span>
            <input
              type="text"
              value={compareValue}
              onChange={(e) => setCompareValue(e.target.value)}
              placeholder="Cole o hash para conferir a integridade"
              className="input-modern font-mono text-sm"
            />
          </label>
          {normalizedCompare && hashes && (
            <p className={`text-sm ${matchedAlgorithm ? 'text-success' : 'text-danger'}`}>
              {matchedAlgorithm ? `O hash confere (${matchedAlgorithm}).` : 'Nenhum dos hashes calculados confere.'}
            </p>
          )}
        </div>

        <div className="notice notice-warning text-sm">
          MD5 e SHA-1 servem para checar integridade, mas não são seguros para guardar senhas.
        </div>
      </div>
    </ToolPage>
  );
};

export default HashGeneratorPage;
