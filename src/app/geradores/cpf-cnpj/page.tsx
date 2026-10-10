"use client";
import React, { useState } from 'react';
import { cpfGenerator, cnpjGenerator } from '@/utils/utils';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';

const CPF_CNPJ_Generator: React.FC = () => {
  const [value, setValue] = useState('');
  const [isFormatted, setIsFormatted] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const handleGenerateCPF = () => {
    const newCpf = cpfGenerator(isFormatted);
    setValue(newCpf);
    showToast('CPF gerado com sucesso!', 'success');
  };

  const handleGenerateCNPJ = () => {
    const newCnpj = cnpjGenerator(isFormatted);
    setValue(newCnpj);
    showToast('CNPJ gerado com sucesso!', 'success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      showToast('Documento copiado para área de transferência!', 'success');
    }).catch(() => {
      showToast('Erro ao copiar documento.', 'error');
    });
  };

  return (
    <ToolPage
      title="Gerador CPF/CNPJ"
      description="Gere CPFs e CNPJs válidos para testes e desenvolvimento"
      category="geradores"
    >
      <div className="max-w-2xl mx-auto">
        <div className="card-modern">
          <h2 className="text-xl font-semibold text-fg mb-6 flex items-center space-x-2">
            <span>Gerar Documento</span>
          </h2>

          <div className="space-y-5">
            {/* Format Option */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="format-checkbox"
                checked={isFormatted}
                onChange={() => setIsFormatted(!isFormatted)}
                className="checkbox-modern"
              />
              <label htmlFor="format-checkbox" className="text-fg cursor-pointer">
                Aplicar formatação (pontos e traços)
              </label>
            </div>

            {/* Generate Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleGenerateCPF} className="btn-primary">
                Gerar CPF
              </button>
              <button onClick={handleGenerateCNPJ} className="btn-primary">
                Gerar CNPJ
              </button>
            </div>

            {/* Result Display */}
            <div className="pt-5 border-t border-line grid grid-cols-1 gap-3">
              <input
                type="text"
                value={value}
                readOnly
                placeholder="Documento gerado aparecerá aqui..."
                className="input-modern font-mono text-lg text-center"
              />
              {value && (
                <button onClick={copyToClipboard} className="btn-info">
                  Copiar
                </button>
              )}
            </div>

            {/* Info */}
            <div className="notice notice-info">
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="text-accent font-semibold mb-2">Importante</h3>
                  <p className="text-fg text-sm leading-relaxed">
                    Os documentos gerados são válidos apenas para testes e desenvolvimento. 
                    Não utilize em sistemas de produção ou para fins fraudulentos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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

export default CPF_CNPJ_Generator;
