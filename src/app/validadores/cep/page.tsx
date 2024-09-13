"use client";
import React, { useState } from 'react';

const formatCEP = (cep: string) => {
  // Remove non-numeric characters
  const cleaned = cep.replace(/\D/g, '');

  // Format the cleaned CEP with a hyphen
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  return cleaned;
};

const CEP_Validator: React.FC = () => {
  const [cepInput, setCepInput] = useState('');
  const [cep, setCep] = useState('');
  const [value, setValue] = useState('');
  const [address, setAddress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGenerateCEP = async () => {
    setError(null);
    setAddress(null);
    let isValid = false;

    while (!isValid) {
      const randomCEP = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const fullCEP = `${randomCEP}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${fullCEP}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setCep(fullCEP);
          setAddress(data);
          isValid = true;
        }
      } catch (error) {
        console.error('Error fetching CEP data:', error);
        showTemporaryMessage('Erro ao obter os dados');
        break;
      }
    }
  };

  const handleValidateCEP = async () => {
    setError(null);
    setAddress(null);

    const cleanedCEP = value.replace(/\D/g, '');

    if (cleanedCEP.length !== 8) {
      showTemporaryMessage('Insira um CEP.');
      return;
    }

    const formattedCEP = formatCEP(cleanedCEP);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCep(formattedCEP);
        setAddress(null);
        showTemporaryMessage('CEP não encontrado.');
      } else {
        setCep(formattedCEP);
        setAddress(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching CEP data:', error);
      setAddress(null);
      showTemporaryMessage('Erro ao obter dados. Não foi possível exibir.');
    }
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleValidateCEP();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-vibrantPink p-2">
        <h1 className="text-2xl font-bold text-analogousLavender">Validador de CEP</h1>
        <p className="mt-4 text-neutralLightGray">Verifica se o CEP existe</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mt-8 flex items-center space-x-4">
            <input
              type="text"
              value={value}
              placeholder="Digite o CEP"
              onChange={(e) => setValue(e.target.value)}
              className="p-2 bg-neutralDarkGray text-neutralLightGray rounded border border-neutralLightGray flex-grow"
            />
            <button
              onClick={pasteFromClipboard}
              type="button"
              className="bg-primaryPurple text-analogousLavender px-4 py-2 rounded hover:bg-vibrantPink transition"
            >
              Colar
            </button>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleValidateCEP}
              type="submit"
              className="bg-primaryPurple w-full text-analogousLavender px-4 py-2 rounded hover:bg-vibrantPink transition"
            >
              Validar
            </button>

          </div>
        </form>
      {cep && address && (
        <div className="mt-4 p-4 bg-neutralDarkGray text-neutralLightGray rounded">
          <p><h4 className="text-2xl text-vibrantPink">CEP Válido!</h4></p>
          <div className="mt-2">
            <p><strong>Cep:</strong> {cep}</p>
            <p><strong>Endereço:</strong> {address.logradouro}</p>
            <p><strong>Bairro:</strong> {address.bairro}</p>
            <p><strong>Cidade:</strong> {address.localidade}</p>
            <p><strong>Estado:</strong> {address.uf}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-accentGold text-neutralLightGray rounded">
          <p className="text-lg font-semibold">Error:</p>
          <p className="text-xl">{error}</p>
        </div>
      )}
    </div>

      {
    message && (
      <div className="fixed bottom-4 left-1/2 transform animate-bounce duration-5000 -translate-x-1/2 bg-neutralDarkGray text-analogousLavender px-4 py-2 rounded shadow-lg outline outline-vibrantPink">
        {message}
      </div>
    )
  }
    </div>
  );
};

export default CEP_Validator;
