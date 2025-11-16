// ============================================
// MODELOS DE PREVISÃO ESPORTIVA
// ============================================

import { Match, Team, MatchStats, Prediction, MarketType } from '../types';

// ============================================
// MODELO POISSON (GOLS)
// ============================================

/**
 * Calcula a probabilidade de X gols usando distribuição de Poisson
 */
function poissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Modelo Poisson para prever gols
 */
export function poissonGoalsModel(
  homeAttackStrength: number,
  awayDefenseStrength: number,
  homeDefenseStrength: number,
  awayAttackStrength: number,
  leagueAvgGoals: number = 2.7
): {
  homeExpectedGoals: number;
  awayExpectedGoals: number;
  probabilities: {
    home_win: number;
    draw: number;
    away_win: number;
    over_2_5: number;
    under_2_5: number;
    btts: number;
  };
} {
  // Calcular gols esperados
  const homeExpectedGoals = homeAttackStrength * awayDefenseStrength * leagueAvgGoals;
  const awayExpectedGoals = awayAttackStrength * homeDefenseStrength * leagueAvgGoals;

  // Calcular probabilidades de resultados
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;
  let over25Prob = 0;
  let bttsProb = 0;

  // Simular até 10 gols para cada time
  for (let homeGoals = 0; homeGoals <= 10; homeGoals++) {
    for (let awayGoals = 0; awayGoals <= 10; awayGoals++) {
      const prob =
        poissonProbability(homeExpectedGoals, homeGoals) *
        poissonProbability(awayExpectedGoals, awayGoals);

      if (homeGoals > awayGoals) homeWinProb += prob;
      else if (homeGoals === awayGoals) drawProb += prob;
      else awayWinProb += prob;

      if (homeGoals + awayGoals > 2.5) over25Prob += prob;
      if (homeGoals > 0 && awayGoals > 0) bttsProb += prob;
    }
  }

  return {
    homeExpectedGoals,
    awayExpectedGoals,
    probabilities: {
      home_win: homeWinProb,
      draw: drawProb,
      away_win: awayWinProb,
      over_2_5: over25Prob,
      under_2_5: 1 - over25Prob,
      btts: bttsProb
    }
  };
}

// ============================================
// MODELO ELO/GLICKO
// ============================================

/**
 * Calcula probabilidade de vitória usando Elo rating
 */
export function eloWinProbability(
  homeElo: number,
  awayElo: number,
  homeAdvantage: number = 100
): number {
  const adjustedHomeElo = homeElo + homeAdvantage;
  const eloDiff = adjustedHomeElo - awayElo;
  return 1 / (1 + Math.pow(10, -eloDiff / 400));
}

/**
 * Atualiza Elo rating após uma partida
 */
export function updateElo(
  currentElo: number,
  opponentElo: number,
  result: number, // 1 = vitória, 0.5 = empate, 0 = derrota
  kFactor: number = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - currentElo) / 400));
  return currentElo + kFactor * (result - expectedScore);
}

// ============================================
// MODELO DE FORMA RECENTE
// ============================================

/**
 * Calcula força baseada em forma recente (últimos N jogos)
 */
export function calculateFormStrength(results: string): number {
  // results = "WWDLW" (W=Win, D=Draw, L=Loss)
  let strength = 0;
  const weights = [1.0, 0.8, 0.6, 0.4, 0.2]; // Jogos mais recentes têm mais peso

  for (let i = 0; i < results.length && i < 5; i++) {
    const result = results[i];
    const weight = weights[i];

    if (result === 'W') strength += 3 * weight;
    else if (result === 'D') strength += 1 * weight;
    // L = 0 pontos
  }

  // Normalizar para 0-1
  return strength / 15; // Máximo possível = 15 (5 vitórias com pesos)
}

// ============================================
// MODELO HEAD-TO-HEAD (H2H)
// ============================================

/**
 * Analisa confrontos diretos
 */
export function analyzeH2H(h2hResults: Array<{ homeGoals: number; awayGoals: number }>): {
  homeWins: number;
  draws: number;
  awayWins: number;
  avgHomeGoals: number;
  avgAwayGoals: number;
  dominance: number; // -1 (away domina) a 1 (home domina)
} {
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  let totalHomeGoals = 0;
  let totalAwayGoals = 0;

  h2hResults.forEach(match => {
    if (match.homeGoals > match.awayGoals) homeWins++;
    else if (match.homeGoals === match.awayGoals) draws++;
    else awayWins++;

    totalHomeGoals += match.homeGoals;
    totalAwayGoals += match.awayGoals;
  });

  const total = h2hResults.length;
  const dominance = total > 0 ? (homeWins - awayWins) / total : 0;

  return {
    homeWins,
    draws,
    awayWins,
    avgHomeGoals: total > 0 ? totalHomeGoals / total : 0,
    avgAwayGoals: total > 0 ? totalAwayGoals / total : 0,
    dominance
  };
}

// ============================================
// MODELO COMBINADO (ENSEMBLE)
// ============================================

/**
 * Combina múltiplos modelos para previsão final
 */
export function ensemblePrediction(
  poissonProbs: { home_win: number; draw: number; away_win: number },
  eloHomeWinProb: number,
  formStrengthHome: number,
  formStrengthAway: number,
  h2hDominance: number
): {
  home_win: number;
  draw: number;
  away_win: number;
  confidence: number;
} {
  // Pesos dos modelos
  const weights = {
    poisson: 0.4,
    elo: 0.3,
    form: 0.2,
    h2h: 0.1
  };

  // Converter Elo em probabilidades 1X2
  const eloDrawProb = 0.25; // Estimativa fixa para empate
  const eloAwayWinProb = 1 - eloHomeWinProb - eloDrawProb;

  // Ajustar probabilidades baseado em forma
  const formAdjustment = (formStrengthHome - formStrengthAway) * 0.1;

  // Ajustar baseado em H2H
  const h2hAdjustment = h2hDominance * 0.05;

  // Combinar modelos
  let homeWinProb =
    poissonProbs.home_win * weights.poisson +
    eloHomeWinProb * weights.elo +
    formAdjustment +
    h2hAdjustment;

  let drawProb =
    poissonProbs.draw * weights.poisson +
    eloDrawProb * weights.elo;

  let awayWinProb =
    poissonProbs.away_win * weights.poisson +
    eloAwayWinProb * weights.elo -
    formAdjustment -
    h2hAdjustment;

  // Normalizar para somar 1
  const total = homeWinProb + drawProb + awayWinProb;
  homeWinProb /= total;
  drawProb /= total;
  awayWinProb /= total;

  // Calcular confiança (baseado em variância entre modelos)
  const variance =
    Math.pow(poissonProbs.home_win - homeWinProb, 2) +
    Math.pow(eloHomeWinProb - homeWinProb, 2);
  const confidence = Math.max(0, Math.min(100, 100 - variance * 200));

  return {
    home_win: homeWinProb,
    draw: drawProb,
    away_win: awayWinProb,
    confidence
  };
}

// ============================================
// GERADOR DE PREVISÕES
// ============================================

/**
 * Gera previsões completas para uma partida
 */
export function generateMatchPredictions(match: {
  homeTeam: { elo?: number; form?: string; attackStrength?: number; defenseStrength?: number };
  awayTeam: { elo?: number; form?: string; attackStrength?: number; defenseStrength?: number };
  h2h?: Array<{ homeGoals: number; awayGoals: number }>;
  leagueAvgGoals?: number;
}): {
  market_1x2: { home: number; draw: number; away: number };
  market_over_under: { over_2_5: number; under_2_5: number };
  market_btts: { yes: number; no: number };
  expected_goals: { home: number; away: number };
  confidence: number;
} {
  // Valores padrão
  const homeElo = match.homeTeam.elo || 1500;
  const awayElo = match.awayTeam.elo || 1500;
  const homeForm = match.homeTeam.form || 'DDDDD';
  const awayForm = match.awayTeam.form || 'DDDDD';
  const homeAttack = match.homeTeam.attackStrength || 1.0;
  const homeDefense = match.homeTeam.defenseStrength || 1.0;
  const awayAttack = match.awayTeam.attackStrength || 1.0;
  const awayDefense = match.awayTeam.defenseStrength || 1.0;
  const leagueAvg = match.leagueAvgGoals || 2.7;

  // Modelo Poisson
  const poissonResult = poissonGoalsModel(
    homeAttack,
    awayDefense,
    homeDefense,
    awayAttack,
    leagueAvg
  );

  // Modelo Elo
  const eloHomeWin = eloWinProbability(homeElo, awayElo);

  // Forma
  const formHome = calculateFormStrength(homeForm);
  const formAway = calculateFormStrength(awayForm);

  // H2H
  const h2h = match.h2h ? analyzeH2H(match.h2h) : { dominance: 0 };

  // Ensemble
  const finalPrediction = ensemblePrediction(
    poissonResult.probabilities,
    eloHomeWin,
    formHome,
    formAway,
    h2h.dominance
  );

  return {
    market_1x2: {
      home: finalPrediction.home_win,
      draw: finalPrediction.draw,
      away: finalPrediction.away_win
    },
    market_over_under: {
      over_2_5: poissonResult.probabilities.over_2_5,
      under_2_5: poissonResult.probabilities.under_2_5
    },
    market_btts: {
      yes: poissonResult.probabilities.btts,
      no: 1 - poissonResult.probabilities.btts
    },
    expected_goals: {
      home: poissonResult.homeExpectedGoals,
      away: poissonResult.awayExpectedGoals
    },
    confidence: finalPrediction.confidence
  };
}

// ============================================
// MODELO LIVE (BAYESIAN UPDATE)
// ============================================

/**
 * Atualiza probabilidades durante o jogo (Bayesian)
 */
export function updateLiveProbabilities(
  priorProbs: { home: number; draw: number; away: number },
  currentScore: { home: number; away: number },
  timeElapsed: number, // minutos
  stats?: MatchStats
): { home: number; draw: number; away: number } {
  const timeRemaining = 90 - timeElapsed;
  const timeWeight = timeRemaining / 90;

  // Ajustar baseado no placar atual
  let homeBoost = 0;
  let awayBoost = 0;

  if (currentScore.home > currentScore.away) {
    homeBoost = (currentScore.home - currentScore.away) * 0.15;
  } else if (currentScore.away > currentScore.home) {
    awayBoost = (currentScore.away - currentScore.home) * 0.15;
  }

  // Ajustar baseado em estatísticas ao vivo
  if (stats) {
    if (stats.possession_home && stats.possession_away) {
      const possessionDiff = (stats.possession_home - stats.possession_away) / 100;
      homeBoost += possessionDiff * 0.05;
      awayBoost -= possessionDiff * 0.05;
    }

    if (stats.xg_home && stats.xg_away) {
      const xgDiff = stats.xg_home - stats.xg_away;
      homeBoost += xgDiff * 0.1;
      awayBoost -= xgDiff * 0.1;
    }
  }

  // Aplicar ajustes com peso do tempo
  let homeProb = priorProbs.home * (1 - timeWeight) + (priorProbs.home + homeBoost) * timeWeight;
  let awayProb = priorProbs.away * (1 - timeWeight) + (priorProbs.away + awayBoost) * timeWeight;
  let drawProb = 1 - homeProb - awayProb;

  // Normalizar
  const total = homeProb + drawProb + awayProb;
  return {
    home: homeProb / total,
    draw: drawProb / total,
    away: awayProb / total
  };
}
