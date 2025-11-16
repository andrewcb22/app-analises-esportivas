// ============================================
// FUNÇÕES UTILITÁRIAS PARA ODDS E APOSTAS
// ============================================

import { OddsFormat, RiskProfile } from './types';
import { RISK_PROFILES } from './constants';

// ============================================
// CONVERSÃO DE ODDS
// ============================================

/**
 * Converte odds decimal para americana
 */
export function decimalToAmerican(decimal: number): string {
  if (decimal >= 2.0) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
}

/**
 * Converte odds decimal para fracionária
 */
export function decimalToFractional(decimal: number): string {
  const fraction = decimal - 1;
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  
  const numerator = Math.round(fraction * 100);
  const denominator = 100;
  const divisor = gcd(numerator, denominator);
  
  return `${numerator / divisor}/${denominator / divisor}`;
}

/**
 * Converte odds americana para decimal
 */
export function americanToDecimal(american: number): number {
  if (american > 0) {
    return (american / 100) + 1;
  } else {
    return (100 / Math.abs(american)) + 1;
  }
}

/**
 * Converte odds para o formato desejado
 */
export function convertOdds(odd: number, format: OddsFormat): string {
  switch (format) {
    case 'DECIMAL':
      return odd.toFixed(2);
    case 'AMERICAN':
      return decimalToAmerican(odd);
    case 'FRACTIONAL':
      return decimalToFractional(odd);
    default:
      return odd.toFixed(2);
  }
}

// ============================================
// CÁLCULOS DE PROBABILIDADE E VALOR
// ============================================

/**
 * Converte odd decimal em probabilidade implícita
 */
export function oddToImpliedProbability(odd: number): number {
  return 1 / odd;
}

/**
 * Converte probabilidade em odd decimal
 */
export function probabilityToOdd(probability: number): number {
  return 1 / probability;
}

/**
 * Calcula o edge (vantagem) entre probabilidade do modelo e odd
 */
export function calculateEdge(modelProbability: number, odd: number): number {
  const impliedProbability = oddToImpliedProbability(odd);
  return modelProbability - impliedProbability;
}

/**
 * Calcula o Expected Value (EV)
 */
export function calculateEV(modelProbability: number, odd: number, stake: number = 1): number {
  const winAmount = stake * (odd - 1);
  const loseAmount = stake;
  return (modelProbability * winAmount) - ((1 - modelProbability) * loseAmount);
}

/**
 * Calcula o EV percentual
 */
export function calculateEVPercentage(modelProbability: number, odd: number): number {
  const ev = calculateEV(modelProbability, odd, 1);
  return (ev / 1) * 100;
}

/**
 * Remove a margem (vig/juice) das odds
 */
export function removeVig(odds: number[]): number[] {
  const totalImpliedProb = odds.reduce((sum, odd) => sum + oddToImpliedProbability(odd), 0);
  const vigFactor = 1 / totalImpliedProb;
  
  return odds.map(odd => {
    const fairProb = oddToImpliedProbability(odd) * vigFactor;
    return probabilityToOdd(fairProb);
  });
}

// ============================================
// KELLY CRITERION
// ============================================

/**
 * Calcula a stake sugerida usando Kelly Criterion
 */
export function calculateKellyStake(
  modelProbability: number,
  odd: number,
  bankroll: number,
  fraction: number = 1
): number {
  const q = 1 - modelProbability; // probabilidade de perder
  const b = odd - 1; // retorno líquido
  
  const kellyPercentage = (modelProbability * b - q) / b;
  
  // Aplicar fração de Kelly (para reduzir volatilidade)
  const adjustedKelly = kellyPercentage * fraction;
  
  // Não apostar se Kelly for negativo (sem edge)
  if (adjustedKelly <= 0) return 0;
  
  // Limitar a 10% da banca (segurança)
  const maxStake = bankroll * 0.1;
  const suggestedStake = bankroll * adjustedKelly;
  
  return Math.min(suggestedStake, maxStake);
}

/**
 * Calcula Kelly stake baseado no perfil de risco
 */
export function calculateKellyByProfile(
  modelProbability: number,
  odd: number,
  bankroll: number,
  profile: RiskProfile
): number {
  const fraction = RISK_PROFILES[profile].kelly_fraction;
  return calculateKellyStake(modelProbability, odd, bankroll, fraction);
}

// ============================================
// VALIDAÇÃO DE PICKS
// ============================================

/**
 * Verifica se um pick atende aos critérios do perfil de risco
 */
export function validatePickForProfile(
  edge: number,
  confidence: number,
  odd: number,
  profile: RiskProfile
): boolean {
  const criteria = RISK_PROFILES[profile];
  
  return (
    edge >= criteria.min_edge &&
    confidence >= criteria.min_confidence &&
    odd <= criteria.max_odd
  );
}

/**
 * Calcula score de qualidade do pick (0-100)
 */
export function calculatePickQuality(
  edge: number,
  confidence: number,
  odd: number,
  profile: RiskProfile
): number {
  const criteria = RISK_PROFILES[profile];
  
  // Normalizar cada métrica (0-1)
  const edgeScore = Math.min(edge / (criteria.min_edge * 3), 1);
  const confidenceScore = confidence / 100;
  const oddScore = 1 - (odd / criteria.max_odd);
  
  // Média ponderada
  const quality = (edgeScore * 0.4 + confidenceScore * 0.4 + oddScore * 0.2) * 100;
  
  return Math.round(Math.max(0, Math.min(100, quality)));
}

// ============================================
// ESTATÍSTICAS E PERFORMANCE
// ============================================

/**
 * Calcula win rate
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return (wins / total) * 100;
}

/**
 * Calcula ROI (Return on Investment)
 */
export function calculateROI(profit: number, totalStaked: number): number {
  if (totalStaked === 0) return 0;
  return (profit / totalStaked) * 100;
}

/**
 * Calcula yield (lucro por aposta)
 */
export function calculateYield(profit: number, numberOfBets: number): number {
  if (numberOfBets === 0) return 0;
  return profit / numberOfBets;
}

/**
 * Calcula a odd média
 */
export function calculateAverageOdd(odds: number[]): number {
  if (odds.length === 0) return 0;
  return odds.reduce((sum, odd) => sum + odd, 0) / odds.length;
}

/**
 * Calcula o CLV (Closing Line Value)
 */
export function calculateCLV(openingOdd: number, closingOdd: number): number {
  return ((closingOdd - openingOdd) / openingOdd) * 100;
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata moeda BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata odd com sinal de + ou -
 */
export function formatOddWithSign(odd: number): string {
  const sign = odd >= 0 ? '+' : '';
  return `${sign}${odd.toFixed(2)}`;
}

/**
 * Formata edge com cor
 */
export function getEdgeColor(edge: number): string {
  if (edge >= 0.08) return 'text-green-500';
  if (edge >= 0.05) return 'text-blue-500';
  if (edge >= 0.03) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Formata confidence com cor
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-green-500';
  if (confidence >= 60) return 'text-blue-500';
  if (confidence >= 40) return 'text-yellow-500';
  return 'text-red-500';
}

// ============================================
// HELPERS DE DATA
// ============================================

/**
 * Verifica se uma partida está ao vivo
 */
export function isMatchLive(startTime: string, status: string): boolean {
  return status === 'LIVE' || (new Date(startTime) <= new Date() && status !== 'FINISHED');
}

/**
 * Calcula tempo até o início da partida
 */
export function getTimeUntilMatch(startTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();
  
  if (diff < 0) return 'Ao vivo';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

/**
 * Formata data para exibição
 */
export function formatMatchDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

// ============================================
// VALIDAÇÕES
// ============================================

/**
 * Valida e-mail
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida senha forte
 */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
}

/**
 * Valida idade mínima
 */
export function isValidAge(birthDate: string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
}
