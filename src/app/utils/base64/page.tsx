'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';

const Base64Page: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleEncode = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError('');
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      setError('');
    } catch (err) {
      setError('Erro ao codificar o texto');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError('');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      setError('');
    } catch (err) {
      setError('Texto Base64 inválido');
      setOutputText('');
    }
  };

  const handleProcess = () => {
    setError('');
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
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
    setError('');
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (mode === 'encode') {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const base64 = result.split(',')[1]; // Remove data:type;base64, prefix
          setOutputText(base64);
          setInputText(`Arquivo: ${file.name} (${file.size} bytes)`);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setInputText(result);
          handleDecode();
        }
      };
      reader.readAsText(file);
    }
  };

  const isValidBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  return (
    <ToolPage
      title="Codificador Base64"
      description="Codifique e decodifique texto e arquivos em Base64 de forma rápida e segura"
      icon="🔐"
      category="utils"
    >
      <div className="space-y-6">
        {/* Seletor de Modo */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">Modo de Operação</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
                className="checkbox-modern"
              />
              <span className="text-slate-300">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Codificar para Base64
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
                className="checkbox-modern"
              />
              <span className="text-slate-300">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Decodificar de Base64
              </span>
            </label>
          </div>
        </div>

        {/* Upload de Arquivo */}   
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">
            {mode === 'encode' ? 'Upload de Arquivo para Codificar' : 'Upload de Arquivo Base64'}
          </h3>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-violet-500 transition-colors">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept={mode === 'decode' ? '.txt' : '*'}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-slate-300 mb-2">
                {mode === 'encode' ? 'Clique para selecionar um arquivo' : 'Clique para selecionar um arquivo .txt com Base64'}
              </p>
              <p className="text-sm text-slate-400">
                {mode === 'encode' ? 'Qualquer tipo de arquivo' : 'Apenas arquivos de texto (.txt)'}
              </p>
            </label>
          </div>
        </div>

        {/* Entrada de Texto */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-white mb-4">
            {mode === 'encode' ? 'Texto para Codificar' : 'Texto Base64 para Decodificar'}
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Digite o texto que deseja codificar...' : 'Cole aqui o texto em Base64...'}
            className="input-modern h-32 resize-none font-mono text-sm"
          />
          {mode === 'decode' && inputText && !isValidBase64(inputText.trim()) && (
            <p className="text-yellow-400 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Aviso: O texto não parece ser um Base64 válido
            </p>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleProcess}
            className="btn-primary"
            disabled={!inputText.trim()}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {mode === 'encode' ? 'Codificar' : 'Decodificar'}
          </button>
          <button
            onClick={handleSwap}
            className="btn-secondary"
            disabled={!outputText}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Inverter
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
            Limpar Texto
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Resultado */}
        {outputText && !error && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-white mb-4">
              {mode === 'encode' ? 'Texto Codificado (Base64)' : 'Texto Decodificado'}
            </h3>
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap break-all">
                {outputText}
              </pre>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              <p>
                <strong>Estatísticas:</strong> {outputText.length} caracteres
                {mode === 'encode' && (
                  <span> • Redução: {((1 - outputText.length / inputText.length) * 100).toFixed(1)}%</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default Base64Page;
