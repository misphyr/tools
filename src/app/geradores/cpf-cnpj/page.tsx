"use client"
import React, { useState } from 'react';
import { cpfGenerator, cnpjGenerator } from '@/utils/utils';



const CPF_CNPJ_Generator: React.FC = () => {
  const [value, setValue] = useState('');
  const [isFormatted, setIsFormatted] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerateCPF = () => {
    setValue(cpfGenerator(isFormatted));
  };

  const handleGenerateCNPJ = () => {
    setValue(cnpjGenerator(isFormatted));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      showTemporaryMessage('Cpf/Cnpj Copiado!');
    });
  };

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-vibrantPink rounded">
        <h1 className="text-2xl font-bold text-analogousLavender">Gerador CPF/CNPJ</h1>
        <p className="mt-4 text-neutralLightGray">Gera um CPF/CNPJ aleatório</p>

        <div className="mt-8 flex items-center space-x-4">
          <input
            type="text"
            value={value}
            readOnly
            className="p-2 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray flex-grow"
          />
          <button
            onClick={copyToClipboard}
            className="bg-primaryPurple text-neutralLightGray px-4 py-2 rounded hover:bg-vibrantPink transition"
          >
            Copiar
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="format-checkbox"
            checked={isFormatted}
            onChange={() => setIsFormatted(!isFormatted)}
            className="text-primaryPurple"
          />
          <label htmlFor="format-checkbox" className="text-sm text-neutralLightGray">Formatado</label>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleGenerateCPF}
            className="bg-primaryPurple text-neutralLightGray px-4 py-2 rounded hover:bg-vibrantPink transition"
          >
            CPF
          </button>
          <button
            onClick={handleGenerateCNPJ}
            className="bg-primaryPurple text-neutralLightGray px-4 py-2 rounded hover:bg-vibrantPink transition"
          >
            CNPJ
          </button>
        </div>
      </div>
      {message && (
        <div className="fixed bottom-4 left-1/2 transform animate-bounce duration-5000 -translate-x-1/2 bg-neutralDarkGray text-analogousLavender px-4 py-2 rounded shadow-lg outline outline-vibrantPink">
          {message}
        </div>
      )}
    </div>
  );
};

export default CPF_CNPJ_Generator;
