"use client"
import React, { useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';
import { downloadJson } from '../../../utils/downloadJson';
import { cdaGenerator } from '../../../utils/cdaGenerator';

const JsonGenerator: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  
  const handleDownload = () => {
    const data = cdaGenerator();
    downloadJson(data, 'cda-teste');
    setToastMessage('CDA Gerada com Sucesso!');
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <ToolPage 
      title="Gerador de CDA" 
      description="Gera uma CDA com os parâmetros indicados"
      icon="📄"
      category="geradores"
    >
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-medium">🚧 Em Construção...</p>
          <p className="text-gray-400 text-sm mt-1">Esta ferramenta está sendo aprimorada.</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary px-8 py-3"
          >
            📥 Baixar CDA
          </button>
        </div>
      </div>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success"
          onClose={closeToast}
        />
      )}
    </ToolPage>
  );
};

export default JsonGenerator;
