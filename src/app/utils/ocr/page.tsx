'use client';

import React, { useEffect, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';

type OcrLanguage = 'por' | 'eng' | 'spa' | 'por+eng';

const languageOptions: { value: OcrLanguage; label: string }[] = [
  { value: 'por', label: 'Português' },
  { value: 'eng', label: 'Inglês' },
  { value: 'spa', label: 'Espanhol' },
  { value: 'por+eng', label: 'Português + Inglês' },
];

const statusLabels: Record<string, string> = {
  'loading tesseract core': 'Carregando o motor de OCR',
  'initializing tesseract': 'Inicializando',
  'loading language traineddata': 'Baixando o idioma',
  'initializing api': 'Preparando',
  'recognizing text': 'Reconhecendo o texto',
};

const OcrPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [language, setLanguage] = useState<OcrLanguage>('por');
  const [outputText, setOutputText] = useState('');
  const [progress, setProgress] = useState<{ status: string; value: number } | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const isProcessing = progress !== null;

  const selectImage = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem (PNG, JPG, WEBP, BMP...).');
      return;
    }
    setError('');
    setOutputText('');
    setConfidence(null);
    setImage(file);
  };

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Ctrl+V cola uma imagem da área de transferência
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((entry) => entry.type.startsWith('image/'));
      if (item) selectImage(item.getAsFile());
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const handleRecognize = async () => {
    if (!image) return;
    setError('');
    setOutputText('');
    setConfidence(null);
    setProgress({ status: 'Carregando o motor de OCR', value: 0 });
    try {
      // Carregado sob demanda: o motor e os idiomas vêm do CDN só quando o usuário usa a ferramenta
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker(language, 1, {
        logger: (message) => setProgress({ status: statusLabels[message.status] ?? message.status, value: message.progress }),
      });
      try {
        const { data } = await worker.recognize(image);
        setOutputText(data.text.trim());
        setConfidence(data.confidence);
      } finally {
        await worker.terminate();
      }
    } catch {
      setError('Não foi possível reconhecer o texto. Verifique sua conexão (o idioma é baixado na primeira vez) e tente novamente.');
    } finally {
      setProgress(null);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreviewUrl('');
    setOutputText('');
    setConfidence(null);
    setError('');
  };

  return (
    <ToolPage
      title="Extrator de Texto (OCR)"
      description="Extraia o texto de imagens e prints. O reconhecimento roda no seu navegador e a imagem não é enviada"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); selectImage(e.dataTransfer.files[0]); }}
            className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-accent bg-accent/5' : 'border-line-strong hover:border-accent'}`}
          >
            <input type="file" accept="image/*" className="hidden" onChange={(e) => selectImage(e.target.files?.[0])} />
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Imagem selecionada" className="mx-auto max-h-72 rounded-md object-contain" />
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-fg mb-1">Clique, arraste uma imagem ou cole com Ctrl+V</p>
                <p className="text-sm text-muted">PNG, JPG, WEBP, BMP ou GIF</p>
              </>
            )}
          </label>

          <div className="space-y-2">
            <span className="eyebrow block">Idioma do texto</span>
            <SegmentedControl ariaLabel="Idioma" options={languageOptions} value={language} onChange={setLanguage} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleRecognize} className="btn-primary" disabled={!image || isProcessing}>
              {isProcessing ? 'Processando...' : 'Extrair texto'}
            </button>
            <button onClick={handleClear} className="btn-error" disabled={!image || isProcessing}>
              Limpar
            </button>
          </div>

          {progress && (
            <div className="space-y-1.5" role="status">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{progress.status}</span>
                <span className="font-mono">{Math.round(progress.value * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                <div className="h-full bg-accent transition-[width]" style={{ width: `${progress.value * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {error && <div className="notice notice-error text-danger text-sm">{error}</div>}

        {(outputText || confidence !== null) && (
          <div className="card-modern space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-fg">
                Texto extraído
                {confidence !== null && <span className="text-sm font-normal text-muted"> · confiança {Math.round(confidence)}%</span>}
              </h3>
              <CopyButton text={outputText} />
            </div>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Nenhum texto encontrado na imagem."
              className="input-modern h-64 font-mono text-sm"
            />
          </div>
        )}

        <div className="notice notice-info text-sm">
          Funciona melhor com texto impresso, nítido e em fundo uniforme. Na primeira vez o idioma escolhido é baixado (alguns MB) e fica em cache.
        </div>
      </div>
    </ToolPage>
  );
};

export default OcrPage;
