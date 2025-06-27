'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';

const FormatterPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [useSpaces, setUseSpaces] = useState(true);

  const formatJson = (text: string): string => {
    try {
      const parsed = JSON.parse(text);
      const indent = useSpaces ? indentSize : '\t';
      return JSON.stringify(parsed, null, indent);
    } catch (error) {
      throw new Error('JSON inválido');
    }
  };

  const formatXml = (text: string): string => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('XML inválido');
      }

      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(xmlDoc);
      
      // Simple XML formatting
      const indent = useSpaces ? ' '.repeat(indentSize) : '\t';
      let formatted = '';
      let depth = 0;
      const lines = xmlString.replace(/></g, '>\n<').split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('</')) {
          depth--;
        }
        formatted += indent.repeat(depth) + trimmed + '\n';
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          depth++;
        }
      });
      
      return formatted.trim();
    } catch (error) {
      throw new Error('XML inválido');
    }
  };

  const formatCss = (text: string): string => {
    const indent = useSpaces ? ' '.repeat(indentSize) : '\t';
    let formatted = text
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/,\s*/g, ',\n');

    const lines = formatted.split('\n');
    let depth = 0;
    let result = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '') return;

      if (trimmed === '}') {
        depth--;
      }

      result += indent.repeat(depth) + trimmed + '\n';

      if (trimmed.endsWith('{')) {
        depth++;
      }
    });

    return result.trim();
  };

  const formatJavaScript = (text: string): string => {
    const indent = useSpaces ? ' '.repeat(indentSize) : '\t';
    let formatted = text
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*(?=\S)/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n');

    const lines = formatted.split('\n');
    let depth = 0;
    let result = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '') return;

      if (trimmed === '}' || trimmed.startsWith('}')) {
        depth--;
      }

      result += indent.repeat(depth) + trimmed + '\n';

      if (trimmed.endsWith('{')) {
        depth++;
      }
    });

    return result.trim();
  };

  const detectFileType = (text: string): string => {
    const trimmed = text.trim();
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
      return 'xml';
    }
    if (text.includes('{') && (text.includes('color:') || text.includes('margin:') || text.includes('padding:'))) {
      return 'css';
    }
    if (text.includes('function') || text.includes('const') || text.includes('let') || text.includes('var')) {
      return 'javascript';
    }
    
    return 'json'; // default
  };

  const handleFormat = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    try {
      const fileType = detectFileType(inputText);
      let formatted = '';

      switch (fileType) {
        case 'json':
          formatted = formatJson(inputText);
          break;
        case 'xml':
          formatted = formatXml(inputText);
          break;
        case 'css':
          formatted = formatCss(inputText);
          break;
        case 'javascript':
          formatted = formatJavaScript(inputText);
          break;
        default:
          formatted = formatJson(inputText);
      }

      setOutputText(formatted);
    } catch (error) {
      setOutputText(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleMinify = () => {
    if (!inputText.toString().trim()) {
      setOutputText('');
      return;
    }

    try {
      const fileType = detectFileType(inputText);
      let minified = '';

      switch (fileType) {
        case 'json':
          const parsed = JSON.parse(inputText);
          minified = JSON.stringify(parsed);
          break;
        case 'xml':
          minified = inputText.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
          break;
        case 'css':
          minified = inputText
            .replace(/\s+/g, ' ')
            .replace(/;\s+/g, ';')
            .replace(/{\s+/g, '{')
            .replace(/\s+}/g, '}')
            .replace(/,\s+/g, ',')
            .trim();
          break;
        case 'javascript':
          minified = inputText
            .replace(/\s+/g, ' ')
            .replace(/;\s+/g, ';')
            .replace(/{\s+/g, '{')
            .replace(/\s+}/g, '}')
            .trim();
          break;
        default:
          const parsedDefault = JSON.parse(inputText);
          minified = JSON.stringify(parsedDefault);
      }

      setOutputText(minified);
    } catch (error) {
      setOutputText(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <ToolPage
      title="Identador de Texto"
      description="Idente JSON, XML, CSS e JavaScript com facilidade. "
      icon="📂"
      category="utils"
    >
      <div className="space-y-6">
        {/* Configurações */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tamanho da Indentação
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="input-modern"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="indentType"
                  checked={useSpaces}
                  onChange={() => setUseSpaces(true)}
                  className="checkbox-modern"
                />
                <span className="text-sm text-slate-300">Espaços</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="indentType"
                  checked={!useSpaces}
                  onChange={() => setUseSpaces(false)}
                  className="checkbox-modern"
                />
                <span className="text-sm text-slate-300">Tabs</span>
              </label>
            </div>
          </div>
        </div>

        {/* Entrada */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">Código para Indentar</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole aqui seu código JSON, XML, CSS ou JavaScript..."
            className="input-modern h-48 resize-none font-mono text-sm"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleFormat}
            className="btn-primary"
            disabled={!inputText.trim()}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Indentar
          </button>
          <button
            onClick={handleMinify}
            className="btn-secondary"
            disabled={!inputText.trim()}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
            Minificar
          </button>
          <button
            onClick={handleCopy}
            className="btn-info"
            disabled={!outputText}
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

        {/* Saída */}
        {outputText && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-white mb-4">Código Indentado</h3>
            <pre className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 overflow-auto max-h-96 text-sm font-mono text-slate-200">
              {outputText}
            </pre>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default FormatterPage;
