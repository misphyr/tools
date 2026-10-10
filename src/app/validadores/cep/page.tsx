"use client";
import React, { useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';
import ResultBanner from '../../../components/ResultBanner';

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
  const [notFound, setNotFound] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        setToastMessage('Erro ao obter os dados');
        break;
      }
    }
  };

  const handleValidateCEP = async () => {
    setError(null);
    setAddress(null);
    setNotFound(false);

    const cleanedCEP = value.replace(/\D/g, '');

    if (cleanedCEP.length !== 8) {
      setToastMessage('Insira um CEP.');
      return;
    }

    const formattedCEP = formatCEP(cleanedCEP);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCep(formattedCEP);
        setAddress(null);
        setNotFound(true);
      } else {
        setCep(formattedCEP);
        setAddress(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching CEP data:', error);
      setAddress(null);
      setToastMessage('Erro ao obter dados. Não foi possível exibir.');
    }
  };

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
      const sanitizedText = text.replace(/[^0-9./-]/g, '');
      setValue(sanitizedText);
      setToastMessage('Texto Colado!');
    }).catch(err => {
      setToastMessage('Erro ao colar o texto.');
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleValidateCEP();
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <ToolPage 
      title="Validador de CEP" 
      description="Verifica se o CEP existe"
      category="validadores"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={value}
            placeholder="Digite o CEP"
            onChange={(e) => setValue(e.target.value)}
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

      {cep && address && (
        <ResultBanner isValid title="CEP válido">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted">Endereço</dt>
            <dd>{address.logradouro || '—'}</dd>
            <dt className="text-muted">Bairro</dt>
            <dd>{address.bairro || '—'}</dd>
            <dt className="text-muted">Cidade</dt>
            <dd>{address.localidade}</dd>
            <dt className="text-muted">Estado</dt>
            <dd>{address.uf}</dd>
          </dl>
        </ResultBanner>
      )}

      {cep && notFound && (
        <ResultBanner isValid={false} title="CEP não encontrado" />
      )}

      {error && (
        <div className="mt-4 notice notice-error">
          <p className="text-lg font-semibold text-danger">Erro:</p>
          <p className="text-xl">{error}</p>
        </div>
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

export default CEP_Validator;
