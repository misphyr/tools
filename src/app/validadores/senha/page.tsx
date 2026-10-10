'use client';

import React, { useMemo, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import StatCard from '@/components/StatCard';

const commonPasswords = new Set([
  '123456', '123456789', '12345678', '12345', '1234567', '1234567890', '123123', '111111', '000000', '654321',
  'password', 'password1', 'senha', 'senha123', 'qwerty', 'qwerty123', 'abc123', 'iloveyou', 'admin', 'admin123',
  'welcome', 'letmein', 'monkey', 'dragon', 'football', 'futebol', 'brasil', 'flamengo', 'corinthians', 'palmeiras',
  'saopaulo', 'gremio', 'vasco', 'botafogo', 'santos', 'cruzeiro', 'internacional', 'mudar123', 'teste', 'teste123',
  'amor', 'deus', 'jesus', 'princesa', 'gabriel', 'lucas', 'mariana', 'master', 'sunshine', 'superman', 'batman',
  'trustno1', 'whatever', 'starwars', 'pokemon', 'naruto', 'minecraft', 'p@ssw0rd', 'passw0rd', '1q2w3e4r', '1q2w3e',
  'qazwsx', 'asdfgh', 'zxcvbn', 'asdf1234', 'abcd1234', 'aa123456', 'q1w2e3r4', 'changeme', 'root', 'toor',
]);

const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', 'abcdefghijklmnopqrstuvwxyz'];

// Desfaz substituições comuns (p@ssw0rd → password) para comparar com a lista
const leetMap: Record<string, string> = { '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '$': 's', '5': 's', '7': 't' };
const unLeet = (text: string) => text.toLowerCase().replace(/[@4310!$57]/g, (char) => leetMap[char] ?? char);

// Conta caracteres que fazem parte de sequências (abc, 321, qwe) ou repetições (aaa) de 3 ou mais
const countPatternChars = (password: string) => {
  const lower = password.toLowerCase();
  const flagged = new Array(lower.length).fill(false);

  for (let i = 0; i + 2 < lower.length; i++) {
    const chunk = lower.slice(i, i + 3);
    const isRepeat = chunk[0] === chunk[1] && chunk[1] === chunk[2];
    const isSequence = keyboardRows.some((row) => {
      const reversed = row.split('').reverse().join('');
      return row.includes(chunk) || reversed.includes(chunk);
    });
    if (isRepeat || isSequence) flagged.fill(true, i, i + 3);
  }
  return flagged.filter(Boolean).length;
};

const analyzePassword = (password: string) => {
  const checks = {
    length: password.length >= 12,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9\s]/.test(password),
  };

  let poolSize = 0;
  if (checks.lower) poolSize += 26;
  if (checks.upper) poolSize += 26;
  if (checks.digit) poolSize += 10;
  if (checks.symbol) poolSize += 33;
  if (/\s/.test(password)) poolSize += 1;
  if (/[^\x00-\x7F]/.test(password)) poolSize += 50;

  const bitsPerChar = poolSize > 0 ? Math.log2(poolSize) : 0;
  const warnings: string[] = [];
  let entropy = password.length * bitsPerChar;

  const patternChars = countPatternChars(password);
  if (patternChars > 0) {
    entropy -= patternChars * bitsPerChar * 0.75;
    warnings.push('Evite sequências e repetições (abc, 123, qwerty, aaa).');
  }

  const uniqueRatio = new Set(password).size / Math.max(1, password.length);
  if (password.length > 4 && uniqueRatio < 0.5) {
    entropy *= 0.7;
    warnings.push('Muitos caracteres repetidos.');
  }

  if (/(19|20)\d{2}/.test(password)) {
    entropy -= 6;
    warnings.push('Anos e datas são fáceis de adivinhar.');
  }

  // Também pega variações com sufixo numérico ou símbolo no fim (brasil2024, senha123!)
  const lower = password.toLowerCase();
  const withoutSuffix = lower.replace(/[\d!@#$%*.]+$/, '');
  const isCommon = [lower, unLeet(lower), withoutSuffix, unLeet(withoutSuffix)].some((variant) => commonPasswords.has(variant));
  if (isCommon) {
    entropy = Math.min(entropy, 10);
    warnings.unshift('Essa senha (ou uma variação dela) está entre as mais usadas.');
  }

  entropy = Math.max(0, entropy);

  let score: number;
  if (entropy < 28) score = 0;
  else if (entropy < 40) score = 1;
  else if (entropy < 60) score = 2;
  else if (entropy < 80) score = 3;
  else score = 4;

  return { checks, entropy, score, warnings };
};

// Tempo médio para quebrar: metade do espaço de busca
const formatCrackTime = (entropy: number, guessesPerSecond: number) => {
  const seconds = Math.pow(2, Math.max(0, entropy - 1)) / guessesPerSecond;
  if (seconds < 1) return 'instantâneo';
  const units: [number, string, string][] = [
    [60, 'segundo', 'segundos'],
    [60, 'minuto', 'minutos'],
    [24, 'hora', 'horas'],
    [365.25, 'dia', 'dias'],
    [100, 'ano', 'anos'],
    [10, 'século', 'séculos'],
  ];
  let value = seconds;
  for (const [limit, singular, plural] of units) {
    if (value < limit) {
      const rounded = Math.floor(value);
      return `${rounded} ${rounded === 1 ? singular : plural}`;
    }
    value /= limit;
  }
  return 'milênios';
};

const levels = [
  { label: 'Muito fraca', textClass: 'text-danger', barClass: 'bg-danger' },
  { label: 'Fraca', textClass: 'text-danger', barClass: 'bg-danger' },
  { label: 'Razoável', textClass: 'text-warning', barClass: 'bg-warning' },
  { label: 'Forte', textClass: 'text-success', barClass: 'bg-success' },
  { label: 'Muito forte', textClass: 'text-success', barClass: 'bg-success' },
];

const sha1Hex = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

type LeakStatus = { state: 'idle' } | { state: 'loading' } | { state: 'done'; count: number } | { state: 'error' };

const PasswordStrengthPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [leakStatus, setLeakStatus] = useState<LeakStatus>({ state: 'idle' });

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const level = levels[analysis.score];

  const handleChange = (value: string) => {
    setPassword(value);
    setLeakStatus({ state: 'idle' });
  };

  // k-anonimato: só os 5 primeiros caracteres do SHA-1 saem do navegador
  const checkLeaks = async () => {
    setLeakStatus({ state: 'loading' });
    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { 'Add-Padding': 'true' } });
      if (!response.ok) throw new Error();
      const body = await response.text();
      const line = body.split('\n').find((row) => row.startsWith(suffix));
      setLeakStatus({ state: 'done', count: line ? Number(line.split(':')[1]) : 0 });
    } catch {
      setLeakStatus({ state: 'error' });
    }
  };

  const checklist = [
    { label: 'Pelo menos 12 caracteres', ok: analysis.checks.length },
    { label: 'Letras minúsculas', ok: analysis.checks.lower },
    { label: 'Letras maiúsculas', ok: analysis.checks.upper },
    { label: 'Números', ok: analysis.checks.digit },
    { label: 'Símbolos', ok: analysis.checks.symbol },
  ];

  return (
    <ToolPage
      title="Força de Senha"
      description="Avalie a força de uma senha com estimativa de entropia e tempo para quebrar. A análise acontece no seu navegador"
      category="validadores"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Digite uma senha para avaliar"
              autoComplete="off"
              spellCheck={false}
              className="input-modern font-mono text-lg !pr-24"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="btn-secondary btn-sm !absolute right-2 top-1/2 -translate-y-1/2"
            >
              {isVisible ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-1.5" aria-hidden>
              {levels.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-colors ${password && index <= analysis.score ? level.barClass : 'bg-bg border border-line'}`}
                />
              ))}
            </div>
            <p className={`font-semibold ${password ? level.textClass : 'text-muted'}`} role="status">
              {password ? level.label : 'Aguardando senha...'}
            </p>
          </div>
        </div>

        {password && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard value={`${Math.round(analysis.entropy)} bits`} label="Entropia estimada" />
              <StatCard value={formatCrackTime(analysis.entropy, 1e10)} label="Ataque offline (10 bi/s)" color="amber" />
              <StatCard value={formatCrackTime(analysis.entropy, 100 / 3600)} label="Ataque online (100/h)" color="blue" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-modern">
                <h3 className="text-lg font-semibold text-fg mb-3">Critérios</h3>
                <ul className="space-y-2">
                  {checklist.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <svg className={`w-4 h-4 shrink-0 ${item.ok ? 'text-success' : 'text-muted'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {item.ok ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6L6 18" />}
                      </svg>
                      <span className={item.ok ? 'text-fg' : 'text-muted'}>{item.label}</span>
                    </li>
                  ))}
                  <li className="text-sm text-muted pt-1">{password.length} caracteres</li>
                </ul>
              </div>

              <div className="card-modern">
                <h3 className="text-lg font-semibold text-fg mb-3">Avisos</h3>
                {analysis.warnings.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {analysis.warnings.map((warning) => (
                      <li key={warning} className="text-warning">• {warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-success">Nenhum padrão óbvio encontrado.</p>
                )}
              </div>
            </div>

            <div className="card-modern space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-fg">Vazamentos conhecidos</h3>
                  <p className="text-sm text-muted">
                    Consulta o Have I Been Pwned. Só os 5 primeiros caracteres do hash SHA-1 são enviados; a senha nunca sai do navegador.
                  </p>
                </div>
                <button onClick={checkLeaks} className="btn-info" disabled={leakStatus.state === 'loading'}>
                  {leakStatus.state === 'loading' ? 'Verificando...' : 'Verificar vazamentos'}
                </button>
              </div>
              {leakStatus.state === 'done' && (
                <div className={`notice text-sm ${leakStatus.count > 0 ? 'notice-error text-danger' : 'notice-success text-success'}`}>
                  {leakStatus.count > 0
                    ? `Essa senha apareceu ${leakStatus.count.toLocaleString('pt-BR')} vezes em vazamentos. Não use.`
                    : 'Essa senha não aparece em vazamentos conhecidos.'}
                </div>
              )}
              {leakStatus.state === 'error' && (
                <div className="notice notice-warning text-sm text-warning">Não foi possível consultar o serviço agora.</div>
              )}
            </div>
          </>
        )}
      </div>
    </ToolPage>
  );
};

export default PasswordStrengthPage;
