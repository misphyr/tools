'use client';

import React, { useEffect, useRef, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import SegmentedControl from '@/components/SegmentedControl';

type ClockMode = 'stopwatch' | 'timer';

const formatTime = (ms: number, showCentiseconds: boolean) => {
  const total = Math.max(0, ms);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  const centiseconds = Math.floor((total % 1000) / 10);
  const base = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return showCentiseconds ? `${base}.${String(centiseconds).padStart(2, '0')}` : base;
};

// Relógio que acumula tempo entre pausas, baseado em performance.now()
const useClock = () => {
  const [accumulated, setAccumulated] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const interval = setInterval(() => setNow(performance.now()), 33);
    return () => clearInterval(interval);
  }, [startedAt]);

  const elapsed = accumulated + (startedAt !== null ? Math.max(0, now - startedAt) : 0);

  const start = () => {
    const current = performance.now();
    setNow(current);
    setStartedAt(current);
  };
  const pause = () => {
    setAccumulated(elapsed);
    setStartedAt(null);
  };
  const reset = () => {
    setAccumulated(0);
    setStartedAt(null);
  };

  return { elapsed, isRunning: startedAt !== null, start, pause, reset };
};

const playAlarm = () => {
  try {
    const audioContext = new AudioContext();
    [0, 0.35, 0.7].forEach((delay) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + 0.3);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.3);
    });
    setTimeout(() => audioContext.close(), 1500);
  } catch {
    // áudio indisponível: o aviso visual continua aparecendo
  }
};

const presets = [1, 5, 10, 15, 25, 30];

const StopwatchTimerPage: React.FC = () => {
  const [mode, setMode] = useState<ClockMode>('stopwatch');
  const clock = useClock();
  const [laps, setLaps] = useState<number[]>([]);

  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const durationMs = (timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds) * 1000;
  const remaining = durationMs - clock.elapsed;

  const { isRunning, pause } = clock;
  const pauseRef = useRef(pause);
  pauseRef.current = pause;

  useEffect(() => {
    if (mode === 'timer' && isRunning && remaining <= 0) {
      pauseRef.current();
      setIsFinished(true);
      playAlarm();
    }
  }, [mode, isRunning, remaining]);

  const display = mode === 'stopwatch' ? formatTime(clock.elapsed, true) : formatTime(Math.ceil(remaining / 1000) * 1000, false);

  useEffect(() => {
    const original = document.title;
    if (clock.isRunning || isFinished) document.title = `${isFinished ? '⏰ Tempo esgotado' : display.split('.')[0]} · misphyr.tools`;
    return () => { document.title = original; };
  }, [display, clock.isRunning, isFinished]);

  const handleModeChange = (next: ClockMode) => {
    setMode(next);
    clock.reset();
    setLaps([]);
    setIsFinished(false);
  };

  const handleReset = () => {
    clock.reset();
    setLaps([]);
    setIsFinished(false);
  };

  const handleStart = () => {
    setIsFinished(false);
    if (mode === 'timer' && remaining <= 0) clock.reset();
    clock.start();
  };

  const setPreset = (minutes: number) => {
    clock.reset();
    setIsFinished(false);
    setTimerInput({ hours: Math.floor(minutes / 60), minutes: minutes % 60, seconds: 0 });
  };

  const updateTimerInput = (field: keyof typeof timerInput, value: number) => {
    const max = field === 'hours' ? 99 : 59;
    setTimerInput((current) => ({ ...current, [field]: Math.min(max, Math.max(0, value || 0)) }));
  };

  const progress = mode === 'timer' && durationMs > 0 ? Math.min(1, clock.elapsed / durationMs) : 0;
  const canEditTimer = mode === 'timer' && !clock.isRunning && clock.elapsed === 0;

  return (
    <ToolPage
      title="Cronômetro e Timer"
      description="Cronômetro com voltas e timer de contagem regressiva com alarme sonoro"
      category="utils"
    >
      <div className="space-y-6">
        <SegmentedControl
          ariaLabel="Modo"
          options={[{ value: 'stopwatch', label: 'Cronômetro' }, { value: 'timer', label: 'Timer' }]}
          value={mode}
          onChange={handleModeChange}
        />

        <div className={`card-modern text-center space-y-6 transition-colors ${isFinished ? '!border-warning' : ''}`}>
          {canEditTimer ? (
            <div className="flex items-center justify-center gap-2 font-mono text-4xl sm:text-6xl font-bold">
              {(['hours', 'minutes', 'seconds'] as const).map((field, index) => (
                <React.Fragment key={field}>
                  {index > 0 && <span className="text-muted">:</span>}
                  <input
                    type="number"
                    min={0}
                    max={field === 'hours' ? 99 : 59}
                    value={String(timerInput[field]).padStart(2, '0')}
                    onChange={(e) => updateTimerInput(field, Number(e.target.value))}
                    aria-label={{ hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' }[field]}
                    className="w-[2.4ch] bg-transparent text-center outline-none border-b-2 border-line-strong focus:border-accent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p
              className={`font-mono text-4xl sm:text-6xl font-bold tabular-nums ${isFinished ? 'text-warning animate-pulse' : 'text-fg'}`}
              role="timer"
              aria-live="off"
            >
              {display}
            </p>
          )}

          {mode === 'timer' && (
            <div className="h-1.5 rounded-full bg-bg overflow-hidden">
              <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
            </div>
          )}

          {isFinished && <p className="text-warning font-semibold">Tempo esgotado!</p>}

          <div className="flex flex-wrap justify-center gap-3">
            {clock.isRunning ? (
              <button onClick={clock.pause} className="btn-warning btn-lg">Pausar</button>
            ) : (
              <button
                onClick={handleStart}
                className="btn-primary btn-lg"
                disabled={mode === 'timer' && durationMs === 0}
              >
                {clock.elapsed > 0 && !isFinished ? 'Continuar' : 'Iniciar'}
              </button>
            )}
            {mode === 'stopwatch' && (
              <button onClick={() => setLaps((current) => [clock.elapsed, ...current])} className="btn-secondary btn-lg" disabled={!clock.isRunning}>
                Volta
              </button>
            )}
            <button onClick={handleReset} className="btn-error btn-lg" disabled={clock.elapsed === 0 && !isFinished}>
              Zerar
            </button>
          </div>

          {mode === 'timer' && (
            <div className="flex flex-wrap justify-center gap-2">
              {presets.map((minutes) => (
                <button key={minutes} onClick={() => setPreset(minutes)} className="btn-secondary btn-sm" disabled={clock.isRunning}>
                  {minutes} min
                </button>
              ))}
            </div>
          )}
        </div>

        {mode === 'stopwatch' && laps.length > 0 && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-fg mb-4">Voltas</h3>
            <ul className="panel-output !p-0 max-h-80 overflow-auto divide-y divide-line font-mono text-sm">
              {laps.map((lapTime, index) => {
                const lapNumber = laps.length - index;
                const previous = laps[index + 1] ?? 0;
                return (
                  <li key={lapNumber} className="flex justify-between gap-4 px-4 py-2">
                    <span className="text-muted">Volta {lapNumber}</span>
                    <span className="text-accent">+{formatTime(lapTime - previous, true)}</span>
                    <span>{formatTime(lapTime, true)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default StopwatchTimerPage;
