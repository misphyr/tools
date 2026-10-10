"use client";
import React, { useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';
import ResultBanner from '../../../components/ResultBanner';

const isValidCPF = (cpf: string) => {
  const cleanedCPF = cpf.replace(/\D/g, '');

  if (cleanedCPF.length !== 11) return false;

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
  const cleanedCNPJ = cnpj.replace(/\D/g, '');

  if (cleanedCNPJ.length !== 14) return false;

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ isValid: boolean; kind: string } | null>(null);

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      const sanitizedText = text.replace(/[^0-9./-]/g, '');
      setValue(sanitizedText);
      setResult(null);
      setToastMessage('Texto Colado!');
    }).catch(err => {
      setToastMessage('Erro ao colar o texto.');
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ValidarCpfCnpj();
  };

  const ValidarCpfCnpj = () => {
    const cleanedValue = value.replace(/\D/g, '');
    let isValid = false;
    let kind = 'CPF/CNPJ';

    if (!cleanedValue) {
      setResult(null);
      setToastMessage('Insira um CPF ou CNPJ.');
      return;
    }

    if (cleanedValue.length === 11) {
      kind = 'CPF';
      isValid = isValidCPF(value);
    } else if (cleanedValue.length === 14) {
      kind = 'CNPJ';
      isValid = isValidCNPJ(value);
    }

    setResult({ isValid, kind });
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <ToolPage 
      title="Validador CPF/CNPJ" 
      description="Verifica se o CPF ou CNPJ é válido"
      category="validadores"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={value}
            placeholder="Digite o CPF/CNPJ"
            onChange={(e) => {
              setValue(e.target.value);
              setResult(null);
            }}
            className="flex-grow input-modern !w-auto"
          />
          <button
            onClick={pasteFromClipboard}
            type="button"
            className="btn-secondary"
          >
            Colar
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Validar
          </button>
        </div>
      </form>

      {result && (
        <ResultBanner
          isValid={result.isValid}
          title={result.isValid ? `${result.kind} válido` : `${result.kind} inválido`}
        />
      )}

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

export default CPF_CNPJ_Validator;
