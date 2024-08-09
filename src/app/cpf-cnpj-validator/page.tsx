"use client";
import React, { useState } from 'react';

// Utility functions for CPF and CNPJ validation (use the previously provided functions here)
const isValidCPF = (cpf: string) => {
  // Remove formatting
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  if (cleanedCPF.length !== 11) return false;

  // Calculate CPF check digits
  const calculateCPFCheckDigits = (base: string) => {
    let sum = 0;
    let weight = 10;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weight--;
    }
    const firstDigit = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

    sum = 0;
    weight = 11;
    base += firstDigit;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weight--;
    }
    const secondDigit = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

    return `${firstDigit}${secondDigit}`;
  };

  const base = cleanedCPF.slice(0, 9);
  const checkDigits = cleanedCPF.slice(9);
  
  return checkDigits === calculateCPFCheckDigits(base);
};

const isValidCNPJ = (cnpj: string) => {
  // Remove formatting
  const cleanedCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanedCNPJ.length !== 14) return false;

  // Calculate CNPJ check digits
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

  const base = cleanedCNPJ.slice(0, 12);
  const checkDigits = cleanedCNPJ.slice(12);
  
  return checkDigits === calculateCNPJCheckDigits(base);
};

const CPF_CNPJ_Validator: React.FC = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      const sanitizedText = text.replace(/[^0-9./-]/g, '');
      setValue(sanitizedText);
      showTemporaryMessage('Texto Colado!');
    }).catch(err => {
      showTemporaryMessage('Erro ao colar o texto.');
    });
  };
  

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const ValidarCpfCnpj = () => {
    const cleanedValue = value.replace(/\D/g, '');
    let isValid = false;

    if (cleanedValue.length === 11) {
      isValid = isValidCPF(value);
    } else if (cleanedValue.length === 14) {
      isValid = isValidCNPJ(value);
    }

    if (isValid) {
      showTemporaryMessage(`O CPF/CNPJ é válido!`);
    } else {
      showTemporaryMessage('CPF/CNPJ inválido.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-fuchsia-600 p-2 rounded">
        <h1 className="text-2xl font-bold text-white">Validador CPF/CNPJ</h1>
        <p className="mt-4 text-gray-300">Valida um CPF/CNPJ aleatório.</p>

        <div className="mt-8 flex items-center space-x-4">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded border border-gray-600 flex-grow"
          />
          <button
            onClick={pasteFromClipboard}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
          >
            Colar
          </button>
        </div>  
        <div className="mt-6 flex space-x-4">
          <button
            onClick={ValidarCpfCnpj}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
          >
            Validar
          </button>
          
        </div>
      </div>
      {message && (
        <div className="fixed bottom-4 left-1/2 transform animate-bounce duration-5000 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg outline outline-fuchsia-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default CPF_CNPJ_Validator;
