'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/ToolPage';
import CopyButton from '@/components/CopyButton';
import SegmentedControl from '@/components/SegmentedControl';

interface Unit {
  id: string;
  label: string;
  symbol: string;
  // Fator para a unidade base da categoria (temperatura usa toBase/fromBase)
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
}

type CategoryId = 'length' | 'mass' | 'temperature' | 'area' | 'volume' | 'speed' | 'time' | 'data';

const categories: Record<CategoryId, { label: string; units: Unit[]; defaults: [string, string] }> = {
  length: {
    label: 'Comprimento',
    defaults: ['m', 'ft'],
    units: [
      { id: 'mm', label: 'Milímetro', symbol: 'mm', factor: 0.001 },
      { id: 'cm', label: 'Centímetro', symbol: 'cm', factor: 0.01 },
      { id: 'm', label: 'Metro', symbol: 'm', factor: 1 },
      { id: 'km', label: 'Quilômetro', symbol: 'km', factor: 1000 },
      { id: 'in', label: 'Polegada', symbol: 'in', factor: 0.0254 },
      { id: 'ft', label: 'Pé', symbol: 'ft', factor: 0.3048 },
      { id: 'yd', label: 'Jarda', symbol: 'yd', factor: 0.9144 },
      { id: 'mi', label: 'Milha', symbol: 'mi', factor: 1609.344 },
      { id: 'nmi', label: 'Milha náutica', symbol: 'nmi', factor: 1852 },
    ],
  },
  mass: {
    label: 'Peso',
    defaults: ['kg', 'lb'],
    units: [
      { id: 'mg', label: 'Miligrama', symbol: 'mg', factor: 0.000001 },
      { id: 'g', label: 'Grama', symbol: 'g', factor: 0.001 },
      { id: 'kg', label: 'Quilograma', symbol: 'kg', factor: 1 },
      { id: 't', label: 'Tonelada', symbol: 't', factor: 1000 },
      { id: 'oz', label: 'Onça', symbol: 'oz', factor: 0.028349523125 },
      { id: 'lb', label: 'Libra', symbol: 'lb', factor: 0.45359237 },
      { id: 'st', label: 'Stone', symbol: 'st', factor: 6.35029318 },
      { id: 'arroba', label: 'Arroba', symbol: '@', factor: 15 },
    ],
  },
  temperature: {
    label: 'Temperatura',
    defaults: ['c', 'f'],
    units: [
      { id: 'c', label: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { id: 'k', label: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      { id: 'r', label: 'Rankine', symbol: '°R', toBase: (v) => (v - 491.67) * 5 / 9, fromBase: (v) => (v + 273.15) * 9 / 5 },
    ],
  },
  area: {
    label: 'Área',
    defaults: ['m2', 'ha'],
    units: [
      { id: 'cm2', label: 'Centímetro quadrado', symbol: 'cm²', factor: 0.0001 },
      { id: 'm2', label: 'Metro quadrado', symbol: 'm²', factor: 1 },
      { id: 'km2', label: 'Quilômetro quadrado', symbol: 'km²', factor: 1_000_000 },
      { id: 'ha', label: 'Hectare', symbol: 'ha', factor: 10_000 },
      { id: 'alq', label: 'Alqueire paulista', symbol: 'alq', factor: 24_200 },
      { id: 'ft2', label: 'Pé quadrado', symbol: 'ft²', factor: 0.09290304 },
      { id: 'ac', label: 'Acre', symbol: 'ac', factor: 4046.8564224 },
    ],
  },
  volume: {
    label: 'Volume',
    defaults: ['l', 'gal'],
    units: [
      { id: 'ml', label: 'Mililitro', symbol: 'ml', factor: 0.001 },
      { id: 'l', label: 'Litro', symbol: 'L', factor: 1 },
      { id: 'm3', label: 'Metro cúbico', symbol: 'm³', factor: 1000 },
      { id: 'tsp', label: 'Colher de chá', symbol: 'c. chá', factor: 0.005 },
      { id: 'tbsp', label: 'Colher de sopa', symbol: 'c. sopa', factor: 0.015 },
      { id: 'cup', label: 'Xícara', symbol: 'xíc.', factor: 0.24 },
      { id: 'floz', label: 'Onça fluida (EUA)', symbol: 'fl oz', factor: 0.0295735295625 },
      { id: 'gal', label: 'Galão (EUA)', symbol: 'gal', factor: 3.785411784 },
    ],
  },
  speed: {
    label: 'Velocidade',
    defaults: ['kmh', 'mph'],
    units: [
      { id: 'ms', label: 'Metro por segundo', symbol: 'm/s', factor: 1 },
      { id: 'kmh', label: 'Quilômetro por hora', symbol: 'km/h', factor: 1 / 3.6 },
      { id: 'mph', label: 'Milha por hora', symbol: 'mph', factor: 0.44704 },
      { id: 'kn', label: 'Nó', symbol: 'kn', factor: 1852 / 3600 },
      { id: 'fts', label: 'Pé por segundo', symbol: 'ft/s', factor: 0.3048 },
    ],
  },
  time: {
    label: 'Tempo',
    defaults: ['h', 'min'],
    units: [
      { id: 'ms', label: 'Milissegundo', symbol: 'ms', factor: 0.001 },
      { id: 's', label: 'Segundo', symbol: 's', factor: 1 },
      { id: 'min', label: 'Minuto', symbol: 'min', factor: 60 },
      { id: 'h', label: 'Hora', symbol: 'h', factor: 3600 },
      { id: 'd', label: 'Dia', symbol: 'd', factor: 86_400 },
      { id: 'wk', label: 'Semana', symbol: 'sem', factor: 604_800 },
      { id: 'mo', label: 'Mês (30,44 dias)', symbol: 'mês', factor: 2_629_746 },
      { id: 'yr', label: 'Ano (365,25 dias)', symbol: 'ano', factor: 31_557_600 },
    ],
  },
  data: {
    label: 'Dados',
    defaults: ['MB', 'MiB'],
    units: [
      { id: 'b', label: 'Bit', symbol: 'bit', factor: 0.125 },
      { id: 'B', label: 'Byte', symbol: 'B', factor: 1 },
      { id: 'KB', label: 'Kilobyte', symbol: 'KB', factor: 1e3 },
      { id: 'MB', label: 'Megabyte', symbol: 'MB', factor: 1e6 },
      { id: 'GB', label: 'Gigabyte', symbol: 'GB', factor: 1e9 },
      { id: 'TB', label: 'Terabyte', symbol: 'TB', factor: 1e12 },
      { id: 'KiB', label: 'Kibibyte', symbol: 'KiB', factor: 1024 },
      { id: 'MiB', label: 'Mebibyte', symbol: 'MiB', factor: 1024 ** 2 },
      { id: 'GiB', label: 'Gibibyte', symbol: 'GiB', factor: 1024 ** 3 },
      { id: 'TiB', label: 'Tebibyte', symbol: 'TiB', factor: 1024 ** 4 },
    ],
  },
};

const convertValue = (value: number, from: Unit, to: Unit) => {
  const base = from.toBase ? from.toBase(value) : value * (from.factor ?? 1);
  return to.fromBase ? to.fromBase(base) : base / (to.factor ?? 1);
};

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return '—';
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute < 1e-6 || absolute >= 1e15)) return value.toExponential(6).replace('.', ',');
  return value.toLocaleString('pt-BR', { maximumSignificantDigits: 12 });
};

const UnitConverterPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<CategoryId>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromId, setFromId] = useState(categories.length.defaults[0]);
  const [toId, setToId] = useState(categories.length.defaults[1]);

  const category = categories[categoryId];
  const fromUnit = category.units.find((unit) => unit.id === fromId) ?? category.units[0];
  const toUnit = category.units.find((unit) => unit.id === toId) ?? category.units[1];
  // Com vírgula, segue o padrão brasileiro (1.234,5); sem vírgula, aceita ponto decimal
  const parsedValue = inputValue.includes(',')
    ? Number(inputValue.replace(/\./g, '').replace(',', '.'))
    : Number(inputValue);
  const isValid = inputValue.trim() !== '' && Number.isFinite(parsedValue);
  const result = isValid ? convertValue(parsedValue, fromUnit, toUnit) : NaN;

  const handleCategoryChange = (next: CategoryId) => {
    setCategoryId(next);
    setFromId(categories[next].defaults[0]);
    setToId(categories[next].defaults[1]);
  };

  const swapUnits = () => {
    setFromId(toUnit.id);
    setToId(fromUnit.id);
  };

  const categoryOptions = (Object.keys(categories) as CategoryId[]).map((id) => ({ value: id, label: categories[id].label }));

  return (
    <ToolPage
      title="Conversor de Unidades"
      description="Converta comprimento, peso, temperatura, área, volume, velocidade, tempo e dados"
      category="utils"
    >
      <div className="space-y-6">
        <SegmentedControl ariaLabel="Categoria" options={categoryOptions} value={categoryId} onChange={handleCategoryChange} />

        <div className="card-modern space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div className="space-y-2">
              <span className="eyebrow block">De</span>
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`input-modern font-mono text-lg ${!isValid && inputValue ? '!border-danger' : ''}`}
                aria-label="Valor"
              />
              <select value={fromUnit.id} onChange={(e) => setFromId(e.target.value)} className="input-modern" aria-label="Unidade de origem">
                {category.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>)}
              </select>
            </div>

            <button onClick={swapUnits} className="btn-secondary !p-2.5 justify-self-center md:mb-14" title="Inverter unidades" aria-label="Inverter unidades">
              <svg className="w-5 h-5 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            <div className="space-y-2">
              <span className="eyebrow block">Para</span>
              <div className="input-modern font-mono text-lg font-bold text-accent flex items-center justify-between gap-2 min-h-[3.25rem]">
                <span className="break-all">{formatNumber(result)}</span>
                <CopyButton text={Number.isFinite(result) ? formatNumber(result) : ''} label="" className="btn-secondary !p-1.5 shrink-0" />
              </div>
              <select value={toUnit.id} onChange={(e) => setToId(e.target.value)} className="input-modern" aria-label="Unidade de destino">
                {category.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>)}
              </select>
            </div>
          </div>
          {isValid && (
            <p className="text-sm text-muted text-center font-mono">
              {formatNumber(parsedValue)} {fromUnit.symbol} = {formatNumber(result)} {toUnit.symbol}
            </p>
          )}
        </div>

        {isValid && (
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-fg mb-4">
              {formatNumber(parsedValue)} {fromUnit.symbol} em todas as unidades
            </h3>
            <ul className="panel-output !p-0 divide-y divide-line text-sm">
              {category.units.filter((unit) => unit.id !== fromUnit.id).map((unit) => (
                <li key={unit.id} className="flex justify-between gap-4 px-4 py-2">
                  <span className="text-muted">{unit.label}</span>
                  <span className="font-mono text-right break-all">{formatNumber(convertValue(parsedValue, fromUnit, unit))} {unit.symbol}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolPage>
  );
};

export default UnitConverterPage;
