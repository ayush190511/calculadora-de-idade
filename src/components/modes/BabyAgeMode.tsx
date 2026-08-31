import React, { useState, useMemo } from 'react';
import { calculateAgeBreakdown, formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { Baby, Calendar, Sparkles, Copy, Check, Clock, HeartHandshake } from 'lucide-react';

interface BabyAgeModeProps {
  title?: string;
  subtitle?: string;
}

export const BabyAgeMode: React.FC<BabyAgeModeProps> = ({ title, subtitle }) => {
  const [dob, setDob] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('07:15');
  const [isPremature, setIsPremature] = useState<boolean>(false);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(34); // Nascido com 34 semanas
  const [copied, setCopied] = useState<boolean>(false);

  const today = useMemo(() => new Date(), []);

  const parsedDob = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, h || 0, min || 0);
  }, [dob, timeStr]);

  const ageData = useMemo(() => {
    if (!parsedDob) return null;
    return calculateAgeBreakdown(parsedDob, today);
  }, [parsedDob, today]);

  // Idade Corrigida Gestacional (Subtrai as semanas de prematuridade da idade cronológica)
  const correctedAgeWeeks = useMemo(() => {
    if (!isPremature || !ageData) return null;
    const prematureWeeks = Math.max(0, 40 - gestationalWeeks);
    const actualWeeks = ageData.totalWeeks;
    const correctedWeeks = Math.max(0, actualWeeks - prematureWeeks);
    const correctedMonths = Math.floor(correctedWeeks / 4.345);
    const correctedDays = Math.max(0, ageData.totalDays - prematureWeeks * 7);
    return { prematureWeeks, correctedWeeks, correctedMonths, correctedDays };
  }, [isPremature, gestationalWeeks, ageData]);

  const handleCopySummary = () => {
    if (!ageData || !parsedDob) return;
    const text = `👶 Resumo da Idade do Bebê e Gestacional:
📅 Data de Nascimento: ${dob ? formatDateHuman(parsedDob) : ''} às ${timeStr}
🍼 Idade Cronológica: ${ageData.months} meses e ${ageData.days} dias (${ageData.years} anos)
📆 Idade em Semanas: ${ageData.totalWeeks} semanas e ${ageData.days % 7} dias
🔢 Total de Dias: ${ageData.totalDays.toLocaleString('pt-BR')} dias
${isPremature && correctedAgeWeeks ? `🏥 Idade Corrigida (Nascido com ${gestationalWeeks} semanas): ${correctedAgeWeeks.correctedMonths} meses (${correctedAgeWeeks.correctedWeeks} semanas)` : ''}
📍 Calculado via: calculadoradeidade.com/calculadora-idade-gestacional`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bloco de Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-rose-500 mb-2">
            <Baby className="w-3.5 h-3.5" />
            <span>Pediatria e Desenvolvimento Infantil</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade Gestacional e Idade do Bebê"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Calcule a idade exata do bebê em semanas, meses e dias, com cálculo de idade corrigida para bebês prematuros."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data de Nascimento do Bebê */}
          <div className="space-y-2">
            <DateInputField
              label="Data de Nascimento do Bebê"
              value={dob}
              max={formatDateForInput(today)}
              onChange={(val) => {
                const maxStr = formatDateForInput(today);
                const clamped = val > maxStr ? maxStr : val;
                setDob(clamped);
              }}
              helpText="Insira o dia em que o bebê nasceu"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-mono text-[var(--ink-mute)]">Horário do Parto:</span>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="h-9 px-2.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>
          </div>

          {/* Ajuste para Bebês Prematuros (Idade Corrigida) */}
          <div className="space-y-2 p-3.5 bg-[var(--canvas-inset)] border border-[var(--hairline)] rounded-xl">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--ink-primary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPremature}
                onChange={(e) => setIsPremature(e.target.checked)}
                className="rounded border-[var(--hairline)] text-rose-500 focus:ring-rose-500"
              />
              <span>Bebê Prematuro? (Calcular Idade Corrigida)</span>
            </label>

            {isPremature && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--ink-body)]">Semanas de Gestação no Parto:</span>
                  <span className="text-xs font-mono font-bold text-rose-500">{gestationalWeeks} semanas</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={36}
                  value={gestationalWeeks}
                  onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[10px] text-[var(--ink-mute)]">
                  Parto a termo é considerado em 40 semanas. Prematuridade calculada: {40 - gestationalWeeks} semanas antes do tempo.
                </p>
              </div>
            )}
            {!isPremature && (
              <p className="text-[11px] text-[var(--ink-mute)]">
                Marque esta opção se o bebê nasceu antes de 37 semanas para avaliar marcos motores pela idade corrigida.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Resultados do Bebê */}
      {ageData && parsedDob && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card Principal */}
          <div className="bg-linear-to-br from-rose-500/10 via-[var(--canvas-card)] to-rose-500/5 border-2 border-rose-500/30 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative">
            <span className="text-xs font-mono font-bold tracking-wider text-rose-500 uppercase block mb-1">
              Idade Cronológica do Bebê
            </span>

            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {ageData.months}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {ageData.months === 1 ? 'mês' : 'meses'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">e</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {ageData.days}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {ageData.days === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[var(--ink-body)] mt-2">
              Equivalente a <span className="text-rose-500 font-bold">{ageData.totalWeeks} semanas</span> e {ageData.days % 7} dias de vida ({ageData.totalDays.toLocaleString('pt-BR')} dias totais)
            </p>

            {/* Idade Corrigida para Prematuros */}
            {isPremature && correctedAgeWeeks && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center max-w-lg mx-auto">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide block">
                  🏥 Idade Corrigida Pediátrica:
                </span>
                <p className="text-base sm:text-lg font-black text-[var(--ink-primary)] mt-1">
                  {correctedAgeWeeks.correctedMonths} meses ({correctedAgeWeeks.correctedWeeks} semanas de desenvolvimento)
                </p>
                <p className="text-[11px] text-[var(--ink-mute)] mt-1">
                  Use a idade corrigida para avaliar marcos de sentar, engatinhar e introdução alimentar até os 2 anos.
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-rose-500 text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-rose-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Resumo do Bebê'}</span>
              </button>
            </div>
          </div>

          {/* Dicas de Desenvolvimento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Mesversário</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">Dia {parsedDob.getDate()} de cada mês</p>
              <span className="text-[10px] text-[var(--ink-mute)]">comemore os meses</span>
            </div>
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Total em Horas</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] font-mono-num mt-1">{ageData.totalHours.toLocaleString('pt-BR')} horas</p>
              <span className="text-[10px] text-[var(--ink-mute)]">tempo de vida</span>
            </div>
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">1º Aninho</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">{ageData.nextBirthdayDays} dias</p>
              <span className="text-[10px] text-[var(--ink-mute)]">contagem para 1 ano</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
