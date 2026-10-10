"use client";
import React, { useRef, useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';

interface ViaCepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

// Capitais usadas na busca por endereço do ViaCEP (nomes sem acento, como a API aceita)
const states: { uf: string; name: string; capital: string }[] = [
  { uf: 'AC', name: 'Acre', capital: 'Rio Branco' },
  { uf: 'AL', name: 'Alagoas', capital: 'Maceio' },
  { uf: 'AP', name: 'Amapá', capital: 'Macapa' },
  { uf: 'AM', name: 'Amazonas', capital: 'Manaus' },
  { uf: 'BA', name: 'Bahia', capital: 'Salvador' },
  { uf: 'CE', name: 'Ceará', capital: 'Fortaleza' },
  { uf: 'DF', name: 'Distrito Federal', capital: 'Brasilia' },
  { uf: 'ES', name: 'Espírito Santo', capital: 'Vitoria' },
  { uf: 'GO', name: 'Goiás', capital: 'Goiania' },
  { uf: 'MA', name: 'Maranhão', capital: 'Sao Luis' },
  { uf: 'MT', name: 'Mato Grosso', capital: 'Cuiaba' },
  { uf: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande' },
  { uf: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte' },
  { uf: 'PA', name: 'Pará', capital: 'Belem' },
  { uf: 'PB', name: 'Paraíba', capital: 'Joao Pessoa' },
  { uf: 'PR', name: 'Paraná', capital: 'Curitiba' },
  { uf: 'PE', name: 'Pernambuco', capital: 'Recife' },
  { uf: 'PI', name: 'Piauí', capital: 'Teresina' },
  { uf: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte', capital: 'Natal' },
  { uf: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre' },
  { uf: 'RO', name: 'Rondônia', capital: 'Porto Velho' },
  { uf: 'RR', name: 'Roraima', capital: 'Boa Vista' },
  { uf: 'SC', name: 'Santa Catarina', capital: 'Florianopolis' },
  { uf: 'SP', name: 'São Paulo', capital: 'Sao Paulo' },
  { uf: 'SE', name: 'Sergipe', capital: 'Aracaju' },
  { uf: 'TO', name: 'Tocantins', capital: 'Palmas' },
];

// Termos comuns em nomes de rua, para variar os resultados da busca
const searchTerms = ['Rua', 'Avenida', 'Maria', 'Jose', 'Joao', 'Santa', 'Brasil', 'Silva', 'Flores', 'Dom', 'Pedro', 'Paulo', 'Antonio', 'Nova', 'Sao'];

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const CEP_Generator: React.FC = () => {
  const [selectedUf, setSelectedUf] = useState('');
  const [isFormatted, setIsFormatted] = useState(true);
  const [address, setAddress] = useState<ViaCepAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const searchCache = useRef(new Map<string, ViaCepAddress[]>());

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const searchAddresses = async (uf: string, city: string, term: string): Promise<ViaCepAddress[]> => {
    const cacheKey = `${uf}/${city}/${term}`;
    const cached = searchCache.current.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(`https://viacep.com.br/ws/${uf}/${encodeURIComponent(city)}/${encodeURIComponent(term)}/json/`);
    if (!response.ok) throw new Error(`ViaCEP respondeu ${response.status}`);
    const data = await response.json();
    const results: ViaCepAddress[] = Array.isArray(data) ? data : [];
    searchCache.current.set(cacheKey, results);
    return results;
  };

  const handleGenerateCEP = async () => {
    setIsLoading(true);
    try {
      const state = states.find((item) => item.uf === selectedUf) ?? pickRandom(states);
      let results = await searchAddresses(state.uf, state.capital, pickRandom(searchTerms));
      if (results.length === 0) {
        results = await searchAddresses(state.uf, state.capital, 'Rua');
      }
      if (results.length === 0) {
        showToast('Nenhum CEP encontrado. Tente de novo.', 'warning');
        return;
      }
      setAddress(pickRandom(results));
    } catch (error) {
      console.error('Error fetching CEP data:', error);
      showToast('Erro ao consultar o ViaCEP.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayedCEP = address
    ? (isFormatted ? address.cep : address.cep.replace(/\D/g, ''))
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayedCEP).then(() => {
      showToast('CEP copiado para área de transferência!', 'success');
    }).catch(() => {
      showToast('Erro ao copiar CEP.', 'error');
    });
  };

  return (
    <ToolPage
      title="Gerador de CEP"
      description="Gera CEPs reais e existentes, com o endereço correspondente"
      category="geradores"
    >
      <div className="max-w-2xl mx-auto">
        <div className="card-modern space-y-5">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="uf-select" className="block text-sm font-medium text-muted mb-2">
                Estado
              </label>
              <select
                id="uf-select"
                value={selectedUf}
                onChange={(e) => setSelectedUf(e.target.value)}
                className="input-modern !py-2.5"
              >
                <option value="">Qualquer estado</option>
                {states.map((state) => (
                  <option key={state.uf} value={state.uf}>{state.uf} · {state.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 sm:pt-7">
              <input
                type="checkbox"
                id="format-checkbox"
                checked={isFormatted}
                onChange={() => setIsFormatted(!isFormatted)}
                className="checkbox-modern"
              />
              <label htmlFor="format-checkbox" className="text-fg cursor-pointer">
                Aplicar formatação (traço)
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerateCEP}
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Gerar CEP'}
          </button>

          {/* Result Display */}
          <div className="pt-5 border-t border-line space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={displayedCEP}
                readOnly
                placeholder="O CEP gerado aparecerá aqui..."
                className="input-modern font-mono text-lg text-center"
              />
              {address && (
                <button
                  onClick={copyToClipboard}
                  className="btn-info"
                >
                  Copiar
                </button>
              )}
            </div>

            {address && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-muted">Endereço</dt>
                <dd>{address.logradouro || '—'}</dd>
                <dt className="text-muted">Bairro</dt>
                <dd>{address.bairro || '—'}</dd>
                <dt className="text-muted">Cidade</dt>
                <dd>{address.localidade} / {address.uf}</dd>
              </dl>
            )}
          </div>

          <p className="text-xs text-muted">
            Os CEPs vêm do <a href="https://viacep.com.br" className="text-accent hover:underline">ViaCEP</a>,
            buscando endereços na capital do estado.
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToolPage>
  );
};

export default CEP_Generator;
