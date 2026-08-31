import React, { useState, useMemo } from 'react';
import { calculateDateDifference, formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { ArrowRightLeft, Calendar, Copy, Check, Clock } from 'lucide-react';

interface DateDiffModeProps {
  title?: string;
  subtitle?: string;
}

export const DateDiffMode: React.FC<DateDiffModeProps> = ({ title, subtitle }) => {
  const [fromDate, setFromDate] = useState<string>('');
  const [fromTime, setFromTime] = useState<string>('00:00');
  const [toDate, setToDate] = useState<string>(() => formatDateForInput(new Date()));
  const [toTime, setToTime] = useState<string>('12:00');
  const [includeTime, setIncludeTime] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedFrom = useMemo(() => {
    if (!fromDate) return null;
    const [y, m, d] = fromDate.split('-').map(Number);
    const [h, min] = fromTime.split(':').map(Number);
    return new Date(y, m - 1, d, includeTime ? h || 0 : 0, includeTime ? min || 0 : 0);
  }, [fromDate, fromTime, includeTime]);

  const parsedTo = useMemo(() => {
    if (!toDate) return null;
    const [y, m, d] = toDate.split('-').map(Number);
    const [h, min] = toTime.split(':').map(Number);
    return new Date(y, m - 1, d, includeTime ? h || 0 : 0, includeTime ? min || 0 : 0);
  }, [toDate, toTime, includeTime]);

  const diff = useMemo(() => {
    if (!parsedFrom || !parsedTo) return null;
    return calculateDateDifference(parsedFrom, parsedTo);
  }, [parsedFrom, parsedTo]);

  const handleCopySummary = () => {
    if (!diff || !parsedFrom || !parsedTo) return;
    const text = `⏳ Resumo da Diferença de Datas e Idade Entre Datas:
📅 De: ${formatDateHuman(parsedFrom)} ${includeTime ? `às ${fromTime}` : ''}
📅 Até: ${formatDateHuman(parsedTo)} ${includeTime ? `às ${toTime}` : ''}
⏱️ Intervalo Exato: ${diff.years} anos, ${diff.months} meses e ${diff.days} dias
🔢 Total de Dias: ${diff.totalDays.toLocaleString('pt-BR')} dias
⌛ Total em Horas: ${diff.totalHours.toLocaleString('pt-BR')} horas
📍 Calculado em: calculadoradeidade.com/calculadora-idade-entre-datas`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Card de Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Intervalo e Diferença de Tempo</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade Entre Datas"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Calcule o tempo exato entre duas datas em anos, meses, dias, semanas, horas, minutos e segundos."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Data Inicial */}
          <div className="space-y-2">
            <DateInputField
              label="Data Inicial (De)"
              value={fromDate}
              onChange={setFromDate}
              helpText="Insira a primeira data ou data de nascimento"
            />
            {includeTime && (
              <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                <span className="text-xs font-mono text-[var(--ink-mute)]">Horário Inicial:</span>
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="h-9 px-2.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}
          </div>

          {/* Data Final */}
          <div className="space-y-2">
            <DateInputField
              label="Data Final (Até)"
              value={toDate}
              onChange={setToDate}
              helpText="Insira a segunda data de comparação"
            />
            {includeTime && (
              <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                <span className="text-xs font-mono text-[var(--ink-mute)]">Horário Final:</span>
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="h-9 px-2.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--hairline)]">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-body)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeTime}
              onChange={(e) => setIncludeTime(e.target.checked)}
              className="rounded border-[var(--hairline)] text-emerald-500 focus:ring-emerald-500"
            />
            <span>Incluir Horários na Contagem (Cálculo de Horas e Minutos)</span>
          </label>
        </div>
      </div>

      {/* Resultados do Intervalo */}
      {diff && parsedFrom && parsedTo && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card Principal */}
          <div className="bg-linear-to-br from-emerald-500/10 via-[var(--canvas-card)] to-emerald-500/5 border-2 border-emerald-500/30 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
              Diferença Exata Entre as Datas
            </span>

            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {diff.years}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {diff.years === 1 ? 'ano' : 'anos'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">,</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {diff.months}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {diff.months === 1 ? 'mês' : 'meses'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">e</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {diff.days}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {diff.days === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-emerald-500 text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-emerald-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Resultado do Intervalo'}</span>
              </button>
            </div>
          </div>

          {/* Decomposições das Unidades */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Total em Dias</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {diff.totalDays.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">dias corridos</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Total em Semanas</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {(diff.totalDays / 7).toFixed(1)}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">semanas</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Total em Horas</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {diff.totalHours.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">horas</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Total em Minutos</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {diff.totalMinutes.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">minutos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
