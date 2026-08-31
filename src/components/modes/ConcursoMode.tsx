import React, { useState, useEffect, useMemo } from 'react';
import type { ConcursoOptions } from '../../lib/types';
import { calculateConcursoEligibility } from '../../lib/concurso-calculator';
import { formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { CheckCircle2, XCircle, Copy, Check } from 'lucide-react';

interface ConcursoModeProps {
  initialDob?: string;
  dob?: string;
  onDobChange?: (val: string) => void;
  title?: string;
  subtitle?: string;
}

export const ConcursoMode: React.FC<ConcursoModeProps> = ({ 
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

  const result = useMemo(() => {
    if (!parsedDob || !parsedCutoff) return null;
    return calculateConcursoEligibility({
      dob: parsedDob,
      cutoffDate: parsedCutoff,
      minAge,
      maxAge,
      options,
    });
  }, [parsedDob, parsedCutoff, minAge, maxAge, options]);

  const isEligible = result?.status === 'eligible';

  const handleCopy = () => {
    if (!result || !parsedDob || !parsedCutoff) return;
    const text = `📋 Verificação de Idade para Concurso (calculadoradeidade.com):
• Nascimento: ${formatDateHuman(parsedDob)}
• Data de Corte do Edital: ${formatDateHuman(parsedCutoff)}
• Idade na Data de Corte: ${result.ageOnCutoff.years} anos, ${result.ageOnCutoff.months} meses e ${result.ageOnCutoff.days} dias
• Limites: Mínimo ${minAge} anos | Máximo ${maxAge} anos
• Status: ${isEligible ? '✅ APTO / DENTRO DO LIMITE' : '❌ INAPTO / FORA DO LIMITE'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 sm:space-y-6">
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--ink-primary)]">
            {title || "Calculadora de Idade para Concursos e Editais"}
          </h2>
          <p className="text-xs text-[var(--ink-body)] mt-1">
            {subtitle || "Verifique se a sua idade atende aos requisitos do edital na data de corte estipulada."}
          </p>
        </div>

        <div className="space-y-4">
          <DateInputField
            label="Sua Data de Nascimento"
            value={dob}
            onChange={handleDobInputChange}
            max={formatDateForInput(new Date())}
            required
            helpText="Formato: DD/MM/AAAA"
          />

          <DateInputField
            label="Data de Corte do Edital / Posse"
            value={cutoffDateStr}
            onChange={setCutoffDateStr}
            required
            helpText="Data limite fixada no edital para comprovação da idade"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">
                Idade Mínima Exigida
              </label>
              <input
                type="number"
                min={16}
                max={65}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value) || 18)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--canvas-inset)] border border-[var(--hairline)] text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--hairline-strong)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">
                Idade Máxima Permitida
              </label>
              <input
                type="number"
                min={18}
                max={75}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value) || 35)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--canvas-inset)] border border-[var(--hairline)] text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--hairline-strong)]"
              />
            </div>
          </div>

          {/* Opções de Cotas e Benefícios */}
          <div className="p-3 bg-[var(--canvas-inset)] rounded-xl border border-[var(--hairline)] space-y-2">
            <span className="text-[11px] font-semibold text-[var(--ink-primary)] block">
              Condições Especiais / Ações Afirmativas
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--ink-body)] hover:text-[var(--ink-primary)]">
                <input
                  type="checkbox"
                  checked={options.pcd}
                  onChange={(e) => setOptions({ ...options, pcd: e.target.checked })}
                  className="rounded text-[#0070f3] focus:ring-0"
                />
                <span>Candidato PcD (+5 anos)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[var(--ink-body)] hover:text-[var(--ink-primary)]">
                <input
                  type="checkbox"
                  checked={options.servicoMilitar}
                  onChange={(e) => setOptions({ ...options, servicoMilitar: e.target.checked })}
                  className="rounded text-[#0070f3] focus:ring-0"
                />
                <span>Serviço Militar (+2 anos)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados da Verificação */}
      {result && parsedDob && parsedCutoff && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card Principal de Veredito */}
          <div className={`p-5 rounded-2xl border ${
            isEligible 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}>
            <div className="flex items-start gap-3">
              {isEligible ? (
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base">
                  {isEligible ? 'Você está APTO para este concurso!' : 'Você está FORA da faixa etária permitida.'}
                </h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  {result.explanation}
                </p>
                {result.relaxationsApplied && result.relaxationsApplied.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {result.relaxationsApplied.map((rel, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {rel}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decomposição da Idade na Data de Corte */}
          <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--ink-mute)] uppercase tracking-wider">
                Sua Idade Exata na Data de Corte
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ink-body)] hover:text-[var(--ink-primary)] p-1 rounded-md hover:bg-[var(--canvas-inset)] transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[var(--canvas-inset)] border border-[var(--hairline)]">
                <span className="text-xl sm:text-2xl font-black text-[var(--ink-primary)] block">
                  {result.ageOnCutoff.years}
                </span>
                <span className="text-[10px] text-[var(--ink-mute)] uppercase font-semibold">Anos</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--canvas-inset)] border border-[var(--hairline)]">
                <span className="text-xl sm:text-2xl font-black text-[var(--ink-primary)] block">
                  {result.ageOnCutoff.months}
                </span>
                <span className="text-[10px] text-[var(--ink-mute)] uppercase font-semibold">Meses</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--canvas-inset)] border border-[var(--hairline)]">
                <span className="text-xl sm:text-2xl font-black text-[var(--ink-primary)] block">
                  {result.ageOnCutoff.days}
                </span>
                <span className="text-[10px] text-[var(--ink-mute)] uppercase font-semibold">Dias</span>
              </div>
            </div>

            {/* Informações detalhadas */}
            <div className="border-t border-[var(--hairline)] pt-3 text-xs space-y-1.5 text-[var(--ink-body)]">
              <div className="flex justify-between">
                <span>Data de Nascimento:</span>
                <span className="font-semibold text-[var(--ink-primary)]">{formatDateHuman(parsedDob)}</span>
              </div>
              <div className="flex justify-between">
                <span>Data de Corte do Concurso:</span>
                <span className="font-semibold text-[var(--ink-primary)]">{formatDateHuman(parsedCutoff)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Dias Vividos na Data de Corte:</span>
                <span className="font-semibold text-[var(--ink-primary)]">{(result.ageOnCutoff.totalDays ?? 0).toLocaleString('pt-BR')} dias</span>
              </div>
              <div className="flex justify-between">
                <span>Idade Máxima Permitida (com benefícios):</span>
                <span className="font-semibold text-[var(--ink-primary)]">{result.maxAgeAllowed} anos</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
