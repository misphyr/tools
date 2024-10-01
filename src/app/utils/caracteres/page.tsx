"use client";
import React, { useState } from 'react';

const Caracteres_utils: React.FC = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      const sanitizedText = text.replace(/[^0-9./-]/g, '');
      setValue(sanitizedText);
      showTemporaryMessage('Texto Colado!');
    }).catch(err => {
      showTemporaryMessage('Erro ao colar o texto.');
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-vibrantPink p-2">
        <h1 className="text-2xl font-bold text-analogousLavender">Formatador</h1>
        <p className="mt-4 text-neutralLightGray">Formatar textos</p>

        <div className="mt-4">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Digite seu texto"
            className="p-4 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray w-full h-14 text-lg"
          />
          <p className="mt-2 text-neutralLightGray">
            Número de caracteres: <span className="font-bold">{value.length}</span>
          </p>
          <button
            onClick={pasteFromClipboard}
            type="button"
            className="bg-primaryPurple text-analogousLavender px-4 py-2 rounded hover:bg-vibrantPink transition mt-4"
          >
            Colar
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
