'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';
import { downloadText } from '@/utils/downloadText';

type StringTab = 'misto' | 'emojis' | 'acentos' | 'alfabetos' | 'zalgo' | 'invisiveis' | 'longos' | 'injecao' | 'numeros';
type EmojiStyle = 'simples' | 'compostos' | 'texto';
type AccentStyle = 'palavras' | 'letras';
type Script = 'arabe' | 'hebraico' | 'chines' | 'japones' | 'coreano' | 'cirilico' | 'grego' | 'matematico';
type InvisibleChar = 'zwsp' | 'nbsp' | 'bom' | 'rlo' | 'nul' | 'shy' | 'espaco';
type InvisiblePosition = 'pontas' | 'aleatorio' | 'entre';
type LongPattern = 'repetido' | 'lorem' | 'acentos' | 'emojis' | 'semEspaco';
type PayloadGroup = 'sql' | 'html' | 'template' | 'caminho' | 'planilha';

const tabs: { value: StringTab; label: string }[] = [
  { value: 'misto', label: 'Caos' },
  { value: 'emojis', label: 'Emojis' },
  { value: 'acentos', label: 'Acentos' },
  { value: 'alfabetos', label: 'Alfabetos/RTL' },
  { value: 'zalgo', label: 'Zalgo' },
  { value: 'invisiveis', label: 'Invisíveis' },
  { value: 'longos', label: 'Longos' },
  { value: 'injecao', label: 'Injeção' },
  { value: 'numeros', label: 'Números' },
];

// ---------- Fontes de caracteres ----------

const randomInt = (max: number) => Math.floor(Math.random() * max);
const pick = <T,>(items: readonly T[]) => items[randomInt(items.length)];
const fromRange = (start: number, end: number) => String.fromCodePoint(start + randomInt(end - start + 1));

const simpleEmojis = ['😀', '😂', '🥲', '😍', '🤔', '😴', '🤯', '🥳', '😎', '👻', '💩', '🤖', '👍', '👏', '🙏', '💪', '🔥', '✨', '🎉', '🚀', '❤️', '💜', '⭐', '🌈', '🍕', '☕', '🐱', '🐶', '🦄', '🌵', '⚽', '🎮', '💻', '📦', '✅', '❌', '⚠️', '©️', '™️', '#️⃣'];
const composedEmojis = ['👨‍👩‍👧‍👦', '👩‍💻', '🧑🏽‍🚀', '👨🏿‍🍳', '🏳️‍🌈', '🏴‍☠️', '❤️‍🔥', '👋🏻', '👋🏽', '👋🏿', '🤝🏼', '🇧🇷', '🇵🇹', '🇺🇸', '🇯🇵', '1️⃣', '🧔‍♀️', '🐻‍❄️', '😶‍🌫️', '👁️‍🗨️'];
const accentedLetters = Array.from('áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ');
const accentedWords = ['ação', 'coração', 'pão', 'avô', 'órgão', 'útil', 'você', 'também', 'através', 'câmera', 'análise', 'pública', 'código', 'número', 'início', 'função', 'informação', 'saúde', 'água', 'café', 'país', 'três', 'Müller', 'Straße', 'Łódź', 'Ñandú', 'Øresund', "D'Ávila", 'São João', 'pé-de-moleque'];
const symbols = Array.from('!@#$%&*()[]{}<>"\'`\\/|;:,.?~^=+-_€£¥±×÷≠∞√π°§¶•…“”‘’«»');
const asciiLetters = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];

const scriptRanges: Record<Script, { label: string; ranges: [number, number][]; spaced: boolean }> = {
  arabe: { label: 'Árabe', ranges: [[0x0621, 0x064A]], spaced: true },
  hebraico: { label: 'Hebraico', ranges: [[0x05D0, 0x05EA]], spaced: true },
  chines: { label: 'Chinês', ranges: [[0x4E00, 0x62FF]], spaced: false },
  japones: { label: 'Japonês', ranges: [[0x3041, 0x3096], [0x30A1, 0x30FA], [0x4E00, 0x4FFF]], spaced: false },
  coreano: { label: 'Coreano', ranges: [[0xAC00, 0xD7A3]], spaced: true },
  cirilico: { label: 'Cirílico', ranges: [[0x0410, 0x044F]], spaced: true },
  grego: { label: 'Grego', ranges: [[0x0391, 0x03A1], [0x03A3, 0x03C9]], spaced: true },
  matematico: { label: '𝐌𝐚𝐭𝐞𝐦á𝐭𝐢𝐜𝐨', ranges: [[0x1D400, 0x1D433]], spaced: true },
};

const scriptChar = (script: Script) => {
  const range = pick(scriptRanges[script].ranges);
  return fromRange(range[0], range[1]);
};

const invisibleChars: Record<InvisibleChar, { label: string; value: string }> = {
  zwsp: { label: 'Zero-width', value: '\u200B' },
  nbsp: { label: 'NBSP', value: '\u00A0' },
  bom: { label: 'BOM', value: '\uFEFF' },
  rlo: { label: 'Inversor RTL', value: '\u202E' },
  nul: { label: 'Nulo', value: '\u0000' },
  shy: { label: 'Soft hyphen', value: '\u00AD' },
  espaco: { label: 'Espaço', value: ' ' },
};

const combiningMark = () => fromRange(0x0300, 0x036F);

const zalgoText = (text: string, intensity: number) => Array.from(text, (char) => {
  if (/\s/.test(char)) return char;
  const amount = Math.max(1, intensity + randomInt(Math.ceil(intensity / 2) + 1) - Math.floor(intensity / 4));
  return char + Array.from({ length: amount }, combiningMark).join('');
}).join('');

// Gera palavras de 2 a 7 caracteres até chegar no tamanho pedido
const spacedText = (length: number, nextChar: () => string) => {
  let result = '';
  let count = 0;
  let wordLength = 2 + randomInt(6);
  while (count < length) {
    if (wordLength === 0 && count < length - 1) {
      result += ' ';
      wordLength = 2 + randomInt(6);
    } else {
      result += nextChar();
      wordLength = Math.max(0, wordLength - 1);
    }
    count++;
  }
  return result;
};

const chaosSources: { id: string; label: string; generate: () => string }[] = [
  { id: 'letras', label: 'Letras e n\u00FAmeros', generate: () => pick(asciiLetters) },
  { id: 'acentos', label: 'Acentos', generate: () => pick(accentedLetters) },
  { id: 'emojis', label: 'Emojis simples', generate: () => pick(simpleEmojis) },
  { id: 'compostos', label: 'Emojis compostos', generate: () => pick(composedEmojis) },
  { id: 'simbolos', label: 'S\u00EDmbolos e aspas', generate: () => pick(symbols) },
  { id: 'zalgo', label: 'Zalgo', generate: () => pick(asciiLetters) + combiningMark() + combiningMark() },
  { id: 'alfabetos', label: 'Outros alfabetos/RTL', generate: () => scriptChar(pick(Object.keys(scriptRanges) as Script[])) },
  { id: 'invisiveis', label: 'Invis\u00EDveis', generate: () => pick(['\u200B', '\u00A0', '\t', '\u00AD']) },
  { id: 'espacos', label: 'Espa\u00E7os', generate: () => ' ' },
];

const payloads: Record<PayloadGroup, { label: string; items: string[] }> = {
  sql: {
    label: 'SQL',
    items: ["' OR '1'='1' --", "' OR 1=1#", "Robert'); DROP TABLE alunos;--", "1; SELECT pg_sleep(5)--", "admin'--", "\" OR \"\"=\""],
  },
  html: {
    label: 'HTML/XSS',
    items: ['<script>alert(1)</script>', '"><img src=x onerror=alert(1)>', "javascript:alert('xss')", '<svg onload=alert(1)>', '<b>negrito</b> <i>itálico</i>', '&lt;escapado&gt; &amp; &quot;'],
  },
  template: {
    label: 'Template',
    items: ['{{7*7}}', '${7*7}', '<%= 7*7 %>', '#{7*7}', '{{constructor.constructor("alert(1)")()}}', '%s%s%s%n %d %x'],
  },
  caminho: {
    label: 'Caminho/URL',
    items: ['../../../etc/passwd', '..\\..\\windows\\win.ini', '/dev/null', 'C:\\CON\\nul.txt', 'file:///etc/passwd', 'http://localhost:22/'],
  },
  planilha: {
    label: 'Planilha/CSV',
    items: ['=SUM(1+1)', "=cmd|' /C calc'!A0", '+1+1', '-1+1', '@SUM(1,1)', '"campo, com vírgula"'],
  },
};

const weirdNumbers = [
  '0', '-0', '00001', '-1', '2147483647', '2147483648', '-2147483649', '9007199254740993', '18446744073709551616',
  '0.1', '0,1', '1.000,50', '1,000.50', '.5', '5.', '1e10', '1E-7', '0x1F', '0b101', '1_000',
  'NaN', 'Infinity', '-Infinity', 'null', 'undefined', 'true', '١٢٣', '١٢٣٫٤٥', '১২৩', '٣.١٤', '½', '²', 'Ⅻ',
];

// ---------- Exibição ----------

const invisibleLabels: Record<string, string> = {
  '\u200B': 'ZWSP',
  '\u00A0': 'NBSP',
  '\u202E': 'RLO',
  '\uFEFF': 'BOM',
  '\u0000': 'NUL',
  '\u00AD': 'SHY',
  '\t': 'TAB',
  '\n': 'LF',
  '\r': 'CR',
};

const previewLimit = 160;

const renderPreview = (value: string) => {
  if (value === '') return <span className="text-muted italic">(vazio)</span>;
  const text = value.length > previewLimit ? value.slice(0, previewLimit) : value;
  const parts: React.ReactNode[] = [];
  let buffer = '';
  Array.from(text).forEach((char, index) => {
    const label = invisibleLabels[char];
    if (!label) {
      buffer += char;
      return;
    }
    if (buffer) parts.push(buffer);
    buffer = '';
    parts.push(<span key={index} className="tag !px-1 !py-0 !text-[0.65rem] mx-0.5 align-middle">{label}</span>);
  });
  if (buffer) parts.push(buffer);
  if (value.length > previewLimit) {
    parts.push(<span key="more" className="text-muted">… (+{value.length - previewLimit})</span>);
  }
  return parts;
};

const textEncoder = new TextEncoder();
const graphemeSegmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl
  ? new Intl.Segmenter('pt-BR', { granularity: 'grapheme' })
  : null;

const describeLength = (value: string) => {
  const graphemes = graphemeSegmenter ? Array.from(graphemeSegmenter.segment(value)).length : Array.from(value).length;
  return `${graphemes} visíveis · ${value.length} UTF-16 · ${textEncoder.encode(value).length} bytes`;
};

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value) || min));

const fieldLabel = 'eyebrow block';

const TestStringsPage: React.FC = () => {
  const [tab, setTab] = useState<StringTab>('misto');
  const [quantity, setQuantity] = useState(5);
  const [length, setLength] = useState(20);
  const [emojiStyle, setEmojiStyle] = useState<EmojiStyle>('texto');
  const [accentStyle, setAccentStyle] = useState<AccentStyle>('palavras');
  const [script, setScript] = useState<Script>('arabe');
  const [baseText, setBaseText] = useState('Texto de teste');
  const [intensity, setIntensity] = useState(6);
  const [invisibleChar, setInvisibleChar] = useState<InvisibleChar>('zwsp');
  const [invisiblePosition, setInvisiblePosition] = useState<InvisiblePosition>('aleatorio');
  const [longLength, setLongLength] = useState(256);
  const [longPattern, setLongPattern] = useState<LongPattern>('repetido');
  const [emojiAtEnd, setEmojiAtEnd] = useState(false);
  const [payloadGroup, setPayloadGroup] = useState<PayloadGroup>('sql');
  const [chaosEnabled, setChaosEnabled] = useState<string[]>(chaosSources.map((source) => source.id));
  const [results, setResults] = useState<string[]>([]);

  // Sempre sobra pelo menos um tipo marcado, senão não há o que gerar
  const toggleChaosSource = (id: string) => {
    setChaosEnabled((current) => {
      if (!current.includes(id)) return [...current, id];
      return current.length > 1 ? current.filter((item) => item !== id) : current;
    });
  };

  const isList = tab === 'injecao' || tab === 'numeros';
  const usesQuantity = !isList && tab !== 'longos';
  const usesLength = tab === 'misto' || tab === 'emojis' || tab === 'acentos' || tab === 'alfabetos';

  const generateOne = useCallback((): string => {
    const size = clampNumber(length, 1, 5000);
    switch (tab) {
      case 'misto': {
        const sources = chaosSources.filter((source) => chaosEnabled.includes(source.id));
        return Array.from({ length: size }, () => pick(sources).generate()).join('');
      }
      case 'emojis':
        if (emojiStyle === 'simples') return Array.from({ length: size }, () => pick(simpleEmojis)).join('');
        if (emojiStyle === 'compostos') return Array.from({ length: size }, () => pick(composedEmojis)).join('');
        return spacedText(size, () => (randomInt(3) === 0 ? pick([...simpleEmojis, ...composedEmojis]) : pick(asciiLetters)));
      case 'acentos':
        if (accentStyle === 'letras') return Array.from({ length: size }, () => pick(accentedLetters)).join('');
        return Array.from({ length: Math.max(1, Math.ceil(size / 6)) }, () => pick(accentedWords)).join(' ').slice(0, size);
      case 'alfabetos':
        return scriptRanges[script].spaced
          ? spacedText(size, () => scriptChar(script))
          : Array.from({ length: size }, () => scriptChar(script)).join('');
      case 'zalgo':
        return zalgoText(baseText || 'Zalgo', clampNumber(intensity, 1, 40));
      case 'invisiveis': {
        const char = invisibleChars[invisibleChar].value;
        const text = baseText || 'texto';
        if (invisiblePosition === 'pontas') return char + text + char;
        if (invisiblePosition === 'entre') return Array.from(text).join(char);
        const chars = Array.from(text);
        const insertAt = randomInt(chars.length + 1);
        chars.splice(insertAt, 0, char);
        return chars.join('');
      }
      case 'longos': {
        const total = clampNumber(longLength, 1, 1_000_000);
        const target = emojiAtEnd ? total - 1 : total;
        let body = '';
        if (longPattern === 'repetido') body = 'a'.repeat(target);
        if (longPattern === 'lorem') {
          while (body.length < target) body += `${pick(loremWords)} `;
        }
        if (longPattern === 'acentos') body = 'ção'.repeat(Math.ceil(target / 3));
        if (longPattern === 'semEspaco') body = 'Pneumoultramicroscopicossilicovulcanoconiótico'.repeat(Math.ceil(target / 46));
        if (longPattern === 'emojis') return Array.from({ length: total }, () => pick(simpleEmojis)).join('');
        return body.slice(0, target) + (emojiAtEnd ? '😀' : '');
      }
      default:
        return '';
    }
  }, [tab, length, chaosEnabled, emojiStyle, accentStyle, script, baseText, intensity, invisibleChar, invisiblePosition, longLength, longPattern, emojiAtEnd]);

  const generate = useCallback(() => {
    if (tab === 'injecao') return setResults(payloads[payloadGroup].items);
    if (tab === 'numeros') return setResults(weirdNumbers);
    const amount = tab === 'longos' ? 1 : clampNumber(quantity, 1, 100);
    setResults(Array.from({ length: amount }, generateOne));
  }, [tab, payloadGroup, quantity, generateOne]);

  // Gera de novo sempre que a aba ou alguma opção muda
  useEffect(() => {
    generate();
  }, [generate]);

  const output = results.join('\n');

  return (
    <ToolPage
      title="Strings de Teste"
      description="Gere textos problemáticos para testar campos: emojis, acentos, zalgo, RTL, caracteres invisíveis, textos longos e payloads"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-5">
          <SegmentedControl ariaLabel="Tipo de string" options={tabs} value={tab} onChange={setTab} />

          <div className="flex flex-wrap items-end gap-4">
            {usesLength && (
              <label className="space-y-2">
                <span className={fieldLabel}>Tamanho</span>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="input-modern !w-28 !py-2"
                />
              </label>
            )}
            {usesQuantity && (
              <label className="space-y-2">
                <span className={fieldLabel}>Quantidade</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-modern !w-28 !py-2"
                />
              </label>
            )}

            {tab === 'emojis' && (
              <div className="space-y-2">
                <span className={fieldLabel}>Estilo</span>
                <SegmentedControl
                  ariaLabel="Estilo dos emojis"
                  options={[{ value: 'texto', label: 'No meio do texto' }, { value: 'simples', label: 'Simples' }, { value: 'compostos', label: 'Compostos (ZWJ, tons, bandeiras)' }]}
                  value={emojiStyle}
                  onChange={setEmojiStyle}
                />
              </div>
            )}

            {tab === 'acentos' && (
              <div className="space-y-2">
                <span className={fieldLabel}>Estilo</span>
                <SegmentedControl
                  ariaLabel="Estilo dos acentos"
                  options={[{ value: 'palavras', label: 'Palavras' }, { value: 'letras', label: 'Só letras acentuadas' }]}
                  value={accentStyle}
                  onChange={setAccentStyle}
                />
              </div>
            )}

            {tab === 'alfabetos' && (
              <div className="space-y-2">
                <span className={fieldLabel}>Alfabeto</span>
                <SegmentedControl
                  ariaLabel="Alfabeto"
                  options={(Object.keys(scriptRanges) as Script[]).map((value) => ({ value, label: scriptRanges[value].label }))}
                  value={script}
                  onChange={setScript}
                />
              </div>
            )}

            {(tab === 'zalgo' || tab === 'invisiveis') && (
              <label className="space-y-2 flex-1 min-w-[12rem]">
                <span className={fieldLabel}>Texto base</span>
                <input
                  type="text"
                  value={baseText}
                  onChange={(e) => setBaseText(e.target.value)}
                  className="input-modern !py-2"
                />
              </label>
            )}

            {tab === 'zalgo' && (
              <label className="space-y-2">
                <span className={fieldLabel}>Intensidade: {intensity}</span>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-40 accent-[rgb(var(--c-accent))]"
                />
              </label>
            )}

            {tab === 'longos' && (
              <>
                <label className="space-y-2">
                  <span className={fieldLabel}>Caracteres</span>
                  <input
                    type="number"
                    min={1}
                    max={1000000}
                    value={longLength}
                    onChange={(e) => setLongLength(Number(e.target.value))}
                    className="input-modern !w-32 !py-2"
                  />
                </label>
                <div className="flex flex-wrap gap-1">
                  {[255, 256, 1000, 4096, 65536].map((preset) => (
                    <button key={preset} onClick={() => setLongLength(preset)} className="btn-secondary !px-2.5 !py-1.5 text-sm">
                      {preset.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {tab === 'misto' && (
            <details className="group rounded-[12px] border border-line bg-bg">
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium text-fg">
                  O que entra no caos
                  <span className="text-muted font-normal"> · {chaosEnabled.length} de {chaosSources.length} tipos</span>
                </span>
                <svg className="w-4 h-4 text-muted transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-4 pb-4 pt-1 space-y-3">
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {chaosSources.map((source) => (
                    <label key={source.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chaosEnabled.includes(source.id)}
                        onChange={() => toggleChaosSource(source.id)}
                        className="checkbox-modern"
                      />
                      <span className="text-fg">{source.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => setChaosEnabled(chaosSources.map((source) => source.id))} className="text-accent hover:underline">Marcar todos</button>
                  <span className="text-muted">pelo menos um tipo fica marcado</span>
                </div>
              </div>
            </details>
          )}

          {tab === 'invisiveis' && (
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <span className={fieldLabel}>Caractere</span>
                <SegmentedControl
                  ariaLabel="Caractere invisível"
                  options={(Object.keys(invisibleChars) as InvisibleChar[]).map((value) => ({ value, label: invisibleChars[value].label }))}
                  value={invisibleChar}
                  onChange={setInvisibleChar}
                />
              </div>
              <div className="space-y-2">
                <span className={fieldLabel}>Posição</span>
                <SegmentedControl
                  ariaLabel="Posição do caractere"
                  options={[{ value: 'aleatorio', label: 'Aleatória' }, { value: 'pontas', label: 'Nas pontas' }, { value: 'entre', label: 'Entre as letras' }]}
                  value={invisiblePosition}
                  onChange={setInvisiblePosition}
                />
              </div>
            </div>
          )}

          {tab === 'longos' && (
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <span className={fieldLabel}>Conteúdo</span>
                <SegmentedControl
                  ariaLabel="Conteúdo do texto longo"
                  options={[
                    { value: 'repetido', label: 'aaaa…' },
                    { value: 'lorem', label: 'Lorem ipsum' },
                    { value: 'acentos', label: 'Acentuado' },
                    { value: 'semEspaco', label: 'Sem espaços' },
                    { value: 'emojis', label: 'Emojis' },
                  ]}
                  value={longPattern}
                  onChange={setLongPattern}
                />
              </div>
              {longPattern !== 'emojis' && (
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input type="checkbox" checked={emojiAtEnd} onChange={(e) => setEmojiAtEnd(e.target.checked)} className="checkbox-modern" />
                  <span className="text-fg">Emoji no último caractere</span>
                </label>
              )}
            </div>
          )}

          {tab === 'injecao' && (
            <div className="space-y-2">
              <span className={fieldLabel}>Tipo</span>
              <SegmentedControl
                ariaLabel="Tipo de payload"
                options={(Object.keys(payloads) as PayloadGroup[]).map((value) => ({ value, label: payloads[value].label }))}
                value={payloadGroup}
                onChange={setPayloadGroup}
              />
              <p className="text-sm text-muted">Payloads inofensivos para conferir se o campo escapa a entrada. Use só em sistemas que você pode testar.</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!isList && <button onClick={generate} className="btn-primary">Gerar novamente</button>}
            <CopyButton text={output} label="Copiar tudo" />
            <button onClick={() => downloadText(output, 'strings-de-teste.txt')} className="btn-secondary" disabled={!output}>
              Baixar .txt
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="card-modern">
            <ul className="panel-output max-h-[32rem] overflow-auto divide-y divide-line !p-0">
              {results.map((value, index) => (
                <li key={`${tab}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0 space-y-0.5">
                    <span className="block text-xs text-muted">{describeLength(value)}</span>
                    <code className="block text-sm break-all overflow-hidden py-0.5">{renderPreview(value)}</code>
                  </div>
                  <CopyButton text={value} label="" className="btn-secondary !p-1.5 shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default TestStringsPage;
