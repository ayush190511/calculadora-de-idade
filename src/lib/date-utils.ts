import type { AgeBreakdown, DateDiffResult } from './types';

/**
 * Calcula a diferença exata em Anos, Meses e Dias entre duas datas.
 * Lida corretamente com os limites dos meses e anos bissextos.
 */
export function calculateExactYMD(startDate: Date, endDate: Date): { years: number; months: number; days: number } {
  if (startDate > endDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    // Pega o último dia do mês anterior relativo à endDate
    const prevMonthLastDay = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calcula o detalhamento completo da Idade até a data atual (ou data alvo)
 */
export function calculateAgeBreakdown(dob: Date, targetDate: Date = new Date()): AgeBreakdown {
  const ymd = calculateExactYMD(dob, targetDate);

  const diffMs = Math.abs(targetDate.getTime() - dob.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalWeeks = Math.floor(totalDays / 7);

  // Cálculo do Próximo Aniversário
  const currentYear = targetDate.getFullYear();
  let nextBday = new Date(currentYear, dob.getMonth(), dob.getDate());
  
  if (nextBday < targetDate) {
    nextBday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
  }

  const nextBdayDiffMs = nextBday.getTime() - targetDate.getTime();
  const nextBirthdayDays = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const nextBirthdayDateStr = nextBday.toLocaleDateString('pt-BR', options);

  return {
    years: ymd.years,
    months: ymd.months,
    days: ymd.days,
    totalDays,
    totalHours,
    totalWeeks,
    nextBirthdayDays,
    nextBirthdayDateStr,
  };
}

/**
 * Calcula a diferença entre duas datas arbitrárias (com horário opcional)
 */
export function calculateDateDifference(from: Date, to: Date): DateDiffResult {
  const isPast = from <= to;
  const startDate = isPast ? from : to;
  const endDate = isPast ? to : from;

  const ymd = calculateExactYMD(startDate, endDate);

  const diffMs = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    years: ymd.years,
    months: ymd.months,
    days: ymd.days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isPast,
  };
}

/**
 * Formata um objeto Date para YYYY-MM-DD para campos de formulário HTML
 */
export function formatDateForInput(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formata um objeto Date para formato amigável em português (ex: 15 de agosto de 2026)
 */
export function formatDateHuman(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'long' });
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}
