export type Category = 'GEN' | 'COTAS' | 'PCD' | 'MILITAR';

export interface ConcursoOptions {
  pcd: boolean; // Pessoa com Deficiência (reserva de vagas / adaptação)
  cotasRaciais: boolean; // Cotas para negros/indígenas
  servicoMilitar: boolean; // Idade diferenciada ou tempo de serviço militar
  doadorMedula: boolean; // Isenções e condições especiais
}

export interface ConcursoEligibilityResult {
  status: 'eligible' | 'overage' | 'underage';
  ageOnCutoff: {
    years: number;
    months: number;
    days: number;
    totalDays?: number;
  };
  cutoffDateStr: string;
  cutoffDate: Date;
  minAge: number;
  maxAgeAllowed: number;
  yearsRemaining: number;
  explanation: string;
  dobBounds: {
    minDobStr: string;
    maxDobStr: string;
  };
  relaxationsApplied: string[];
}

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalWeeks: number;
  nextBirthdayDays: number;
  nextBirthdayDateStr: string;
}

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isPast: boolean;
}
