"use client";
import React, { useState } from 'react';

const Caracteres_utils: React.FC = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const [removeSpecificWords, setRemoveSpecificWords] = useState(false);
  const [specificWords, setSpecificWords] = useState('');
  
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [removeDoubleSpaces, setRemoveDoubleSpaces] = useState(false);
  const [removeLetters, setRemoveLetters] = useState(false);
  const [removeSpecific, setRemoveSpecific] = useState(false);
  const [specificChars, setSpecificChars] = useState('');

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then((text) => {
      setValue(text);
      showTemporaryMessage('Texto Colado!');
    }).catch((err) => {
      showTemporaryMessage('Erro ao colar o texto.');
    });
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
      sanitizedText = sanitizedText.replace(/\s+/g, ' ').trim();
    }
    if (removeSpecific && specificChars) {
      const regex = new RegExp(`[${specificChars}]`, 'g');
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
  
    showTemporaryMessage('Texto Formatado!');
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue(e.target.value);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  return (
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg max-h-[80dvh] outline outline-vibrantPink p-2 min-w-fit overflow-y-auto  ">
        <h1 className="text-2xl font-bold text-analogousLavender">Formatador</h1>
        <p className="mt-4 text-neutralLightGray">Formatar textos</p>

        <div className="mt-4">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Digite seu texto"
            className="p-4 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray w-full h-16 text-lg"
          />
          <p className="mt-2 text-neutralLightGray">
            Número de caracteres: <span className="font-bold">{value.length}</span><br />
            Número de palavras: <span className="font-bold">{wordCount}</span>
          </p>
          <div className="mt-4">
            <label className="flex items-center text-neutralLightGray">
              <input
                type="checkbox"
                checked={removeNumbers}
                onChange={() => setRemoveNumbers(!removeNumbers)}
                className="mr-2"
              />
              Remover números
            </label>
            <label className="flex items-center text-neutralLightGray mt-2">
              <input
                type="checkbox"
                checked={removeLetters}
                onChange={() => setRemoveLetters(!removeLetters)}
                className="mr-2"
              />
              Remover letras
            </label>
            <label className="flex items-center text-neutralLightGray mt-2">
              <input
                type="checkbox"
                checked={removeDoubleSpaces}
                onChange={() => setRemoveDoubleSpaces(!removeDoubleSpaces)}
                className="mr-2"
              />
              Remover espaços duplicados
            </label>
            <label className="flex items-center text-neutralLightGray mt-2">
              <input
                type="checkbox"
                checked={removeSpecific}
                onChange={() => setRemoveSpecific(!removeSpecific)}
                className="mr-2"
              />
              Remover caracteres específicos
            </label>
            {removeSpecific && (
              <input
                type="text"
                value={specificChars}
                onChange={(e) => setSpecificChars(e.target.value)}
                placeholder="Digite os caracteres todos juntos"
                className="p-2 mt-2 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray w-full"
              />
            )}
            <label className="flex items-center text-neutralLightGray mt-2">
              <input
                type="checkbox"
                checked={removeSpecificWords}
                onChange={(e) => setRemoveSpecificWords(e.target.checked)}
                className="mr-2"
              />
              Remover palavras específicas
            </label>
            {removeSpecificWords && (
              <input
                type="text"
                value={specificWords}
                onChange={(e) => setSpecificWords(e.target.value)}
                placeholder="Digite as palavras separadas por espaços ou vírgulas"
                className="mt-2 p-2 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray w-full"
              />
            )}
          </div>
          <div className="mt-6 flex space-x-4">
          <button
            onClick={pasteFromClipboard}
            type="button"
            aria-label="Colar texto do clipboard"
            className="bg-primaryPurple text-analogousLavender px-4 py-2 rounded hover:bg-vibrantPink transition mt-4"
          >
            Colar
          </button>
          <button
            onClick={sanitizeText}
            type="button"
            aria-label="Formatar texto"
            className="mt-12px bg-primaryPurple text-analogousLavender px-4 py-2 rounded hover:bg-vibrantPink transition mt-4"
          >
            Formatar
          </button>
          </div>

        {error && (
          <div className="mt-4 p-4 bg-accentGold text-neutralLightGray rounded">
            <p className="text-lg font-semibold">Error:</p>
            <p className="text-xl">{error}</p>
          </div>
        )}
      </div>

      {message && (
        <div className="fixed bottom-4 left-1/2 transform animate-bounce duration-5000 -translate-x-1/2 bg-neutralDarkGray text-analogousLavender px-4 py-2 rounded shadow-lg outline outline-vibrantPink">
          {message}
        </div>
      )}
    </div>
  );
};

export default Caracteres_utils;
