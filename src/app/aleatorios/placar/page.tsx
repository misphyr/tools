'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ToolPage from '@/components/ToolPage';
import { hslToRgb, parseColor, readableTextColor, rgbToHex, rgbToHsl } from '@/utils/colors';

interface Side {
  id: number;
  score: number;
  color: string;
}

const minSides = 2;
const maxSides = 8;
const defaultBaseColor = '#A78BFA';

const sideLabel = (index: number) => `Lado ${String.fromCharCode(65 + index)}`;

// Cores com matizes igualmente espaçados a partir da cor base (com 2 lados, a segunda é a oposta)
const spreadColors = (baseHex: string, count: number) => {
  const hsl = rgbToHsl(parseColor(baseHex) ?? { r: 167, g: 139, b: 250 });
  return Array.from({ length: count }, (_, index) => rgbToHex(hslToRgb({ ...hsl, h: hsl.h + (360 * index) / count })));
};

// Cor nova no meio do maior intervalo de matiz entre as cores que já existem
const nextColor = (colors: string[]) => {
  const hslList = colors.map((color) => rgbToHsl(parseColor(color) ?? { r: 0, g: 0, b: 0 }));
  const hues = hslList.map((hsl) => hsl.h).sort((a, b) => a - b);
  let bestHue = 0;
  let bestGap = -1;
  hues.forEach((hue, index) => {
    const next = index === hues.length - 1 ? hues[0] + 360 : hues[index + 1];
    if (next - hue > bestGap) {
      bestGap = next - hue;
      bestHue = hue + bestGap / 2;
    }
  });
  return rgbToHex(hslToRgb({ ...hslList[0], h: bestHue }));
};

const createSides = (count: number): Side[] =>
  spreadColors(defaultBaseColor, count).map((color, index) => ({ id: index, score: 0, color }));

const usePortrait = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(orientation: portrait)');
    const update = () => setIsPortrait(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return isPortrait;
};

interface ScoreButtonProps {
  label: string;
  score: number;
  color: string;
  onIncrement: () => void;
  fullscreenFontSize?: string;
}

// Área clicável do placar: cada toque soma um ponto
const ScoreButton: React.FC<ScoreButtonProps> = ({ label, score, color, onIncrement, fullscreenFontSize }) => {
  const rgb = parseColor(color);
  const textColor = rgb ? readableTextColor(rgb) : undefined;
  const isFullscreen = fullscreenFontSize !== undefined;
  return (
    <button
      onClick={onIncrement}
      aria-label={`${label}: ${score} pontos. Somar um ponto`}
      style={{ backgroundColor: color, color: textColor }}
      className={`flex flex-col items-center justify-center select-none touch-manipulation transition-[filter] hover:brightness-105 active:brightness-90 ${isFullscreen
        ? ''
        : 'min-h-[14rem] sm:min-h-[18rem] rounded-xl'
        }`}
    >
      {!isFullscreen && <span className="font-mono text-xs uppercase tracking-widest opacity-70">{label}</span>}
      <span
        className={`font-mono font-bold tabular-nums leading-none ${isFullscreen ? '' : 'text-7xl sm:text-8xl mt-2'}`}
        style={isFullscreen ? { fontSize: fullscreenFontSize } : undefined}
      >
        {score}
      </span>
    </button>
  );
};

const ScoreboardPage: React.FC = () => {
  const [sides, setSides] = useState<Side[]>(() => createSides(minSides));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(minSides);
  const isPortrait = usePortrait();

  const updateSide = (id: number, changes: Partial<Side>) =>
    setSides((current) => current.map((side) => (side.id === id ? { ...side, ...changes } : side)));
  const increment = (id: number) =>
    setSides((current) => current.map((side) => (side.id === id ? { ...side, score: side.score + 1 } : side)));
  const decrement = (id: number) =>
    setSides((current) => current.map((side) => (side.id === id ? { ...side, score: Math.max(0, side.score - 1) } : side)));
  const reset = () => setSides((current) => current.map((side) => ({ ...side, score: 0 })));

  const defaultColors = spreadColors(defaultBaseColor, sides.length);
  const isDefaultColors = sides.every((side, index) => side.color === defaultColors[index]);
  const applyColors = (colors: string[]) => setSides((current) => current.map((side, index) => ({ ...side, color: colors[index] })));

  // Enquanto as cores forem as padrão, o novo lado redistribui todas; se foram personalizadas, só ganha uma cor nova
  const addSide = () => {
    if (sides.length >= maxSides) return;
    const id = nextIdRef.current++;
    if (isDefaultColors) {
      const colors = spreadColors(defaultBaseColor, sides.length + 1);
      setSides([...sides.map((side, index) => ({ ...side, color: colors[index] })), { id, score: 0, color: colors[sides.length] }]);
    } else {
      setSides([...sides, { id, score: 0, color: nextColor(sides.map((side) => side.color)) }]);
    }
  };

  const removeSide = (id: number) => {
    if (sides.length <= minSides) return;
    const remaining = sides.filter((side) => side.id !== id);
    if (isDefaultColors) {
      const colors = spreadColors(defaultBaseColor, remaining.length);
      setSides(remaining.map((side, index) => ({ ...side, color: colors[index] })));
    } else {
      setSides(remaining);
    }
  };

  const enterFullscreen = () => setIsFullscreen(true);

  const exitFullscreen = () => {
    setIsFullscreen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  };

  // A tela cheia do navegador é pedida depois do overlay montar; sem suporte (ex.: iPhone), o overlay cobre a página
  useEffect(() => {
    if (!isFullscreen) return;
    overlayRef.current?.requestFullscreen?.().catch(() => undefined);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Grade da tela cheia: até 3 lados ficam numa linha (ou coluna, em pé); acima disso, duas linhas (ou colunas)
  const columns = isPortrait ? (sides.length <= 3 ? 1 : 2) : (sides.length <= 3 ? sides.length : Math.ceil(sides.length / 2));
  const rows = Math.ceil(sides.length / columns);
  const fullscreenFontSize = `min(${40 / columns}vw, ${45 / rows}vh)`;
  // Com linhas e colunas ímpares o centro da tela cai sobre um número, então os controles vão para baixo
  const controlsAtCenter = columns % 2 === 0 || rows % 2 === 0;
  const hasScore = sides.some((side) => side.score > 0);

  return (
    <ToolPage
      title="Placar"
      description="Contador de pontos para dois ou mais lados. Toque no número para somar um ponto ou abra em tela cheia"
      category="aleatorios"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-6">
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${sides.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {sides.map((side, index) => (
              <div key={side.id} className="flex flex-col gap-2">
                <ScoreButton label={sideLabel(index)} score={side.score} color={side.color} onIncrement={() => increment(side.id)} />
                <button onClick={() => decrement(side.id)} className="btn-secondary btn-sm" disabled={side.score === 0}>
                  −1 no {sideLabel(index)}
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={enterFullscreen} className="btn-primary btn-lg">Tela cheia</button>
            <button onClick={addSide} className="btn-secondary btn-lg" disabled={sides.length >= maxSides}>
              Adicionar lado
            </button>
            <button onClick={reset} className="btn-error btn-lg" disabled={!hasScore}>
              Reiniciar
            </button>
          </div>
        </div>

        <div className="card-modern space-y-4">
          <h3 className="text-lg font-semibold text-fg">Lados e cores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sides.map((side, index) => (
              <div key={side.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={side.color.toLowerCase()}
                  onChange={(e) => updateSide(side.id, { color: e.target.value.toUpperCase() })}
                  className="h-12 w-14 shrink-0 cursor-pointer rounded-[10px] border border-line-strong bg-bg p-1"
                  aria-label={`Cor do ${sideLabel(index)}`}
                />
                <span className="flex-1 space-y-0.5">
                  <span className="eyebrow block">{sideLabel(index)}</span>
                  <span className="font-mono text-sm">{side.color}</span>
                </span>
                {sides.length > minSides && (
                  <button onClick={() => removeSide(side.id)} className="btn-error btn-sm" aria-label={`Remover ${sideLabel(index)}`}>
                    Remover
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyColors(spreadColors(sides[0].color, sides.length))} className="btn-secondary btn-sm">
              Espalhar cores a partir do Lado A
            </button>
            <button onClick={() => applyColors(sides.map((side, index) => sides[(index + 1) % sides.length].color))} className="btn-secondary btn-sm">
              Girar cores
            </button>
            <button onClick={() => applyColors(defaultColors)} className="btn-secondary btn-sm" disabled={isDefaultColors}>
              Cores padrão
            </button>
          </div>
        </div>
      </div>

      {isFullscreen && createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-bg grid"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        >
          {sides.map((side, index) => (
            <ScoreButton
              key={side.id}
              label={sideLabel(index)}
              score={side.score}
              color={side.color}
              onIncrement={() => increment(side.id)}
              fullscreenFontSize={fullscreenFontSize}
            />
          ))}

          <div
            className={`absolute left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl glass border border-line ${controlsAtCenter
              ? `top-1/2 -translate-y-1/2 ${rows === 1 ? 'flex-col' : 'flex-row'}`
              : 'bottom-4 flex-row'
              }`}
          >
            <button onClick={reset} className="btn-error !p-3" aria-label="Reiniciar placar" title="Reiniciar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            </button>
            <button onClick={exitFullscreen} className="btn-secondary !p-3" aria-label="Sair da tela cheia" title="Sair da tela cheia">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 4v5H4" />
                <path d="M15 4v5h5" />
                <path d="M9 20v-5H4" />
                <path d="M15 20v-5h5" />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </ToolPage>
  );
};

export default ScoreboardPage;
