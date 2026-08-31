import React, { useState, useEffect, useMemo } from 'react';
import { calculateAgeBreakdown, calculateDateDifference, formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { Briefcase, Calendar, Clock, Copy, Check, ShieldCheck, Award, Sliders, Plus, Minus } from 'lucide-react';

interface RetirementModeProps {
  initialDob?: string;
  title?: string;
  subtitle?: string;
}

export const RetirementMode: React.FC<RetirementModeProps> = ({ initialDob = '', title, subtitle }) => {
  const [dob, setDob] = useState<string>(initialDob);
  const [retirementAge, setRetirementAge] = useState<number>(65); // Padrão 65 anos
  const [isCustomRetirement, setIsCustomRetirement] = useState<boolean>(false);
  const [customRetirementInput, setCustomRetirementInput] = useState<string>('65');

  // Idade de Início de Trabalho / Contribuição
  const [careerStartAge, setCareerStartAge] = useState<number>(22);

  const [copied, setCopied] = useState<boolean>(false);

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    setDob(initialDob || '');
  }, [initialDob]);

  const parsedDob = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [dob]);

  const currentAge = useMemo(() => {
    if (!parsedDob) return null;
    return calculateAgeBreakdown(parsedDob, today);
  }, [parsedDob, today]);

  const activeRetirementAge = useMemo(() => {
    if (isCustomRetirement) {
      const parsed = parseInt(customRetirementInput, 10);
      return isNaN(parsed) || parsed <= 0 ? 65 : parsed;
    }
    return retirementAge;
  }, [isCustomRetirement, customRetirementInput, retirementAge]);

  const retirementDate = useMemo(() => {
    if (!parsedDob) return null;
    const ret = new Date(parsedDob);
    ret.setFullYear(ret.getFullYear() + activeRetirementAge);
    return ret;
  }, [parsedDob, activeRetirementAge]);

  const remaining = useMemo(() => {
    if (!retirementDate) return null;
    if (today >= retirementDate) {
      return { isRetired: true, years: 0, months: 0, days: 0, totalDays: 0 };
    }
    const diff = calculateDateDifference(today, retirementDate);
    return { isRetired: false, ...diff };
  }, [today, retirementDate]);

  const progressPercent = useMemo(() => {
    if (!currentAge) return 0;
    const totalWorkingYears = Math.max(1, activeRetirementAge - careerStartAge);
    const yearsWorked = Math.max(0, currentAge.years - careerStartAge);
    const pct = Math.min(100, Math.max(0, (yearsWorked / totalWorkingYears) * 100));
    return Math.round(pct);
  }, [currentAge, activeRetirementAge, careerStartAge]);

  const handleCopySummary = () => {
    if (!currentAge || !retirementDate || !remaining || !parsedDob) return;
    const text = `🏖️ Resumo do Cálculo de Aposentadoria:
📅 Data de Nascimento: ${formatDateHuman(parsedDob)}
⏱️ Idade Atual: ${currentAge.years} anos, ${currentAge.months} meses e ${currentAge.days} dias
🎯 Idade Alvo de Aposentadoria: ${activeRetirementAge} anos (${formatDateHuman(retirementDate)})
${remaining.isRetired ? '🎉 Parabéns! Você já atingiu a idade alvo de aposentadoria!' : `⏳ Tempo Restante: ${remaining.years} anos, ${remaining.months} meses e ${remaining.days} dias (${remaining.totalDays.toLocaleString('pt-BR')} dias)`}
📈 Progresso da Carreira: ${progressPercent}% concluído
📍 Calculado via: calculadoradeidade.com/calculadora-idade-aposentadoria`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Previdência e Planejamento de Futuro</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade para Aposentadoria"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Calcule quanto tempo falta para sua aposentadoria com base na sua idade, início de contribuição e idade alvo (INSS e previdência)."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <DateInputField
            label="Sua Data de Nascimento"
            value={dob}
            max={formatDateForInput(today)}
            onChange={setDob}
            helpText="Insira sua data de nascimento para calcular a contagem regressiva"
          />

          {/* Seleção de Idade de Aposentadoria */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
              Idade Alvo de Aposentadoria
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[58, 60, 62, 65].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => {
                    setRetirementAge(age);
                    setIsCustomRetirement(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    !isCustomRetirement && retirementAge === age
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-[var(--canvas-inset)] text-[var(--ink-body)] hover:bg-[var(--hairline)]'
                  }`}
                >
                  {age} anos {age === 62 ? '(Mulher INSS)' : age === 65 ? '(Homem INSS)' : ''}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomRetirement(true)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                  isCustomRetirement
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-[var(--canvas-inset)] text-[var(--ink-body)] hover:bg-[var(--hairline)]'
                }`}
              >
                Outra Idade
              </button>
            </div>

            {isCustomRetirement && (
              <div className="flex items-center gap-2 pt-2 animate-fadeIn">
                <span className="text-xs text-[var(--ink-mute)]">Digitar Idade:</span>
                <input
                  type="number"
                  min={40}
                  max={100}
                  value={customRetirementInput}
                  onChange={(e) => setCustomRetirementInput(e.target.value)}
                  className="h-9 w-24 px-3 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)] focus:ring-2 focus:ring-amber-500/40"
                />
                <span className="text-xs text-[var(--ink-mute)]">anos</span>
              </div>
            )}
          </div>
        </div>

        {/* Idade de Início de Trabalho */}
        <div className="p-3.5 bg-[var(--canvas-inset)] border border-[var(--hairline)] rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[var(--ink-primary)] block">Idade de Início de Contribuição / Carreira:</span>
            <span className="text-[11px] text-[var(--ink-mute)]">Usado para estimar o percentual concluído de tempo de trabalho</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCareerStartAge((prev) => Math.max(14, prev - 1))}
              className="w-8 h-8 rounded-lg bg-[var(--canvas-card)] border border-[var(--hairline)] flex items-center justify-center text-xs font-bold hover:bg-[var(--hairline)] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-xs font-mono font-bold text-[var(--ink-primary)]">{careerStartAge} anos</span>
            <button
              type="button"
              onClick={() => setCareerStartAge((prev) => Math.min(50, prev + 1))}
              className="w-8 h-8 rounded-lg bg-[var(--canvas-card)] border border-[var(--hairline)] flex items-center justify-center text-xs font-bold hover:bg-[var(--hairline)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Resultados de Aposentadoria */}
      {currentAge && remaining && retirementDate && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-linear-to-br from-amber-500/10 via-[var(--canvas-card)] to-amber-500/5 border-2 border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase block mb-1">
              Contagem Regressiva para Aposentadoria
            </span>

            {remaining.isRetired ? (
              <div className="my-4 space-y-1">
                <span className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 block">
                  🎉 Elegível para Aposentadoria!
                </span>
                <p className="text-xs text-[var(--ink-mute)]">Você já atingiu os {activeRetirementAge} anos.</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                    {remaining.years}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                    {remaining.years === 1 ? 'ano' : 'anos'}
                  </span>
                </div>

                <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">,</span>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                    {remaining.months}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                    {remaining.months === 1 ? 'mês' : 'meses'}
                  </span>
                </div>

                <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">e</span>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                    {remaining.days}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                    {remaining.days === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              </div>
            )}

            {/* Barra de Progresso de Carreira */}
            <div className="max-w-md mx-auto mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[var(--ink-mute)]">
                <span>Início ({careerStartAge} anos)</span>
                <span className="text-amber-500 font-bold">{progressPercent}% Concluído</span>
                <span>Aposentadoria ({activeRetirementAge} anos)</span>
              </div>
              <div className="w-full h-3 bg-[var(--canvas-inset)] rounded-full overflow-hidden border border-[var(--hairline)]">
                <div
                  className="h-full bg-linear-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-amber-500 text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-amber-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Resumo da Aposentadoria'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Data da Aposentadoria</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">{formatDateHuman(retirementDate)}</p>
              <span className="text-[10px] text-[var(--ink-mute)]">ao completar {activeRetirementAge} anos</span>
            </div>
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Dias Restantes</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] font-mono-num mt-1">{remaining.totalDays.toLocaleString('pt-BR')} dias</p>
              <span className="text-[10px] text-[var(--ink-mute)]">tempo total</span>
            </div>
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Idade Atual</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">{currentAge.years} anos e {currentAge.months} m</p>
              <span className="text-[10px] text-[var(--ink-mute)]">idade exata</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
