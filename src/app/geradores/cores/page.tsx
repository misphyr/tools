'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';
import Toast from '@/components/Toast';
import { Rgb, hslToRgb, rgbToHex, formatRgb, formatHsl, readableTextColor } from '@/utils/colors';

type PaletteMode = 'random' | 'pastel' | 'analogous' | 'complementary' | 'triadic' | 'monochrome';
type DisplayFormat = 'hex' | 'rgb' | 'hsl';

interface Swatch {
  color: Rgb;
  isLocked: boolean;
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

// Gera as cores da paleta a partir de um matiz base sorteado
const generateColors = (mode: PaletteMode, count: number): Rgb[] => {
  const baseHue = Math.random() * 360;
  return Array.from({ length: count }, (_, i) => {
    switch (mode) {
      case 'pastel':
        return hslToRgb({ h: Math.random() * 360, s: randomBetween(55, 80), l: randomBetween(78, 88) });
      case 'analogous':
        return hslToRgb({ h: baseHue + (i - count / 2) * 15, s: randomBetween(55, 80), l: randomBetween(40, 65) });
      case 'complementary':
        return hslToRgb({ h: baseHue + (i % 2) * 180, s: randomBetween(50, 85), l: randomBetween(30, 75) });
      case 'triadic':
        return hslToRgb({ h: baseHue + (i % 3) * 120, s: randomBetween(50, 85), l: randomBetween(35, 70) });
      case 'monochrome':
        return hslToRgb({ h: baseHue, s: randomBetween(45, 75), l: 15 + (70 / Math.max(1, count - 1)) * i });
      default:
        return { r: Math.floor(Math.random() * 256), g: Math.floor(Math.random() * 256), b: Math.floor(Math.random() * 256) };
    }
  });
};

const formatColor = (color: Rgb, format: DisplayFormat) => {
  if (format === 'rgb') return formatRgb(color);
  if (format === 'hsl') return formatHsl(color);
  return rgbToHex(color);
};

const modeOptions: { value: PaletteMode; label: string }[] = [
  { value: 'random', label: 'Aleatória' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'analogous', label: 'Análoga' },
  { value: 'complementary', label: 'Complementar' },
  { value: 'triadic', label: 'Triádica' },
  { value: 'monochrome', label: 'Monocromática' },
];

const RandomColorPage: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('random');
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<DisplayFormat>('hex');
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regenerate = useCallback(() => {
    setSwatches((current) => {
      const fresh = generateColors(mode, count);
      return fresh.map((color, i) => (current[i]?.isLocked ? current[i] : { color, isLocked: false }));
    });
  }, [mode, count]);

  // Gera ao abrir a página e quando o modo ou a quantidade mudam
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Barra de espaço gera uma nova paleta (fora de campos de texto)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.code !== 'Space' || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
      e.preventDefault();
      regenerate();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [regenerate]);

  const toggleLock = (index: number) => {
    setSwatches((current) => current.map((swatch, i) => (i === index ? { ...swatch, isLocked: !swatch.isLocked } : swatch)));
  };

  const copyColor = (color: Rgb) => {
    const value = formatColor(color, format);
    navigator.clipboard.writeText(value).then(() => setToastMessage(`${value} copiado!`)).catch(() => setToastMessage('Erro ao copiar.'));
  };

  const closeToast = useCallback(() => setToastMessage(null), []);

  const cssVariables = `:root {\n${swatches.map((swatch, i) => `  --color-${i + 1}: ${formatColor(swatch.color, format)};`).join('\n')}\n}`;
  const plainList = swatches.map((swatch) => formatColor(swatch.color, format)).join('\n');

  return (
    <ToolPage
      title="Gerador de Cores"
      description="Gere cores e paletas aleatórias. Trave as que gostar e aperte espaço para sortear as outras"
      category="geradores"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <SegmentedControl ariaLabel="Tipo de paleta" options={modeOptions} value={mode} onChange={setMode} />
          <div className="flex flex-wrap items-end gap-4">
            <label className="space-y-2">
              <span className="eyebrow block">Quantidade: {count}</span>
              <input
                type="range"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-40 accent-[rgb(var(--c-accent))]"
              />
            </label>
            <div className="space-y-2">
              <span className="eyebrow block">Formato</span>
              <SegmentedControl
                ariaLabel="Formato"
                options={[{ value: 'hex', label: 'HEX' }, { value: 'rgb', label: 'RGB' }, { value: 'hsl', label: 'HSL' }]}
                value={format}
                onChange={setFormat}
              />
            </div>
            <button onClick={regenerate} className="btn-primary ml-auto">
              Gerar nova paleta <kbd className="hidden sm:inline text-xs opacity-70">espaço</kbd>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {swatches.map((swatch, index) => {
            const textColor = readableTextColor(swatch.color);
            return (
              <div key={index} className="rounded-[14px] overflow-hidden border border-line animate-fade-in">
                <button
                  onClick={() => copyColor(swatch.color)}
                  className="w-full h-32 flex items-end justify-start p-3 font-mono text-sm font-semibold transition-[filter] hover:brightness-110"
                  style={{ backgroundColor: rgbToHex(swatch.color), color: textColor }}
                  title="Clique para copiar"
                >
                  {rgbToHex(swatch.color)}
                </button>
                <div className="bg-surface flex items-center justify-between gap-2 px-3 py-2">
                  <code className="text-xs text-muted truncate">{format === 'hex' ? `${Math.round(swatch.color.r)}, ${Math.round(swatch.color.g)}, ${Math.round(swatch.color.b)}` : formatColor(swatch.color, format)}</code>
                  <button
                    onClick={() => toggleLock(index)}
                    className={`shrink-0 p-1 rounded-md transition-colors ${swatch.isLocked ? 'text-accent' : 'text-muted hover:text-fg'}`}
                    aria-label={swatch.isLocked ? 'Destravar cor' : 'Travar cor'}
                    title={swatch.isLocked ? 'Destravar' : 'Travar'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {swatch.isLocked
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />}
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-modern space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-fg">Exportar</h3>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={plainList} label="Copiar lista" className="btn-secondary btn-sm" />
              <CopyButton text={cssVariables} label="Copiar CSS" className="btn-info btn-sm" />
            </div>
          </div>
          <pre className="panel-output text-sm overflow-auto">{cssVariables}</pre>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={closeToast} />}
    </ToolPage>
  );
};

export default RandomColorPage;
