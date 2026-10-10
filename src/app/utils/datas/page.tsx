'use client';

import React, { useEffect, useState } from 'react';
import ToolPage from '@/components/ToolPage';
import StatCard from '@/components/StatCard';
import SegmentedControl from '@/components/SegmentedControl';
import DateInput from '@/components/DateInput';

const msPerDay = 86_400_000;

const toInputValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const parseInputDate = (value: string): Date | null => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

// Diferença em dias de calendário, sem efeito de horário de verão
const dayNumber = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / msPerDay;

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const calendarDiff = (start: Date, end: Date) => {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months--;
    days += daysInMonth(end.getFullYear(), end.getMonth() - 1);
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
};

const countBusinessDays = (start: Date, end: Date, includeEnd: boolean) => {
  const totalDays = dayNumber(end) - dayNumber(start) + (includeEnd ? 1 : 0);
  const fullWeeks = Math.floor(totalDays / 7);
  let count = fullWeeks * 5;
  const startWeekday = start.getDay();
  for (let i = 0; i < totalDays % 7; i++) {
    const weekday = (startWeekday + i) % 7;
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return count;
};

const plural = (value: number, singular: string, pluralForm: string) => `${value} ${value === 1 ? singular : pluralForm}`;

const formatLongDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

type AddUnit = 'days' | 'businessDays' | 'weeks' | 'months' | 'years';

const addToDate = (date: Date, amount: number, unit: AddUnit) => {
  const result = new Date(date);
  if (unit === 'days') result.setDate(result.getDate() + amount);
  if (unit === 'weeks') result.setDate(result.getDate() + amount * 7);
  if (unit === 'months' || unit === 'years') {
    const day = result.getDate();
    result.setDate(1);
    result.setMonth(result.getMonth() + (unit === 'years' ? amount * 12 : amount));
    result.setDate(Math.min(day, daysInMonth(result.getFullYear(), result.getMonth())));
  }
  if (unit === 'businessDays') {
    const step = amount < 0 ? -1 : 1;
    let remaining = Math.abs(amount);
    while (remaining > 0) {
      result.setDate(result.getDate() + step);
      if (result.getDay() !== 0 && result.getDay() !== 6) remaining--;
    }
  }
  return result;
};

const DateDifferencePage: React.FC = () => {
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [includeEnd, setIncludeEnd] = useState(false);

  const [baseValue, setBaseValue] = useState('');
  const [amount, setAmount] = useState(30);
  const [addUnit, setAddUnit] = useState<AddUnit>('days');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  // Datas iniciais só no navegador, para não fixar a data da build no HTML pré-renderizado
  useEffect(() => {
    const today = new Date();
    setStartValue(toInputValue(new Date(today.getFullYear(), 0, 1)));
    setEndValue(toInputValue(today));
    setBaseValue(toInputValue(today));
  }, []);

  const startDate = parseInputDate(startValue);
  const endDate = parseInputDate(endValue);

  let diff = null;
  if (startDate && endDate) {
    const isReversed = endDate < startDate;
    const [from, to] = isReversed ? [endDate, startDate] : [startDate, endDate];
    const totalDays = dayNumber(to) - dayNumber(from) + (includeEnd ? 1 : 0);
    const calendar = calendarDiff(from, includeEnd ? addToDate(to, 1, 'days') : to);
    diff = {
      isReversed,
      totalDays,
      calendar,
      weeks: Math.floor(totalDays / 7),
      weekRemainder: totalDays % 7,
      businessDays: countBusinessDays(from, to, includeEnd),
      hours: totalDays * 24,
      minutes: totalDays * 1440,
    };
  }

  const baseDate = parseInputDate(baseValue);
  const resultDate = baseDate ? addToDate(baseDate, operation === 'add' ? amount || 0 : -(amount || 0), addUnit) : null;

  const setToday = (setter: (value: string) => void) => setter(toInputValue(new Date()));

  return (
    <ToolPage
      title="Diferença entre Datas"
      description="Calcule o intervalo entre duas datas em anos, meses, dias e dias úteis, ou some e subtraia períodos"
      category="utils"
    >
      <div className="space-y-6">
        <div className="card-modern space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Data inicial', value: startValue, set: setStartValue },
              { label: 'Data final', value: endValue, set: setEndValue },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <span className="flex items-center justify-between">
                  <span className="eyebrow">{field.label}</span>
                  <button type="button" onClick={() => setToday(field.set)} className="text-xs text-muted hover:text-accent transition-colors">
                    hoje
                  </button>
                </span>
                <DateInput value={field.value} onChange={field.set} ariaLabel={field.label} />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              className="checkbox-modern"
            />
            <span className="text-fg">Incluir a data final na contagem</span>
          </label>
        </div>

        {diff && (
          <>
            <div className="card-modern text-center">
              <p className="eyebrow mb-2">Intervalo</p>
              <p className="text-2xl sm:text-3xl font-bold">
                {[
                  diff.calendar.years && plural(diff.calendar.years, 'ano', 'anos'),
                  diff.calendar.months && plural(diff.calendar.months, 'mês', 'meses'),
                  plural(diff.calendar.days, 'dia', 'dias'),
                ].filter(Boolean).join(', ')}
              </p>
              {diff.isReversed && <p className="text-sm text-warning mt-2">A data final é anterior à inicial; o intervalo foi calculado ao contrário.</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard value={diff.totalDays.toLocaleString('pt-BR')} label="Dias corridos" />
              <StatCard value={diff.businessDays.toLocaleString('pt-BR')} label="Dias úteis (seg–sex)" color="green" />
              <StatCard value={`${diff.weeks}s ${diff.weekRemainder}d`} label="Semanas" color="blue" />
              <StatCard value={(diff.calendar.years * 12 + diff.calendar.months).toLocaleString('pt-BR')} label="Meses completos" color="amber" />
              <StatCard value={diff.hours.toLocaleString('pt-BR')} label="Horas" color="blue" />
              <StatCard value={diff.minutes.toLocaleString('pt-BR')} label="Minutos" />
            </div>
            <p className="text-xs text-muted">Os dias úteis não descontam feriados.</p>
          </>
        )}

        <div className="card-modern space-y-4">
          <h3 className="text-lg font-semibold text-fg">Somar ou subtrair de uma data</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <span className="eyebrow block">Data</span>
              <DateInput value={baseValue} onChange={setBaseValue} wrapperClassName="w-48" ariaLabel="Data" />
            </div>
            <SegmentedControl
              ariaLabel="Operação"
              options={[{ value: 'add', label: '+ Somar' }, { value: 'subtract', label: '− Subtrair' }]}
              value={operation}
              onChange={setOperation}
            />
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input-modern !w-24"
              aria-label="Quantidade"
            />
            <select
              value={addUnit}
              onChange={(e) => setAddUnit(e.target.value as AddUnit)}
              className="input-modern !w-auto"
              aria-label="Unidade"
            >
              <option value="days">dias</option>
              <option value="businessDays">dias úteis</option>
              <option value="weeks">semanas</option>
              <option value="months">meses</option>
              <option value="years">anos</option>
            </select>
          </div>
          {resultDate && (
            <div className="panel-output">
              <p className="font-mono text-xl font-bold text-accent">{resultDate.toLocaleDateString('pt-BR')}</p>
              <p className="text-sm text-muted capitalize">{formatLongDate(resultDate)}</p>
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
};

export default DateDifferencePage;
