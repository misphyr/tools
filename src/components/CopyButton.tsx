"use client";

import React, { useCallback, useState } from 'react';
import Toast from './Toast';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  successMessage?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copiar',
  className = 'btn-info',
  disabled,
  successMessage = 'Copiado para a área de transferência!',
}) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const copyText = () => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: successMessage, type: 'success' });
    }).catch(() => {
      setToast({ message: 'Erro ao copiar.', type: 'error' });
    });
  };

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <>
      <button onClick={copyText} className={className} disabled={disabled || !text} title="Copiar">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {label && <span>{label}</span>}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </>
  );
};

export default CopyButton;
