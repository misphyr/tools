'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';

const lowerWords = new Set(['a', 'o', 'as', 'os', 'e', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'ou', 'um', 'uma', 'of', 'the', 'and', 'in', 'on', 'to', 'for']);

const removeAccents = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// Separa em palavras, inclusive camelCase, snake_case e kebab-case já existentes
const splitWords = (text: string, stripAccents: boolean) => {
  const source = stripAccents ? removeAccents(text) : text;
  return source
    .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
};

const toTitleCase = (text: string) => {
  let isFirst = true;
  return text.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, (word) => {
    const result = !isFirst && lowerWords.has(word) ? word : capitalize(word);
    isFirst = false;
    return result;
  });
};

const toSentenceCase = (text: string) =>
  text.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, prefix: string, letter: string) => prefix + letter.toUpperCase());

const toAlternatingCase = (text: string) => {
  let index = 0;
  return text.replace(/\p{L}/gu, (letter) => (index++ % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase()));
};

const toInverseCase = (text: string) =>
  text.replace(/\p{L}/gu, (letter) => (letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase()));

interface CaseOption {
  label: string;
  convert: (text: string, stripAccents: boolean) => string;
}

const caseOptions: CaseOption[] = [
  { label: 'MAIÚSCULAS', convert: (text) => text.toUpperCase() },
  { label: 'minúsculas', convert: (text) => text.toLowerCase() },
  { label: 'Título', convert: (text) => toTitleCase(text) },
  { label: 'Frase', convert: (text) => toSentenceCase(text) },
  { label: 'cAmElCaSe (alternado)', convert: (text) => toAlternatingCase(text) },
  { label: 'iNVERTIDO', convert: (text) => toInverseCase(text) },
  { label: 'camelCase', convert: (text, strip) => splitWords(text, strip).map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w))).join('') },
  { label: 'PascalCase', convert: (text, strip) => splitWords(text, strip).map(capitalize).join('') },
  { label: 'snake_case', convert: (text, strip) => splitWords(text, strip).map((w) => w.toLowerCase()).join('_') },
  { label: 'CONSTANT_CASE', convert: (text, strip) => splitWords(text, strip).map((w) => w.toUpperCase()).join('_') },
  { label: 'kebab-case', convert: (text, strip) => splitWords(text, strip).map((w) => w.toLowerCase()).join('-') },
  { label: 'dot.case', convert: (text, strip) => splitWords(text, strip).map((w) => w.toLowerCase()).join('.') },
];

const CaseConverterPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [stripAccents, setStripAccents] = useState(true);

  return (
    <ToolPage
      title="Conversor de Case"
      description="Converta textos entre MAIÚSCULAS, minúsculas, Título, camelCase, snake_case e outros formatos"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            className="input-modern h-36 font-mono text-sm"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={stripAccents}
                onChange={(e) => setStripAccents(e.target.checked)}
                className="checkbox-modern"
              />
              <span className="text-fg">Remover acentos nos formatos de código (camelCase, snake_case...)</span>
            </label>
            <button onClick={() => setInputText('')} className="btn-error btn-sm" disabled={!inputText}>
              Limpar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {caseOptions.map((option) => {
            const converted = inputText ? option.convert(inputText, stripAccents) : '';
            return (
              <div key={option.label} className="card-modern !p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow">{option.label}</span>
                  <CopyButton text={converted} label="" className="btn-secondary !p-1.5" />
                </div>
                <div className="panel-output !p-3 min-h-[2.75rem] max-h-40 overflow-auto">
                  <p className="font-mono text-sm whitespace-pre-wrap break-words">
                    {converted || <span className="text-muted">—</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolPage>
  );
};

export default CaseConverterPage;
