import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateInputFieldProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  max?: string; // YYYY-MM-DD
  maxDate?: string; // Alias for max
  min?: string; // YYYY-MM-DD
  minDate?: string; // Alias for min
  required?: boolean;
  helpText?: string;
  helperText?: string; // Alias for helpText
  className?: string;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getMaxDaysInMonth(month: number, year: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Converte data ISO (YYYY-MM-DD) para DD/MM/AAAA
 */
function isoToDisplay(isoStr: string): string {
  if (!isoStr || !isoStr.includes('-')) return '';
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y && m && d) {
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }
  return '';
}

/**
 * Validação inteligente e máscara automática no formato DD/MM/AAAA
 */
function sanitizeAndFormatDateInput(
  rawVal: string,
  prevVal: string,
  maxIso?: string,
  minIso?: string
): { formatted: string; isoDate: string | null; error: string | null } {
  // Lida com backspace / exclusão
  if (rawVal.length < prevVal.length) {
    if (prevVal.endsWith('/') && !rawVal.endsWith('/')) {
      return { formatted: rawVal.slice(0, -1), isoDate: null, error: null };
    }
    return { formatted: rawVal, isoDate: null, error: null };
  }

  // Apenas dígitos (máx 8)
  const digits = rawVal.replace(/\D/g, '').slice(0, 8);
  if (!digits) {
    return { formatted: '', isoDate: null, error: null };
  }

  // 1. Validação do Dia (1-2 dígitos)
  let dayPart = '';
  if (digits.length === 1) {
    const d1 = parseInt(digits[0], 10);
    if (d1 >= 4) {
      dayPart = `0${d1}/`;
      return { formatted: dayPart, isoDate: null, error: null };
    }
    return { formatted: digits[0], isoDate: null, error: null };
  }

  let dNum = parseInt(digits.slice(0, 2), 10);
  if (dNum === 0) dNum = 1;
  if (dNum > 31) dNum = 31;
  dayPart = String(dNum).padStart(2, '0');

  if (digits.length === 2) {
    return { formatted: `${dayPart}/`, isoDate: null, error: null };
  }

  // 2. Validação do Mês (dígitos 3-4)
  const remainingAfterDay = digits.slice(2);
  let monthPart = '';

  if (remainingAfterDay.length === 1) {
    const m1 = parseInt(remainingAfterDay[0], 10);
    if (m1 >= 2) {
      monthPart = `0${m1}/`;
      return { formatted: `${dayPart}/${monthPart}`, isoDate: null, error: null };
    }
    return { formatted: `${dayPart}/${remainingAfterDay[0]}`, isoDate: null, error: null };
  }

  let mNum = parseInt(remainingAfterDay.slice(0, 2), 10);
  if (mNum === 0) mNum = 1;
  if (mNum > 12) mNum = 12;
  monthPart = String(mNum).padStart(2, '0');

  const maxDaysThisMonth = getMaxDaysInMonth(mNum, 2024);
  if (dNum > maxDaysThisMonth) {
    dNum = maxDaysThisMonth;
    dayPart = String(dNum).padStart(2, '0');
  }

  if (remainingAfterDay.length === 2) {
    return { formatted: `${dayPart}/${monthPart}/`, isoDate: null, error: null };
  }

  // 3. Validação do Ano (dígitos 5-8)
  const yearDigits = remainingAfterDay.slice(2, 6);
  const formatted = `${dayPart}/${monthPart}/${yearDigits}`;

  if (yearDigits.length === 4) {
    const yNum = parseInt(yearDigits, 10);
    if (yNum >= 1900 && yNum <= 2100) {
      const maxDaysForYear = getMaxDaysInMonth(mNum, yNum);
      if (dNum > maxDaysForYear) {
        dNum = maxDaysForYear;
        dayPart = String(dNum).padStart(2, '0');
      }

      const isoStr = `${String(yNum).padStart(4, '0')}-${monthPart}-${dayPart}`;

      if (maxIso && isoStr > maxIso) {
        return {
          formatted: `${dayPart}/${monthPart}/${yearDigits}`,
          isoDate: null,
          error: `A data não pode estar no futuro (depois de ${isoToDisplay(maxIso)})`,
        };
      }

      if (minIso && isoStr < minIso) {
        return {
          formatted: `${dayPart}/${monthPart}/${yearDigits}`,
          isoDate: null,
          error: `A data não pode ser anterior a ${isoToDisplay(minIso)}`,
        };
      }

      return {
        formatted: `${dayPart}/${monthPart}/${yearDigits}`,
        isoDate: isoStr,
        error: null,
      };
    }
  }

  return { formatted, isoDate: null, error: null };
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  value,
  onChange,
  max,
  maxDate,
  min,
  minDate,
  required = true,
  helpText,
  helperText,
  className = '',
}) => {
  const effectiveMax = max || maxDate;
  const effectiveMin = min || minDate;
  const effectiveHelp = helpText || helperText;
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);
  const [displayText, setDisplayText] = useState<string>(() => isoToDisplay(value));
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const formatted = isoToDisplay(value);
      setDisplayText(formatted);
      setInputError(null);
    } else {
      setDisplayText('');
      setInputError(null);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (!rawVal.trim()) {
      setDisplayText('');
      setInputError(null);
      onChange('');
      return;
    }

    const { formatted, isoDate, error } = sanitizeAndFormatDateInput(rawVal, displayText, effectiveMax, effectiveMin);
    setDisplayText(formatted);
    setInputError(error);

    if (isoDate) {
      onChange(isoDate);
    }
  };

  const handleBlur = () => {
    if (displayText.length > 0 && displayText.length < 10) {
      if (value) {
        setDisplayText(isoToDisplay(value));
      } else {
        setDisplayText('');
      }
      setInputError(null);
    }
  };

  const handleOpenCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hiddenDateInputRef.current) {
      if (typeof hiddenDateInputRef.current.showPicker === 'function') {
        try {
          hiddenDateInputRef.current.showPicker();
          return;
        } catch {
          // Fallback
        }
      }
      hiddenDateInputRef.current.focus();
      hiddenDateInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">
          {label} {required && <span className="text-[#ee0000]">*</span>}
        </label>
        <span className="text-[10px] sm:text-xs font-mono text-[var(--ink-mute)]">DD/MM/AAAA</span>
      </div>

      {/* Date Entry Box */}
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={displayText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="DD/MM/AAAA (ex: 15/08/1998)"
          aria-label={label}
          className={`w-full h-10 sm:h-11 pl-3.5 pr-11 bg-[var(--canvas-card)] border rounded-xl font-mono text-sm sm:text-base font-bold text-[var(--ink-primary)] placeholder:text-[var(--ink-mute)]/50 focus:outline-none focus:ring-2 transition ${
            inputError
              ? 'border-red-500/80 focus:ring-red-500/30'
              : 'border-[var(--hairline)] focus:ring-[#0070f3]/40 focus:border-[#0070f3]'
          }`}
        />

        {/* Integrated Native Calendar Picker Trigger */}
        <button
          type="button"
          onClick={handleOpenCalendar}
          title="Abrir seletor de calendário"
          className="absolute right-1.5 p-2 text-[var(--ink-mute)] hover:text-[#0070f3] hover:bg-[var(--canvas-inset)] rounded-lg transition-colors cursor-pointer"
        >
          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Hidden Native Date Input */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={value || ''}
          max={effectiveMax}
          min={effectiveMin}
          onChange={(e) => {
            const chosen = e.target.value;
            if (chosen) {
              onChange(chosen);
              setDisplayText(isoToDisplay(chosen));
              setInputError(null);
            }
          }}
          className="sr-only absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>

      {/* Error Feedback */}
      {inputError ? (
        <p className="text-[11px] font-medium text-red-500 animate-fadeIn">{inputError}</p>
      ) : effectiveHelp ? (
        <p className="text-[11px] text-[var(--ink-mute)]">{effectiveHelp}</p>
      ) : null}
    </div>
  );
};
