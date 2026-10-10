'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import {
  Rgb, parseColor, rgbToHex, rgbToHsl, rgbToHsv, rgbToCmyk, formatRgb, formatHsl, contrastRatio, readableTextColor,
} from '@/utils/colors';

const white: Rgb = { r: 255, g: 255, b: 255 };
const black: Rgb = { r: 0, g: 0, b: 0 };

const contrastLabel = (ratio: number) => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA grande';
  return 'Reprovado';
};

const ColorConverterPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('#A78BFA');
  const [color, setColor] = useState<Rgb>({ r: 167, g: 139, b: 250 });
  const [isInvalid, setIsInvalid] = useState(false);

  const handleInput = (value: string) => {
    setInputValue(value);
    const parsed = parseColor(value);
    setIsInvalid(!parsed && value.trim() !== '');
    if (parsed) setColor(parsed);
  };

  const updateChannel = (channel: keyof Rgb, value: number) => {
    const next = { ...color, [channel]: value };
    setColor(next);
    setInputValue(rgbToHex(next));
    setIsInvalid(false);
  };

  const hex = rgbToHex(color);
  const hsl = rgbToHsl(color);
  const hsv = rgbToHsv(color);
  const cmyk = rgbToCmyk(color);

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: formatRgb(color) },
    { label: 'HSL', value: formatHsl(color) },
    { label: 'HSV', value: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)` },
    { label: 'CMYK', value: `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)` },
    { label: 'CSS var', value: `--color: ${hex};` },
  ];

  const contrasts = [
    { label: 'Texto branco', ratio: contrastRatio(color, white), text: '#FFFFFF' },
    { label: 'Texto preto', ratio: contrastRatio(color, black), text: '#000000' },
  ];

  return (
    <ToolPage
      title="Conversor de Cores"
      description="Converta cores entre HEX, RGB, HSL, HSV e CMYK e confira o contraste para acessibilidade"
      category="utils"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_14rem] gap-4">
          <div className="card-modern space-y-5">
            <label className="block space-y-2">
              <span className="eyebrow block">Cor de entrada</span>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={hex.toLowerCase()}
                  onChange={(e) => handleInput(e.target.value.toUpperCase())}
                  className="h-12 w-14 shrink-0 cursor-pointer rounded-[10px] border border-line-strong bg-bg p-1"
                  aria-label="Seletor de cor"
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInput(e.target.value)}
                  placeholder="#A78BFA, rgb(167, 139, 250) ou hsl(255, 92%, 76%)"
                  className={`input-modern font-mono ${isInvalid ? '!border-danger' : ''}`}
                />
              </div>
              {isInvalid && <p className="text-danger text-sm">Formato não reconhecido. Use HEX, rgb() ou hsl().</p>}
            </label>

            <div className="space-y-3">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <label key={channel} className="flex items-center gap-3">
                  <span className="font-mono text-sm uppercase w-4 text-muted">{channel}</span>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={color[channel]}
                    onChange={(e) => updateChannel(channel, Number(e.target.value))}
                    className="flex-1 accent-[rgb(var(--c-accent))]"
                  />
                  <span className="font-mono text-sm w-10 text-right">{color[channel]}</span>
                </label>
              ))}
            </div>
          </div>

          <div
            className="card-modern flex flex-col items-center justify-center min-h-[10rem] font-mono font-bold text-xl transition-colors"
            style={{ backgroundColor: hex, color: readableTextColor(color) }}
          >
            {hex}
            <span className="text-sm font-normal opacity-80">{Math.round(hsl.h)}° · {Math.round(hsl.s)}% · {Math.round(hsl.l)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map((format) => (
            <div key={format.label} className="card-modern !p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="eyebrow block">{format.label}</span>
                <code className="text-sm break-all">{format.value}</code>
              </div>
              <CopyButton text={format.value} label="" className="btn-secondary !p-2 shrink-0" />
            </div>
          ))}
        </div>

        <div className="card-modern">
          <h3 className="text-lg font-semibold text-fg mb-4">Contraste (WCAG)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contrasts.map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-[10px] border border-line p-3">
                <span
                  className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: hex, color: item.text }}
                >
                  Aa
                </span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted">
                    <span className="font-mono text-fg">{item.ratio.toFixed(2)}:1</span> ·{' '}
                    <span className={item.ratio >= 4.5 ? 'text-success' : item.ratio >= 3 ? 'text-warning' : 'text-danger'}>
                      {contrastLabel(item.ratio)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default ColorConverterPage;
