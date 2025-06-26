"use client";
import React, { useState } from 'react';
import ToolPage from '../../../components/ToolPage';
import Toast from '../../../components/Toast';

const CEP_Generator: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <ToolPage 
      title="Gerador de CEP" 
      description="Gera CEPs válidos aleatórios"
      icon="📮"
      category="geradores"
    >
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold text-purple-300 mb-2">Em Desenvolvimento</h2>
        <p className="text-gray-400">Esta ferramenta estará disponível em breve!</p>
      </div>

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

export default CEP_Generator;
