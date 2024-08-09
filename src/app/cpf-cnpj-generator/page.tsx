"use client"
import React, { useState } from 'react';

const generateCPF = (formatted: boolean) => {
  const random = () => Math.floor(Math.random() * 10);
  let cpf = Array.from({ length: 9 }, random).join('');
  cpf += calculateCPFCheckDigits(cpf);
  return formatted
    ? cpf.replace(/(.{3})(.{3})(.{3})(.{2})/, '$1.$2.$3-$4')
    : cpf;
};

const calculateCPFCheckDigits = (base: string) => {
  let sum = 0;
  let weight = 10;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i]) * weight--;
  }
  const remainder = (sum % 11);
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;

  sum = 0;
  weight = 11;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i]) * weight--;
  }
  const secondDigit = ((sum % 11) < 2 ? 0 : 11 - (sum % 11));

  return `${firstDigit}${secondDigit}`;
};

const generateCNPJ = (formatted: boolean) => {
  const random = () => Math.floor(Math.random() * 10);
  let cnpj = Array.from({ length: 12 }, random).join('');
  cnpj += calculateCNPJCheckDigits(cnpj);
  return formatted
    ? cnpj.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '$1.$2.$3/$4-$5')
    : cnpj;
};

const calculateCNPJCheckDigits = (base: string) => {
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calculateDigit = (base: string, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(base, weights1);
  const secondDigit = calculateDigit(base + firstDigit, weights2);

  return `${firstDigit}${secondDigit}`;
};

const CPF_CNPJ_Generator: React.FC = () => {
  const [value, setValue] = useState('');
  const [isFormatted, setIsFormatted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerateCPF = () => {
    setValue(generateCPF(isFormatted));
  };

  const handleGenerateCNPJ = () => {
    setValue(generateCNPJ(isFormatted));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      showTemporaryMessage('Cpf/Cnpj Copiado!');
    });
  };

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Message disappears after 3 seconds
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white">Gerador CPF/CNPJ</h1>
        <p className="mt-4 text-gray-300">Gera um CPF/CNPJ aleatório.</p>

        {/* Readonly input with copy button */}
        <div className="mt-8 flex items-center space-x-4">
          <input
            type="text"
            value={value}
            readOnly
            className="p-2 bg-gray-700 text-white rounded border border-gray-600 flex-grow"
          />
          <button
            onClick={copyToClipboard}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-900 hover:animate-pulse transition"
          >
            Copiar
          </button>
        </div>

        {/* Checkbox */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="format-checkbox"
            checked={isFormatted}
            onChange={() => setIsFormatted(!isFormatted)}
            className="text-purple-900"
          />
          <label htmlFor="format-checkbox" className="text-sm text-gray-300">Formatado</label>
        </div>

        {/* Generate buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleGenerateCPF}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-900 hover:animate-pulse transition"
          >
            CPF
          </button>
          <button
            onClick={handleGenerateCNPJ}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-900 hover:animate-pulse transition"
          >
            CNPJ
          </button>
        </div>
      </div>

      {/* Temporary message */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default CPF_CNPJ_Generator;
