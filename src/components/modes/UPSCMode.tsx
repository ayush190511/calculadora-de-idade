import React, { useState, useEffect, useMemo } from 'react';
import type { ConcursoOptions } from '../../lib/types';
import { calculateConcursoEligibility } from '../../lib/concurso-calculator';
import { formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { CheckCircle2, XCircle, AlertCircle, Copy, Check, Clock, Shield, Award, HelpCircle } from 'lucide-react';

interface UPSCModeProps {
  initialDob?: string;
  dob?: string;
  onDobChange?: (val: string) => void;
  title?: string;
  subtitle?: string;
}

export const UPSCMode: React.FC<UPSCModeProps> = ({ 
  initialDob = '', 
  dob: controlledDob,
  onDobChange,
  title,
  subtitle
}) => {
  const [dob, setDob] = useState<string>(controlledDob !== undefined ? controlledDob : initialDob);
  const [cutoffDateStr, setCutoffDateStr] = useState<string>(() => {
    const today = new Date();
    const future = new Date(today.getFullYear(), 11, 31); // 31 de Dezembro do ano atual como padrão
    return formatDateForInput(future);
  });
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(35);
  const [copied, setCopied] = useState<boolean>(false);

  const [options, setOptions] = useState<ConcursoOptions>({
    pcd: false,
    cotasRaciais: false,
    servicoMilitar: false,
    doadorMedula: false,
  });

  useEffect(() => {
    if (controlledDob !== undefined) {
      setDob(controlledDob);
    } else if (initialDob !== undefined) {
      setDob(initialDob);
    }
  }, [controlledDob, initialDob]);

  const handleDobInputChange = (val: string) => {
    const maxStr = formatDateForInput(new Date());
    const clamped = val && val > maxStr ? maxStr : val;
    setDob(clamped);
    if (onDobChange) {
      onDobChange(clamped);
    }
  };

  const parsedDob = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [dob]);

  const parsedCutoff = useMemo(() => {
    if (!cutoffDateStr) return new Date();
    const [y, m, d] = cutoffDateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [cutoffDateStr]);

  const eligibility = useMemo(() => {
    if (!parsedDob) return null;
    return calculateConcursoEligibility({
      dob: parsedDob,
      cutoffDate: parsedCutoff,
      minAge,
      maxAge,
      options,
    });
  }, [parsedDob, parsedCutoff, minAge, maxAge, options]);

  const handleCopySummary = () => {
    if (!eligibility || !parsedDob) return;
    const text = `📋 Resumo de Elegibilidade para Concurso Público / Edital:
📅 Data de Nascimento: ${formatDateHuman(parsedDob)}
📅 Data de Corte do Edital: ${eligibility.cutoffDateStr}
🎯 Requisito do Edital: Idade entre ${eligibility.minAge} e ${eligibility.maxAgeAllowed} anos
⏱️ Idade na Data de Corte: ${eligibility.ageOnCutoff.years} anos, ${eligibility.ageOnCutoff.months} meses e ${eligibility.ageOnCutoff.days} dias
📌 Situação: ${eligibility.status === 'eligible' ? '✅ APTO (Dentro da faixa etária permitida)' : eligibility.status === 'overage' ? '❌ ULTRAPASSOU A IDADE LIMITE' : '⚠️ IDADE INFERIOR AO MÍNIMO EXIGIDO'}
📍 Calculado via: calculadoradeidade.com/calculadora-idade-concursos`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Editais, Concursos e Seleções Públicas</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade para Concursos Públicos e Editais"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Verifique se a sua idade estará dentro dos limites permitidos pelo edital na data de corte, posse ou inscrição do concurso."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Data de Nascimento */}
          <DateInputField
            label="Sua Data de Nascimento"
            value={dob}
            max={formatDateForInput(new Date())}
            onChange={handleDobInputChange}
            helpText="Insira o seu dia de nascimento"
          />

          {/* Data de Corte do Edital */}
          <DateInputField
            label="Data de Corte do Edital (Posse / Inscrição)"
            value={cutoffDateStr}
            onChange={setCutoffDateStr}
            helpText="Data limite fixada no edital do concurso"
          />
        </div>

        {/* Faixa Etária Exigida no Edital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)] mb-1">
              Idade Mínima Exigida
            </label>
            <div className="flex items-center gap-2">
              {[18, 21].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setMinAge(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                    minAge === a
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[var(--canvas-inset)] text-[var(--ink-body)] hover:bg-[var(--hairline)]'
                  }`}
                >
                  {a} anos
                </button>
              ))}
              <input
                type="number"
                min={16}
                max={50}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="h-8.5 w-16 px-2 text-center bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)] mb-1">
              Idade Máxima Permitida
            </label>
            <div className="flex items-center gap-2">
              {[30, 35, 40, 75].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setMaxAge(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                    maxAge === a
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[var(--canvas-inset)] text-[var(--ink-body)] hover:bg-[var(--hairline)]'
                  }`}
                >
                  {a === 75 ? '75 (Geral)' : `${a} anos`}
                </button>
              ))}
              <input
                type="number"
                min={18}
                max={80}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="h-8.5 w-16 px-2 text-center bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Condições Especiais / Cotas / PcD */}
        <div className="p-3.5 bg-[var(--canvas-inset)] border border-[var(--hairline)] rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-primary)] block">
            Condições Especiais e Adaptações do Edital:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-xs text-[var(--ink-body)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.pcd}
                onChange={(e) => setOptions((prev) => ({ ...prev, pcd: e.target.checked }))}
                className="rounded border-[var(--hairline)] text-indigo-600 focus:ring-indigo-600"
              />
              <span>Pessoa com Deficiência (PcD) (+5 anos na idade limite)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[var(--ink-body)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.servicoMilitar}
                onChange={(e) => setOptions((prev) => ({ ...prev, servicoMilitar: e.target.checked }))}
                className="rounded border-[var(--hairline)] text-indigo-600 focus:ring-indigo-600"
              />
              <span>Militar / Forças Armadas (+2 anos)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Resultados do Concurso */}
      {eligibility && parsedDob && (
        <div className="space-y-4 animate-fadeIn">
          <div className={`border-2 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative ${
            eligibility.status === 'eligible'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : eligibility.status === 'overage'
              ? 'bg-rose-500/10 border-rose-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {eligibility.status === 'eligible' ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Elegível / Apto para o Concurso!
                  </span>
                </>
              ) : eligibility.status === 'overage' ? (
                <>
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  <span className="text-sm font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                    Idade Superior ao Limite Máximo
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Idade Inferior ao Mínimo Exigido
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-5xl font-black text-[var(--ink-primary)] font-mono-num">
                  {eligibility.ageOnCutoff.years}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {eligibility.ageOnCutoff.years === 1 ? 'ano' : 'anos'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">,</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--ink-primary)] font-mono-num">
                  {eligibility.ageOnCutoff.months}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {eligibility.ageOnCutoff.months === 1 ? 'mês' : 'meses'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">e</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--ink-primary)] font-mono-num">
                  {eligibility.ageOnCutoff.days}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {eligibility.ageOnCutoff.days === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-2 max-w-lg mx-auto">
              {eligibility.explanation}
            </p>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-indigo-500 text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Parecer do Edital'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Nascimento Mínimo Permitido</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">{eligibility.dobBounds.minDobStr}</p>
              <span className="text-[10px] text-[var(--ink-mute)]">para não estourar a idade máxima ({eligibility.maxAgeAllowed} anos)</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] uppercase">Nascimento Máximo Permitido</span>
              <p className="text-sm font-bold text-[var(--ink-primary)] mt-1">{eligibility.dobBounds.maxDobStr}</p>
              <span className="text-[10px] text-[var(--ink-mute)]">para atingir a idade mínima ({eligibility.minAge} anos)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
