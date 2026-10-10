"use client";

import React, { useEffect, useRef, useState } from 'react';

interface DateInputProps {
  // Mesmo formato do input nativo: AAAA-MM-DD, ou '' quando vazio
  value: string;
  onChange: (value: string) => void;
  className?: string;
  wrapperClassName?: string;
  ariaLabel?: string;
}

const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const pad = (value: number) => String(value).padStart(2, '0');

const toIso = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

const parseIso = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
};

const isoToDisplay = (value: string) => {
  const parsed = parseIso(value);
  return parsed ? `${pad(parsed.day)}/${pad(parsed.month + 1)}/${parsed.year}` : '';
};

// Aceita só dígitos e monta dd/mm/aaaa enquanto digita
const maskDisplay = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
};

const displayToIso = (text: string) => {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [day, month, year] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return toIso(year, month, day);
};

const todayIso = () => {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
};

// Campo de data com calendário próprio: o seletor nativo abre fora do popup da extensão
const DateInput: React.FC<DateInputProps> = ({ value, onChange, className = 'input-modern', wrapperClassName = '', ariaLabel }) => {
  const [text, setText] = useState(() => isoToDisplay(value));
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(() => {
    const parsed = parseIso(value) ?? parseIso(todayIso())!;
    return { year: parsed.year, month: parsed.month };
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Atualiza o texto quando o valor muda por fora (ex.: botão "hoje")
  useEffect(() => {
    setText((current) => (displayToIso(current) === value ? current : isoToDisplay(value)));
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDisplay(e.target.value);
    setText(masked);
    if (masked === '') {
      onChange('');
      return;
    }
    const iso = displayToIso(masked);
    if (iso) onChange(iso);
  };

  const toggleCalendar = () => {
    if (!isOpen) {
      const parsed = parseIso(value) ?? parseIso(todayIso())!;
      setView({ year: parsed.year, month: parsed.month });
    }
    setIsOpen(!isOpen);
  };

  const moveMonth = (offset: number) => {
    setView((current) => {
      const date = new Date(current.year, current.month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const selectDate = (iso: string) => {
    onChange(iso);
    setText(isoToDisplay(iso));
    setIsOpen(false);
  };

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const totalDays = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ];
  const monthName = new Date(view.year, view.month, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const today = todayIso();
  const isInvalid = text.length === 10 && !displayToIso(text);

  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        value={text}
        onChange={handleTextChange}
        aria-label={ariaLabel}
        aria-invalid={isInvalid}
        className={`${className} !pr-11 font-mono ${isInvalid ? '!border-danger' : ''}`}
      />
      <button
        type="button"
        onClick={toggleCalendar}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-hover transition-colors"
        aria-label="Abrir calendário"
        aria-expanded={isOpen}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Calendário"
          className="absolute left-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-2rem)] p-3 rounded-[14px] border border-line-strong bg-surface shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => moveMonth(-1)} className="btn-secondary !p-1.5" aria-label="Mês anterior">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-sm font-semibold">{monthLabel}</span>
            <button type="button" onClick={() => moveMonth(1)} className="btn-secondary !p-1.5" aria-label="Próximo mês">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((label, index) => (
              <span key={index} className="text-[0.7rem] font-medium text-muted py-1">{label}</span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />;
              const iso = toIso(view.year, view.month, day);
              const isSelected = iso === value;
              const isToday = iso === today;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => selectDate(iso)}
                  className={`h-8 rounded-lg text-sm transition-colors ${isSelected
                    ? 'bg-accent text-accent-ink font-semibold'
                    : `hover:bg-surface-hover ${isToday ? 'text-accent font-semibold ring-1 ring-accent/50' : 'text-fg'}`
                    }`}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-2 pt-2 border-t border-line text-sm">
            <button type="button" onClick={() => selectDate(today)} className="text-accent hover:underline">Hoje</button>
            <button type="button" onClick={() => setIsOpen(false)} className="text-muted hover:text-fg">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
