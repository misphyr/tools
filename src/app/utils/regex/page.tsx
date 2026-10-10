'use client';

import React, { useMemo, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import StatCard from '@/components/StatCard';

const maxMatches = 1000;

const flagOptions = [
  { flag: 'g', label: 'global' },
  { flag: 'i', label: 'ignorar maiúsc./minúsc.' },
  { flag: 'm', label: 'multilinha' },
  { flag: 's', label: 'ponto pega quebra de linha' },
  { flag: 'u', label: 'unicode' },
];

const examples = [
  { label: 'E-mail', pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.-]+' },
  { label: 'CPF', pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}' },
  { label: 'Data', pattern: '(?<dia>\\d{2})/(?<mes>\\d{2})/(?<ano>\\d{4})' },
  { label: 'URL', pattern: 'https?://[^\\s]+' },
];

const sampleText = `Contato: lyt@misphyr.com, suporte@exemplo.com.br
CPF: 123.456.789-09 — nascido em 15/03/1998
Site: https://misphyr.com`;

interface MatchInfo {
  index: number;
  value: string;
  groups: (string | undefined)[];
  namedGroups?: Record<string, string | undefined>;
}

const RegexTesterPage: React.FC = () => {
  const [pattern, setPattern] = useState('[\\w.+-]+@[\\w-]+\\.[\\w.-]+');
  const [flags, setFlags] = useState('gi');
  const [testText, setTestText] = useState(sampleText);
  const [replacement, setReplacement] = useState('');

  const toggleFlag = (flag: string) => {
    setFlags((current) => (current.includes(flag) ? current.replace(flag, '') : current + flag));
  };

  const result = useMemo(() => {
    if (!pattern) return { error: '', matches: [] as MatchInfo[], replaced: '' };
    try {
      const regex = new RegExp(pattern, flags);
      // Lista sempre todas as ocorrências; a flag g só muda o resultado da substituição
      const listRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const matches: MatchInfo[] = [];
      for (const match of testText.matchAll(listRegex)) {
        matches.push({ index: match.index ?? 0, value: match[0], groups: match.slice(1), namedGroups: match.groups });
        if (matches.length >= maxMatches || !flags.includes('g')) break;
      }
      const replaced = replacement ? testText.replace(regex, replacement) : '';
      return { error: '', matches, replaced };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Expressão inválida', matches: [] as MatchInfo[], replaced: '' };
    }
  }, [pattern, flags, testText, replacement]);

  const highlighted = useMemo(() => {
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    result.matches.forEach((match, i) => {
      if (match.value === '') return;
      if (match.index > cursor) parts.push(testText.slice(cursor, match.index));
      parts.push(
        <mark key={i} className={`rounded-sm text-fg ${i % 2 === 0 ? 'bg-accent/30' : 'bg-info/30'}`}>
          {match.value}
        </mark>,
      );
      cursor = match.index + match.value.length;
    });
    parts.push(testText.slice(cursor));
    return parts;
  }, [result.matches, testText]);

  return (
    <ToolPage
      title="Testador de RegEx"
      description="Teste expressões regulares JavaScript em tempo real, com destaque das ocorrências, grupos e substituição"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <label className="block space-y-2">
            <span className="eyebrow block">Expressão regular</span>
            <div className={`flex items-center rounded-[10px] border bg-bg font-mono ${result.error ? 'border-danger' : 'border-line-strong focus-within:border-accent'}`}>
              <span className="pl-4 text-muted">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="seu padrão aqui"
                spellCheck={false}
                className="flex-1 min-w-0 bg-transparent px-2 py-3 outline-none text-fg"
              />
              <span className="pr-4 text-muted">/{flags}</span>
            </div>
          </label>
          {result.error && <p className="text-danger text-sm font-mono">{result.error}</p>}

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {flagOptions.map((option) => (
              <label key={option.flag} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={flags.includes(option.flag)}
                  onChange={() => toggleFlag(option.flag)}
                  className="checkbox-modern"
                />
                <span><code className="text-accent">{option.flag}</code> <span className="text-muted">{option.label}</span></span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Exemplos:</span>
            {examples.map((example) => (
              <button key={example.label} onClick={() => setPattern(example.pattern)} className="btn-secondary btn-sm">
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-modern space-y-3">
          <span className="eyebrow block">Texto de teste</span>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Cole aqui o texto que será testado..."
            spellCheck={false}
            className="input-modern h-36 font-mono text-sm"
          />
          <span className="eyebrow block pt-2">Ocorrências destacadas</span>
          <pre className="panel-output max-h-72 overflow-auto font-mono text-sm whitespace-pre-wrap break-words">
            {testText ? highlighted : <span className="text-muted">—</span>}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard value={result.matches.length >= maxMatches ? `${maxMatches}+` : result.matches.length} label="Ocorrências" />
          <StatCard value={result.matches[0]?.groups.length ?? 0} label="Grupos" color="blue" />
        </div>

        {result.matches.length > 0 && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-fg mb-4">Detalhes</h3>
            <div className="panel-output !p-0 max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted border-b border-line">
                  <tr>
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-4 py-2 font-medium">Posição</th>
                    <th className="px-4 py-2 font-medium">Valor</th>
                    <th className="px-4 py-2 font-medium">Grupos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono">
                  {result.matches.map((match, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-muted">{i + 1}</td>
                      <td className="px-4 py-2 text-muted">{match.index}</td>
                      <td className="px-4 py-2 break-all">{match.value || <span className="text-muted">(vazio)</span>}</td>
                      <td className="px-4 py-2 break-all">
                        {match.namedGroups
                          ? Object.entries(match.namedGroups).map(([name, value]) => (
                            <div key={name}><span className="text-accent">{name}</span>: {value ?? '—'}</div>
                          ))
                          : match.groups.map((group, g) => (
                            <div key={g}><span className="text-accent">${g + 1}</span>: {group ?? '—'}</div>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card-modern space-y-3">
          <label className="block space-y-2">
            <span className="eyebrow block">Substituir por (opcional)</span>
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="Ex.: [$1] ou $<ano>-$<mes>-$<dia>"
              spellCheck={false}
              className="input-modern font-mono"
            />
          </label>
          {replacement && !result.error && (
            <>
              <pre className="panel-output max-h-72 overflow-auto font-mono text-sm whitespace-pre-wrap break-words">{result.replaced}</pre>
              <CopyButton text={result.replaced} label="Copiar resultado" />
            </>
          )}
        </div>
      </div>
    </ToolPage>
  );
};

export default RegexTesterPage;
