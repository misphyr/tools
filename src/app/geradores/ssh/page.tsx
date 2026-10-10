'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';
import { downloadText } from '@/utils/downloadText';
import { SshAlgorithm, SshKeyPair, generateSshKeyPair } from '@/utils/ssh';

const algorithmOptions: { value: SshAlgorithm; label: string }[] = [
  { value: 'ed25519', label: 'Ed25519' },
  { value: 'rsa-2048', label: 'RSA 2048' },
  { value: 'rsa-3072', label: 'RSA 3072' },
  { value: 'rsa-4096', label: 'RSA 4096' },
];

const SshKeyGeneratorPage: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SshAlgorithm>('ed25519');
  const [comment, setComment] = useState('');
  const [keyPair, setKeyPair] = useState<SshKeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    try {
      setKeyPair(await generateSshKeyPair(algorithm, comment));
    } catch {
      setKeyPair(null);
      setError(algorithm === 'ed25519'
        ? 'Seu navegador não suporta Ed25519 no Web Crypto. Atualize o navegador ou use RSA.'
        : 'Não foi possível gerar a chave neste navegador (é preciso HTTPS).');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolPage
      title="Gerador de Chaves SSH"
      description="Gere pares de chaves SSH Ed25519 ou RSA no formato OpenSSH, direto no navegador"
      category="geradores"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-5">
          <div className="space-y-2">
            <span className="eyebrow block">Algoritmo</span>
            <SegmentedControl ariaLabel="Algoritmo" options={algorithmOptions} value={algorithm} onChange={setAlgorithm} />
            <p className="text-sm text-muted">
              {algorithm === 'ed25519'
                ? 'Recomendado: chave curta, rápida e segura. Aceita pelo GitHub, GitLab e OpenSSH 6.5+.'
                : 'Use RSA só se o servidor não aceitar Ed25519. Chaves maiores demoram mais para gerar.'}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="eyebrow block">Comentário (opcional)</span>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="seu@email.com"
              className="input-modern font-mono"
            />
          </label>

          <button onClick={handleGenerate} className="btn-primary" disabled={isGenerating}>
            {isGenerating ? 'Gerando...' : 'Gerar par de chaves'}
          </button>
        </div>

        {error && <div className="notice notice-error text-danger text-sm">{error}</div>}

        {keyPair && (
          <>
            <div className="card-modern space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-fg">Chave pública <code className="text-sm text-muted">{keyPair.fileName}.pub</code></h3>
                <div className="flex gap-2">
                  <CopyButton text={keyPair.publicKey} className="btn-info btn-sm" />
                  <button onClick={() => downloadText(keyPair.publicKey + '\n', `${keyPair.fileName}.pub`)} className="btn-secondary btn-sm">
                    Baixar
                  </button>
                </div>
              </div>
              <pre className="panel-output text-sm whitespace-pre-wrap break-all">{keyPair.publicKey}</pre>
              <p className="text-sm text-muted">
                Impressão digital: <code className="text-fg break-all">{keyPair.fingerprint}</code>
              </p>
            </div>

            <div className="card-modern space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-fg">Chave privada <code className="text-sm text-muted">{keyPair.fileName}</code></h3>
                <div className="flex gap-2">
                  <CopyButton text={keyPair.privateKey} className="btn-info btn-sm" />
                  <button onClick={() => downloadText(keyPair.privateKey, keyPair.fileName)} className="btn-secondary btn-sm">
                    Baixar
                  </button>
                </div>
              </div>
              <pre className="panel-output text-xs max-h-64 overflow-auto whitespace-pre-wrap break-all">{keyPair.privateKey}</pre>
            </div>

            <div className="notice notice-info text-sm space-y-2">
              <p className="font-semibold text-accent">Próximos passos</p>
              <ol className="list-decimal pl-5 space-y-1 text-fg">
                <li>Salve a chave privada em <code>~/.ssh/{keyPair.fileName}</code> e restrinja o acesso: <code>chmod 600 ~/.ssh/{keyPair.fileName}</code></li>
                <li>A chave privada é gerada sem senha. Para adicionar uma: <code>ssh-keygen -p -f ~/.ssh/{keyPair.fileName}</code></li>
                <li>Cole a chave pública no servidor (<code>~/.ssh/authorized_keys</code>) ou no GitHub/GitLab.</li>
              </ol>
            </div>
          </>
        )}

        <div className="notice notice-warning text-sm">
          As chaves são geradas no seu navegador pelo Web Crypto e nada é enviado para servidor. Para chaves de produção,
          prefira rodar <code>ssh-keygen</code> na própria máquina.
        </div>
      </div>
    </ToolPage>
  );
};

export default SshKeyGeneratorPage;
