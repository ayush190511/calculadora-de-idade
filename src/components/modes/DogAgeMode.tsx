import React, { useState, useMemo } from 'react';
import { calculateDateDifference, formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { Dog, Heart, Moon, Copy, Check, Info } from 'lucide-react';

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

interface DogAgeModeProps {
  title?: string;
  subtitle?: string;
}

export const DogAgeMode: React.FC<DogAgeModeProps> = ({ title, subtitle }) => {
  const [dob, setDob] = useState<string>('');
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [copied, setCopied] = useState<boolean>(false);

  const today = useMemo(() => new Date(), []);

  const parsedDob = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [dob]);

  // Idade real de calendário do cão
  const calendarAge = useMemo(() => {
    if (!parsedDob) return null;
    return calculateDateDifference(parsedDob, today);
  }, [parsedDob, today]);

  // Fórmula Veterinária AVMA de Equivalência em Anos Humanos
  const humanAge = useMemo(() => {
    if (!calendarAge) return 0;
    const totalYears = calendarAge.years + calendarAge.months / 12;
    if (totalYears <= 0) return 0;
    if (totalYears <= 1) {
      return Math.round(totalYears * 15);
    }
    if (totalYears <= 2) {
      return Math.round(15 + (totalYears - 1) * 9);
    }
    // Após 2 anos: multiplicador pelo porte
    const base = 24;
    const remainingYears = totalYears - 2;
    let multiplier = 5;
    if (dogSize === 'small') multiplier = 4;
    if (dogSize === 'medium') multiplier = 5;
    if (dogSize === 'large') multiplier = 6;
    if (dogSize === 'giant') multiplier = 7.5;

    return Math.round(base + remainingYears * multiplier);
  }, [calendarAge, dogSize]);

  // Fase da Vida
  const lifeStage = useMemo(() => {
    if (!calendarAge) return null;
    if (calendarAge.years < 1) return { name: 'Filhote (Puppy)', sleep: '18 a 20 horas/dia', tip: 'Ração de filhote com alta densidade nutricional e refeições frequentes (3 a 4 vezes ao dia).' };
    if (calendarAge.years < 3) return { name: 'Jovem Adulto', sleep: '12 a 14 horas/dia', tip: 'Muita energia e brincadeiras, dieta de manutenção de adulto e vacinação em dia.' };
    if (calendarAge.years < (dogSize === 'giant' ? 5 : dogSize === 'large' ? 6 : 8)) {
      return { name: 'Adulto Pleno', sleep: '12 a 14 horas/dia', tip: 'Exercícios regulares, controle de peso e checkups veterinários anuais.' };
    }
    return { name: 'Idoso (Sênior)', sleep: '14 a 18 horas/dia', tip: 'Acompanhamento articular, ração sênior de fácil digestão e consultas semestrais.' };
  }, [calendarAge, dogSize]);

  const sizeLabels: Record<DogSize, { label: string; desc: string }> = {
    small: { label: 'Porte Pequeno', desc: 'Até 9 kg (Chihuahua, Poodle, Shih Tzu, etc.)' },
    medium: { label: 'Porte Médio', desc: '9 a 22 kg (Beagle, Cocker, Bulldog Francês, etc.)' },
    large: { label: 'Porte Grande', desc: '23 a 40 kg (Labrador, Golden, Pastor Alemão, etc.)' },
    giant: { label: 'Porte Gigante', desc: 'Mais de 40 kg (São Bernardo, Dogue Alemão, Rottweiler grande)' },
  };

  const handleCopySummary = () => {
    if (!calendarAge || !lifeStage || !parsedDob) return;
    const text = `🐶 Resumo da Idade do Cachorro em Anos Humanos:
📅 Data de Nascimento: ${formatDateHuman(parsedDob)}
🐕 Porte: ${sizeLabels[dogSize].label}
⏱️ Idade Real de Calendário: ${calendarAge.years} anos e ${calendarAge.months} meses
🧑‍🦱 Idade em Anos Humanos: ${humanAge} anos equivalentes
🐾 Fase da Vida: ${lifeStage.name} (Sono recomendado: ${lifeStage.sleep})
📍 Calculado via: calculadoradeidade.com/calculadora-idade-cachorro`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-amber-500 mb-2">
            <Dog className="w-3.5 h-3.5" />
            <span>Medicina Veterinária e Cuidados Caninos</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade de Cachorro em Anos Humanos"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Descubra a idade real do seu cachorro convertida para anos humanos com base no porte e recomendações veterinárias (AVMA)."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <DateInputField
            label="Data de Nascimento (ou Adoção) do Cão"
            value={dob}
            max={formatDateForInput(today)}
            onChange={setDob}
            helpText="Insira quando o seu cãozinho nasceu"
          />

          {/* Porte do Cachorro */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
              Porte do Cão
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['small', 'medium', 'large', 'giant'] as DogSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setDogSize(sz)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer select-none ${
                    dogSize === sz
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                      : 'bg-[var(--canvas-inset)] border-[var(--hairline)] text-[var(--ink-body)] hover:bg-[var(--hairline)]'
                  }`}
                >
                  <span className="text-xs font-bold block">{sizeLabels[sz].label}</span>
                  <span className="text-[10px] text-[var(--ink-mute)] block mt-0.5">{sizeLabels[sz].desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {calendarAge && parsedDob && lifeStage && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-linear-to-br from-amber-500/10 via-[var(--canvas-card)] to-amber-500/5 border-2 border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase block mb-1">
              Idade em Anos Humanos
            </span>

            <div className="flex items-baseline justify-center gap-2 my-2">
              <span className="text-4xl sm:text-6xl font-black text-[var(--ink-primary)] font-mono-num">
                {humanAge}
              </span>
              <span className="text-base sm:text-xl font-bold text-[var(--ink-mute)]">
                anos humanos
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-body)] font-semibold">
              Idade real de calendário: <strong className="text-[var(--ink-primary)]">{calendarAge.years} anos e {calendarAge.months} meses</strong> ({calendarAge.totalDays.toLocaleString('pt-BR')} dias de vida)
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)]">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="text-xs font-bold text-[var(--ink-primary)]">Fase Atual: {lifeStage.name}</span>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-amber-500 text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-amber-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Resumo do Cão'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--ink-mute)] uppercase">Necessidade de Sono</span>
                <p className="text-sm font-bold text-[var(--ink-primary)]">{lifeStage.sleep}</p>
              </div>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--ink-mute)] uppercase">Dica Nutricional</span>
                <p className="text-xs text-[var(--ink-body)]">{lifeStage.tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
