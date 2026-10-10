'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';
import { downloadText } from '@/utils/downloadText';

type UuidVersion = 'v4' | 'v7';

const toHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const formatUuid = (bytes: Uint8Array) => {
  const hex = toHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// v4: 122 bits aleatórios
const uuidV4 = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
};

// v7: timestamp em ms nos 48 primeiros bits (ordenável) + bits aleatórios
const uuidV7 = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let timestamp = Date.now();
  for (let i = 5; i >= 0; i--) {
    bytes[i] = timestamp % 256;
    timestamp = Math.floor(timestamp / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
};

const UuidGeneratorPage: React.FC = () => {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);
  const [withBraces, setWithBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const formatOutput = (uuid: string) => {
    let result = withHyphens ? uuid : uuid.replace(/-/g, '');
    if (uppercase) result = result.toUpperCase();
    return withBraces ? `{${result}}` : result;
  };

  const handleGenerate = () => {
    const amount = Math.min(1000, Math.max(1, quantity || 1));
    const generate = version === 'v4' ? uuidV4 : uuidV7;
    setUuids(Array.from({ length: amount }, generate));
  };

  const output = uuids.map(formatOutput).join('\n');

  return (
    <ToolPage
      title="Gerador de UUID"
      description="Gere UUIDs v4 (aleatórios) ou v7 (ordenáveis por tempo) usando o gerador criptográfico do navegador"
      category="geradores"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <span className="eyebrow block">Versão</span>
              <SegmentedControl
                ariaLabel="Versão do UUID"
                options={[{ value: 'v4', label: 'v4 · aleatório' }, { value: 'v7', label: 'v7 · por tempo' }]}
                value={version}
                onChange={setVersion}
              />
            </div>
            <label className="space-y-2">
              <span className="eyebrow block">Quantidade</span>
              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input-modern !w-28 !py-2"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { label: 'Maiúsculas', checked: uppercase, set: setUppercase },
              { label: 'Com hífens', checked: withHyphens, set: setWithHyphens },
              { label: 'Com chaves { }', checked: withBraces, set: setWithBraces },
            ].map((option) => (
              <label key={option.label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => option.set(e.target.checked)}
                  className="checkbox-modern"
                />
                <span className="text-fg">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleGenerate} className="btn-primary">Gerar UUID{quantity > 1 ? 's' : ''}</button>
            <CopyButton text={output} label="Copiar tudo" />
            <button onClick={() => downloadText(output, 'uuids.txt')} className="btn-secondary" disabled={!output}>
              Baixar .txt
            </button>
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-fg mb-4">{uuids.length} UUID{uuids.length > 1 ? 's' : ''} gerado{uuids.length > 1 ? 's' : ''}</h3>
            <ul className="panel-output max-h-96 overflow-auto divide-y divide-line !p-0">
              {uuids.map((uuid, index) => (
                <li key={index} className="flex items-center justify-between gap-3 px-4 py-2">
                  <code className="text-sm break-all">{formatOutput(uuid)}</code>
                  <CopyButton text={formatOutput(uuid)} label="" className="btn-secondary !p-1.5 shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default UuidGeneratorPage;
