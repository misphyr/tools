"use client";
import React, { useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';
import StatCard from '../../../components/StatCard';

const CharacterUtils: React.FC = () => {
  const [value, setValue] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Opções de formatação
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [removeLetters, setRemoveLetters] = useState(false);
  const [removeDoubleSpaces, setRemoveDoubleSpaces] = useState(false);
  const [removeSpecific, setRemoveSpecific] = useState(false);
  const [removeSpecificWords, setRemoveSpecificWords] = useState(false);
  const [specificChars, setSpecificChars] = useState('');
  const [specificWords, setSpecificWords] = useState('');

  const showTemporaryMessage = (msg: string) => {
    setToastMessage(msg);
  };

  const sanitizeText = () => {
    let sanitizedText = value;
    if (removeNumbers) {
      sanitizedText = sanitizedText.replace(/[0-9]/g, '');
    }
    if (removeLetters) {
      sanitizedText = sanitizedText.replace(/[a-zA-ZáéíóúãâêîôûàèìòùçÁÉÍÓÚÃÂÊÎÔÛÀÈÌÒÙÇ]/g, '');
    }
    if (removeDoubleSpaces) {
      sanitizedText = sanitizedText.replace(/[ \t]+/g, ' ').trim();
    }
    if (removeSpecific && specificChars) {
      const regex = new RegExp(`[${specificChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
      sanitizedText = sanitizedText.replace(regex, '');
    }
    if (removeSpecificWords && specificWords) {
      const wordsToRemove = specificWords
        .split(/[,]+/)
        .filter(Boolean);
      const regex = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi');
      sanitizedText = sanitizedText.replace(regex, '').replace(/\s+/g, ' ').trim();
    }

    setValue(sanitizedText);
    setWordCount(sanitizedText.split(/\s+/).filter(Boolean).length);
    showTemporaryMessage('Texto Formatado!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue(text);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      showTemporaryMessage('Texto copiado para a área de transferência!');
    }).catch(() => {
      showTemporaryMessage('Erro ao copiar texto.');
    });
  };

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      setValue(text);
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      showTemporaryMessage('Texto colado!');
    }).catch(() => {
      showTemporaryMessage('Erro ao colar texto.');
    });
  };

  const clearText = () => {
    setValue('');
    setWordCount(0);
    showTemporaryMessage('Texto limpo!');
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <ToolPage
      title="Formatador de Texto"
      description="Ferramenta completa para formatação e sanitização de texto"
      category="utils"
    >
      <div className="space-y-6">
        <div>
          <textarea
            id="text-input"
            value={value}
            onChange={handleChange}
            placeholder="Digite seu texto aqui..."
            className="input-modern w-full h-48 resize-vertical"
          />
        </div>

        {/* Estatísticas do texto */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={value.length} label="Caracteres" />
          <StatCard value={wordCount} label="Palavras" />
          <StatCard value={value.split('\n').length} label="Linhas" />
        </div>

        {/* Opções de formatação */}
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-accent mb-4">Opções de Formatação</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeNumbers}
                  onChange={(e) => setRemoveNumbers(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">Remover números</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeLetters}
                  onChange={(e) => setRemoveLetters(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">Remover letras</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeDoubleSpaces}
                  onChange={(e) => setRemoveDoubleSpaces(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">Remover espaços duplos</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeSpecific}
                  onChange={(e) => setRemoveSpecific(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">Remover caracteres específicos</span>
              </label>
              {removeSpecific && (
                <input
                  type="text"
                  value={specificChars}
                  onChange={(e) => setSpecificChars(e.target.value)}
                  placeholder="Ex: !@#$%"
                  className="input-modern !py-2 ml-6 !w-[calc(100%-1.5rem)]"
                />
              )}

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeSpecificWords}
                  onChange={(e) => setRemoveSpecificWords(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">Remover palavras específicas</span>
              </label>
              {removeSpecificWords && (
                <input
                  type="text"
                  value={specificWords}
                  onChange={(e) => setSpecificWords(e.target.value)}
                  placeholder="Ex: palavra1, palavra2, palavra3"
                  className="input-modern !py-2 ml-6 !w-[calc(100%-1.5rem)]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={sanitizeText}
            className="btn-primary"
            disabled={!value}
          >
            Formatar Texto
          </button>
          <button
            onClick={copyToClipboard}
            className="btn-secondary"
            disabled={!value}
          >
            Copiar Texto
          </button>
          <button
            onClick={pasteFromClipboard}
            className="btn-secondary"
          >
            Colar Texto
          </button>
          <button
            onClick={clearText}
            className="btn-secondary"
            disabled={!value}
          >
            Limpar
          </button>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={closeToast}
        />
      )}
    </ToolPage>
  );
};

export default CharacterUtils;
