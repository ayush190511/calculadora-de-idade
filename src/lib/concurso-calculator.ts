import type { ConcursoOptions, ConcursoEligibilityResult } from './types';
import { calculateExactYMD, formatDateHuman } from './date-utils';

export interface ConcursoRuleParams {
  dob: Date;
  cutoffDate: Date;
  minAge?: number;
  maxAge?: number;
  options: ConcursoOptions;
}

export function calculateConcursoEligibility({
  dob,
  cutoffDate,
  minAge = 18,
  maxAge = 35,
  options
}: ConcursoRuleParams): ConcursoEligibilityResult {
  const ymd = calculateExactYMD(dob, cutoffDate);
  const relaxationsApplied: string[] = [];

  let effectiveMaxAge = maxAge;

  if (options.pcd) {
    effectiveMaxAge += 5;
    relaxationsApplied.push('Pessoa com Deficiência (+5 anos na idade limite)');
  }
  if (options.servicoMilitar) {
    effectiveMaxAge += 2;
    relaxationsApplied.push('Serviço Militar / Forças de Segurança (+2 anos)');
  }

  // Idade exata na data de corte
  const isPast = dob <= cutoffDate;
  const currentAgeYears = isPast ? ymd.years : 0;

  let status: 'eligible' | 'overage' | 'underage' = 'eligible';
  let explanation = '';

  if (!isPast || currentAgeYears < minAge) {
    status = 'underage';
    explanation = `Você terá ${currentAgeYears} anos na data de corte, o que está abaixo da idade mínima exigida de ${minAge} anos.`;
  } else if (currentAgeYears > effectiveMaxAge || (currentAgeYears === effectiveMaxAge && (ymd.months > 0 || ymd.days > 0))) {
    status = 'overage';
    explanation = `Você terá ${currentAgeYears} anos, ${ymd.months} meses e ${ymd.days} dias na data de corte, ultrapassando a idade máxima permitida de ${effectiveMaxAge} anos.`;
  } else {
    status = 'eligible';
    explanation = `Você atende aos critérios de idade! Terá ${currentAgeYears} anos, ${ymd.months} meses e ${ymd.days} dias na data de corte (requisito: entre ${minAge} e ${effectiveMaxAge} anos).`;
  }

  const minDob = new Date(cutoffDate);
  minDob.setFullYear(minDob.getFullYear() - effectiveMaxAge);

  const maxDob = new Date(cutoffDate);
  maxDob.setFullYear(maxDob.getFullYear() - minAge);

  const yearsRemaining = Math.max(0, effectiveMaxAge - currentAgeYears);

  return {
    status,
    ageOnCutoff: ymd,
    cutoffDateStr: formatDateHuman(cutoffDate),
    cutoffDate,
    minAge,
    maxAgeAllowed: effectiveMaxAge,
    yearsRemaining,
    explanation,
    dobBounds: {
      minDobStr: formatDateHuman(minDob),
      maxDobStr: formatDateHuman(maxDob),
    },
    relaxationsApplied,
  };
}
