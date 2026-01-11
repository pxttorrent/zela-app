import { LifeStage } from './types';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const month = monthNames[date.getMonth()];
  return `${day} de ${month}`;
};

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const getTodayString = () => new Date().toISOString().split('T')[0];

export const addDays = (dateStr: string, days: number) => {
  const result = new Date(dateStr);
  if (isNaN(result.getTime())) {
    console.warn('Invalid date passed to addDays:', dateStr);
    return new Date().toISOString().split('T')[0]; // Fallback to today to prevent crash
  }
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

export const differenceInWeeks = (d1: string, d2: string) => {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  if (isNaN(t1) || isNaN(t2)) return 0;
  return Math.floor((t1 - t2) / (7 * 24 * 60 * 60 * 1000));
};

export const differenceInDays = (d1: string, d2: string) => {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  if (isNaN(t1) || isNaN(t2)) return 0;
  return Math.floor((t1 - t2) / (24 * 60 * 60 * 1000));
};

export const differenceInYears = (d1: string, d2: string) => {
  const t1 = new Date(d1);
  const t2 = new Date(d2);
  let years = t1.getFullYear() - t2.getFullYear();
  const m = t1.getMonth() - t2.getMonth();
  if (m < 0 || (m === 0 && t1.getDate() < t2.getDate())) {
    years--;
  }
  return years;
};

// ==========================================
// FUNÇÕES DE FAIXA ETÁRIA (NOVO)
// ==========================================

export const getLifeStage = (daysOld: number): LifeStage => {
  if (daysOld <= 730) return 'baby';      // 0-2 anos (0-24 meses)
  if (daysOld <= 1825) return 'toddler';  // 2-5 anos
  if (daysOld <= 4380) return 'kid';      // 5-12 anos
  return 'teen';                          // 12-18+ anos
};

export const getAgeDisplay = (daysOld: number): string => {
  if (daysOld < 30) return `${daysOld} dias`;
  if (daysOld < 365) return `${Math.floor(daysOld / 30)} meses`;
  if (daysOld < 730) return `${Math.floor(daysOld / 30)} meses`; // Até 2 anos mostra em meses
  const years = Math.floor(daysOld / 365);
  return `${years} anos`;
};

export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  baby: 'Bebê (0-2 anos)',
  toddler: 'Primeira Infância (2-5 anos)',
  kid: 'Criança (5-12 anos)',
  teen: 'Adolescente (12+ anos)'
};
