'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';

const LoremPage: React.FC = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
    'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt', 'neque',
    'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi',
    'tempora', 'incidunt', 'magnam', 'quam', 'voluptatem', 'fuga', 'harum',
    'quidem', 'rerum', 'facilis', 'expedita', 'distinctio', 'nam', 'libero',
    'tempore', 'cum', 'soluta', 'nobis', 'eligendi', 'optio', 'cumque', 'nihil',
    'impedit', 'quo', 'minus', 'maxime', 'placeat', 'facere', 'possimus', 'omnis',
    'assumenda', 'repellendus', 'temporibus', 'autem', 'quibusdam', 'officiis',
    'debitis', 'necessariibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae',
    'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'sapiente', 'delectus',
    'reiciendis', 'maiores', 'alias', 'perferendis', 'doloribus', 'asperiores'
  ];

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getRandomWords = (count: number, includeClassic: boolean = false): string[] => {
    const words = [];
    
    if (includeClassic && words.length === 0) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    
    while (words.length < count) {
      const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
      words.push(randomWord);
    }
    
    return words;
  };

  const generateParagraph = (wordCount: number, isFirst: boolean = false): string => {
    const useClassicStart = isFirst && startWithLorem;
    const words = getRandomWords(wordCount, useClassicStart);
    
    if (useClassicStart) {
      // Ensure first paragraph starts with "Lorem ipsum dolor sit amet"
      const paragraph = words.join(' ');
      return capitalizeFirst(paragraph) + '.';
    } else {
      const paragraph = words.join(' ');
      return capitalizeFirst(paragraph) + '.';
    }
  };

  const handleGenerate = () => {
    const paragraphs = [];
    
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = generateParagraph(wordsPerParagraph, i === 0);
      paragraphs.push(paragraph);
    }
    
    setGeneratedText(paragraphs.join('\n\n'));
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
    }
  };

  const handleClear = () => {
    setGeneratedText('');
  };

  const generateQuickText = (type: 'short' | 'medium' | 'long') => {
    let paragraphs = 1;
    let words = 30;
    
    switch (type) {
      case 'short':
        paragraphs = 1;
        words = 30;
        break;
      case 'medium':
        paragraphs = 3;
        words = 50;
        break;
      case 'long':
        paragraphs = 5;
        words = 80;
        break;
    }
    
    setParagraphCount(paragraphs);
    setWordsPerParagraph(words);
    
    const generatedParagraphs = [];
    for (let i = 0; i < paragraphs; i++) {
      const paragraph = generateParagraph(words, i === 0);
      generatedParagraphs.push(paragraph);
    }
    
    setGeneratedText(generatedParagraphs.join('\n\n'));
  };

  return (
    <ToolPage
      title="Gerador Lorem Ipsum"
      description="Gere texto Lorem Ipsum personalizado para seus projetos e layouts"
      icon="📝"
      category="utils"
    >
      <div className="space-y-6">
        {/* Botões Rápidos */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">Geradores Rápidos</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => generateQuickText('short')}
              className="btn-primary"
            >
              Texto Curto
              <span className="text-xs opacity-75 ml-1">(1 parágrafo)</span>
            </button>
            <button
              onClick={() => generateQuickText('medium')}
              className="btn-secondary"
            >
              Texto Médio
              <span className="text-xs opacity-75 ml-1">(3 parágrafos)</span>
            </button>
            <button
              onClick={() => generateQuickText('long')}
              className="btn-info"
            >
              Texto Longo
              <span className="text-xs opacity-75 ml-1">(5 parágrafos)</span>
            </button>
          </div>
        </div>

        {/* Configurações Personalizadas */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">Configurações Personalizadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Número de Parágrafos
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={paragraphCount}
                onChange={(e) => setParagraphCount(Number(e.target.value))}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Palavras por Parágrafo
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(Number(e.target.value))}
                className="input-modern"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="checkbox-modern"
              />
              <span className="text-sm text-slate-300">
                Começar com &quot;Lorem ipsum dolor sit amet&quot;
              </span>
            </label>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Gerar Texto
          </button>
          <button
            onClick={handleCopy}
            className="btn-info"
            disabled={!generatedText}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copiar
          </button>
          <button
            onClick={handleClear}
            className="btn-error"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpar
          </button>
        </div>

        {/* Texto Gerado */}
        {generatedText && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-white mb-4">Texto Gerado</h3>
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 max-h-96 overflow-auto">
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {generatedText}
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              <p>
                <strong>Estatísticas:</strong> {paragraphCount} parágrafo(s) • 
                {generatedText.split(' ').length} palavras • 
                {generatedText.length} caracteres
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default LoremPage;
