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
  const [address, setAddress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Message disappears after 3 seconds
  };

  const handleGenerateCEP = async () => {
    setError(null);
    setAddress(null);
    let isValid = false;

    while (!isValid) {
      // Generate a valid CEP
      const randomCEP = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const fullCEP = `${randomCEP}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      try {
        // Fetch address information from ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${fullCEP}/json/`);
        const data = await response.json();

        if (!data.erro) {
          // Valid CEP found
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

    const cleanedCEP = cepInput.replace(/\D/g, ''); // Remove non-numeric characters

    if (cleanedCEP.length !== 8) {
      showTemporaryMessage('Insira um CEP.');
      return;
    }

    const formattedCEP = formatCEP(cleanedCEP);

    try {
      // Fetch address information from ViaCEP
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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-fuchsia-600">
        <h1 className="text-white text-2xl font-bold mb-4">Validador de CEP</h1>

        <div className="mb-4">
          <input
            type="text"
            value={cepInput}
            onChange={(e) => setCepInput(e.target.value)}
            placeholder="Digite o CEP"
            className="w-full p-2 mb-2 border border-gray-700 bg-gray-800 text-white rounded"
          />
          <button
            onClick={handleValidateCEP}
            className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
          >
            Validar CEP
          </button>
        </div>

        {cep && address && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded">
            <p><h4 className="text-2xl text-teal-600">CEP Válido!</h4></p>
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
          <div className="mt-4 p-4 bg-red-800 text-white rounded">
            <p className="text-lg font-semibold">Error:</p>
            <p className="text-xl">{error}</p>
          </div>
        )}
      </div>

      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce bg-gray-900 text-white px-4 py-2 rounded shadow-lg outline outline-fuchsia-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default CEP_Validator;
