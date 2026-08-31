import React, { useState, useEffect, useMemo } from 'react';
import { calculateAgeBreakdown, formatDateForInput, formatDateHuman } from '../../lib/date-utils';
import { DateInputField } from '../DateInputField';
import { Calendar, Sparkles, Copy, Check, Clock, Globe } from 'lucide-react';

interface NormalAgeModeProps {
  initialDob?: string;
  dob?: string;
  onDobChange?: (val: string) => void;
  title?: string;
  subtitle?: string;
}

export const NormalAgeMode: React.FC<NormalAgeModeProps> = ({ 
  initialDob = '',
  dob: controlledDob,
  onDobChange,
  title,
  subtitle
}) => {
  const [dob, setDob] = useState<string>(controlledDob !== undefined ? controlledDob : initialDob);
  const [showTime, setShowTime] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>('08:30');
  const [showPlace, setShowPlace] = useState<boolean>(false);
  const [birthPlace, setBirthPlace] = useState<string>('');
  
  // Auto-detectar fuso horário do dispositivo do navegador
  const detectedTimezone = useMemo(() => {
    if (typeof window !== 'undefined' && Intl?.DateTimeFormat) {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      } catch {
        return 'America/Sao_Paulo';
      }
    }
    return 'America/Sao_Paulo';
  }, []);

  const [selectedTimezone, setSelectedTimezone] = useState<string>(detectedTimezone);
  const [now, setNow] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Data máxima permitida é hoje
  const todayStr = useMemo(() => formatDateForInput(new Date()), []);

  useEffect(() => {
    if (controlledDob !== undefined) {
      setDob(controlledDob);
    } else if (initialDob !== undefined) {
      setDob(initialDob);
    }
  }, [controlledDob, initialDob]);

  const handleDobInputChange = (val: string) => {
    if (val && val > todayStr) {
      setDateError('Datas no futuro não podem ser usadas para cálculo de idade cronológica.');
      val = todayStr;
    } else {
      setDateError(null);
    }
    setDob(val);
    if (onDobChange) {
      onDobChange(val);
    }
  };

  // Atualização do contador em tempo real a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dobDate = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, showTime ? h || 0 : 0, showTime ? min || 0 : 0);
  }, [dob, timeStr, showTime]);

  const ageData = useMemo(() => {
    if (!dobDate) return null;
    return calculateAgeBreakdown(dobDate, now);
  }, [dobDate, now]);

  // Contagem de segundos totais ao vivo
  const liveSecondsTotal = useMemo(() => {
    if (!dobDate) return 0;
    const diffMs = Math.max(0, now.getTime() - dobDate.getTime());
    return Math.floor(diffMs / 1000);
  }, [dobDate, now]);

  const liveSecondsRem = liveSecondsTotal % 60;
  const liveMinutesRem = Math.floor(liveSecondsTotal / 60) % 60;
  const liveHoursRem = Math.floor(liveSecondsTotal / 3600) % 24;

  const handleCopySummary = () => {
    if (!ageData || !dobDate) return;
    const text = `🎂 Resumo da Minha Idade Exata:
📅 Data de Nascimento: ${dob ? formatDateHuman(dobDate) : ''} ${showTime ? `às ${timeStr}` : ''}
⏱️ Idade Exata: ${ageData.years} anos, ${ageData.months} meses e ${ageData.days} dias
⏳ Tempo de Vida Total:
  • ${ageData.totalDays.toLocaleString('pt-BR')} dias
  • ${ageData.totalWeeks.toLocaleString('pt-BR')} semanas
  • ${ageData.totalHours.toLocaleString('pt-BR')} horas
  • ${liveSecondsTotal.toLocaleString('pt-BR')} segundos
🎉 Próximo Aniversário: Em ${ageData.nextBirthdayDays} dias (${ageData.nextBirthdayDateStr})
📍 Calculado em: calculadoradeidade.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bloco Principal de Entrada */}
      <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs transition-colors space-y-4 sm:space-y-5">
        
        {/* Título e Subtítulo */}
        <div className="border-b border-[var(--hairline)] pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--canvas-inset)] border border-[var(--hairline)] text-xs font-semibold text-[#0070f3] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calculadora de Idade Exata e Gratuita</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--ink-primary)]">
            {title || "Calculadora de Idade Online"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {subtitle || "Descubra quantos anos você tem em anos, meses, dias, semanas, horas e segundos com precisão matemática em tempo real."}
          </p>
        </div>

        {/* Formulário de Data de Nascimento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <DateInputField
              label="Data de Nascimento"
              value={dob}
              max={todayStr}
              onChange={handleDobInputChange}
              helpText="Digite dia, mês e ano ou use o ícone do calendário"
            />
            {dateError && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{dateError}</p>
            )}
          </div>

          {/* Opções Adicionais: Horário e Local de Nascimento */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--ink-body)] select-none">
                <input
                  type="checkbox"
                  checked={showTime}
                  onChange={(e) => setShowTime(e.target.checked)}
                  className="rounded border-[var(--hairline)] text-[#0070f3] focus:ring-[#0070f3]"
                />
                <span>Incluir Horário de Nascimento</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--ink-body)] select-none">
                <input
                  type="checkbox"
                  checked={showPlace}
                  onChange={(e) => setShowPlace(e.target.checked)}
                  className="rounded border-[var(--hairline)] text-[#0070f3] focus:ring-[#0070f3]"
                />
                <span>Fuso Horário / Cidade</span>
              </label>
            </div>

            {/* Entrada de Horário */}
            {showTime && (
              <div className="flex items-center gap-2 animate-fadeIn">
                <span className="text-xs font-mono text-[var(--ink-mute)]">Horário:</span>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="h-9 px-2.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-mono font-bold text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40"
                />
                <span className="text-[10px] text-[var(--ink-mute)]">(Cálculo ao vivo segundo a segundo)</span>
              </div>
            )}

            {/* Entrada de Fuso Horário / Local */}
            {showPlace && (
              <div className="flex items-center gap-2 animate-fadeIn">
                <Globe className="w-4 h-4 text-[var(--ink-mute)] shrink-0" />
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="h-9 px-2.5 bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-lg text-xs font-sans text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40 w-full"
                >
                  <option value="America/Sao_Paulo">Brasil - Brasília (GMT-3)</option>
                  <option value="America/Manaus">Brasil - Manaus / Amazônia (GMT-4)</option>
                  <option value="America/Noronha">Brasil - Fernando de Noronha (GMT-2)</option>
                  <option value="America/Rio_Branco">Brasil - Acre (GMT-5)</option>
                  <option value="Europe/Lisbon">Portugal - Lisboa (GMT+0 / GMT+1)</option>
                  <option value="Atlantic/Madeira">Portugal - Madeira (GMT+0)</option>
                  <option value="Atlantic/Azores">Portugal - Açores (GMT-1)</option>
                  <option value="Africa/Luanda">Angola - Luanda (GMT+1)</option>
                  <option value="Africa/Maputo">Moçambique - Maputo (GMT+2)</option>
                  <option value="Africa/Praia">Cabo Verde - Praia (GMT-1)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Botão Limpar ou Dica Rápida */}
        {!dob && (
          <div className="p-3.5 bg-[var(--canvas-inset)] border border-[var(--hairline)] rounded-xl text-center">
            <p className="text-xs text-[var(--ink-mute)]">
              💡 <strong>Dica:</strong> Insira a sua data de nascimento acima para calcular instantaneamente sua idade exata, quantos dias já viveu e a contagem regressiva para o próximo aniversário.
            </p>
          </div>
        )}
      </div>

      {/* Bloco de Resultados quando DOB estiver preenchida */}
      {ageData && dobDate && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Cartão de Destaque da Idade Principal */}
          <div className="bg-linear-to-br from-[#0070f3]/10 via-[var(--canvas-card)] to-[#0070f3]/5 border-2 border-[#0070f3]/30 rounded-2xl p-5 sm:p-7 shadow-sm text-center relative overflow-hidden">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0070f3] uppercase block mb-1">
              Sua Idade Cronológica Atual
            </span>

            {/* Grande Visor de Anos, Meses e Dias */}
            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
                  {ageData.years}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--ink-mute)]">
                  {ageData.years === 1 ? 'ano' : 'anos'}
                </span>
              </div>

              <span className="text-xl sm:text-3xl font-light text-[var(--hairline-strong)]">,</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--ink-primary)] font-mono-num">
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

            {/* Contador de Segundos ao Vivo */}
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--canvas-card)] border border-[var(--hairline)] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-[var(--ink-body)]">
                Relógio ao vivo: <strong className="font-bold text-[var(--ink-primary)]">{liveHoursRem}h {liveMinutesRem}m {liveSecondsRem}s</strong>
              </span>
            </div>

            {/* Botão Copiar Resultado */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--canvas-card)] hover:bg-[var(--canvas-inset)] border border-[var(--hairline)] hover:border-[#0070f3] text-xs font-semibold text-[var(--ink-primary)] rounded-xl transition shadow-2xs cursor-pointer select-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#0070f3]" />}
                <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar Resumo da Idade'}</span>
              </button>
            </div>
          </div>

          {/* Grade de Estatísticas Detalhadas do Tempo de Vida */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] block uppercase tracking-wider">Total de Meses</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {(ageData.years * 12 + ageData.months).toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">meses completos</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] block uppercase tracking-wider">Total de Semanas</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {ageData.totalWeeks.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">semanas de vida</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] block uppercase tracking-wider">Total de Dias</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {ageData.totalDays.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">dias vividos</span>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-3.5 sm:p-4 text-center">
              <span className="text-[11px] font-medium text-[var(--ink-mute)] block uppercase tracking-wider">Total de Horas</span>
              <span className="text-lg sm:text-2xl font-black text-[var(--ink-primary)] font-mono-num mt-1 block">
                {ageData.totalHours.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">horas decorridas</span>
            </div>
          </div>

          {/* Próximo Aniversário & Marcos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--ink-mute)] uppercase tracking-wider">Próximo Aniversário</span>
                <h2 className="text-base font-bold text-[var(--ink-primary)]">
                  {ageData.nextBirthdayDays === 0 ? '🎉 Feliz Aniversário Hoje!' : `Faltam ${ageData.nextBirthdayDays} dias`}
                </h2>
                <p className="text-xs text-[var(--ink-body)]">
                  Data: {ageData.nextBirthdayDateStr} ({ageData.years + 1} anos)
                </p>
              </div>
            </div>

            <div className="bg-[var(--canvas-card)] border border-[var(--hairline)] rounded-xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--ink-mute)] uppercase tracking-wider">Total em Segundos</span>
                <h2 className="text-base font-bold text-[var(--ink-primary)] font-mono-num">
                  {liveSecondsTotal.toLocaleString('pt-BR')} s
                </h2>
                <p className="text-xs text-[var(--ink-body)]">
                  Atualizando continuamente a cada segundo
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
