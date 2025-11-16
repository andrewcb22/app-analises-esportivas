// ============================================
// TIPOS PRINCIPAIS DO SISTEMA
// ============================================

export type RiskProfile = 'SAFE' | 'BALANCED' | 'AGGRESSIVE';
export type PlanType = 'FREE' | 'PREMIUM';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
export type MarketType = '1X2' | 'OVER_UNDER' | 'BTTS' | 'DNB' | 'ASIAN_HANDICAP' | 'DOUBLE_CHANCE';
export type OddsFormat = 'DECIMAL' | 'AMERICAN' | 'FRACTIONAL';

// ============================================
// USUÁRIO E AUTENTICAÇÃO
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  state?: string;
  age_verified: boolean;
  plan: PlanType;
  risk_profile: RiskProfile;
  created_at: string;
  bankroll?: number;
  kelly_fraction?: number;
}

export interface Subscription {
  user_id: string;
  plan: PlanType;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';
  renewal_date?: string;
  trial_ends_at?: string;
  store_receipt?: string;
}

// ============================================
// ESPORTES E COMPETIÇÕES
// ============================================

export interface League {
  id: string;
  name: string;
  country: string;
  sport: 'FOOTBALL' | 'BASKETBALL' | 'TENNIS';
  logo_url?: string;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  league_id: string;
  logo_url?: string;
  elo_rating?: number;
  form?: string; // ex: "WWDLW"
}

export interface Match {
  id: string;
  league_id: string;
  league?: League;
  home_team_id: string;
  away_team_id: string;
  home_team?: Team;
  away_team?: Team;
  start_time: string;
  status: MatchStatus;
  home_score?: number;
  away_score?: number;
  stats?: MatchStats;
  last_updated: string;
}

export interface MatchStats {
  possession_home?: number;
  possession_away?: number;
  shots_home?: number;
  shots_away?: number;
  shots_on_target_home?: number;
  shots_on_target_away?: number;
  xg_home?: number;
  xg_away?: number;
  corners_home?: number;
  corners_away?: number;
  yellow_cards_home?: number;
  yellow_cards_away?: number;
  red_cards_home?: number;
  red_cards_away?: number;
}

// ============================================
// ODDS E MERCADOS
// ============================================

export interface Odds {
  id: string;
  match_id: string;
  bookmaker: string;
  market: MarketType;
  line?: number; // Para Over/Under e Handicap
  selection: string; // ex: "HOME", "DRAW", "AWAY", "OVER", "UNDER", "YES", "NO"
  odd: number;
  timestamp: string;
}

export interface OddsComparison {
  market: MarketType;
  selection: string;
  line?: number;
  best_odd: number;
  best_bookmaker: string;
  avg_odd: number;
  odds_by_bookmaker: Array<{
    bookmaker: string;
    odd: number;
  }>;
}

// ============================================
// MODELOS E PREVISÕES
// ============================================

export interface Model {
  id: string;
  name: string;
  version: string;
  type: 'PRE_MATCH' | 'LIVE';
  active: boolean;
  description?: string;
}

export interface Prediction {
  match_id: string;
  model_id: string;
  market: MarketType;
  selection: string;
  line?: number;
  probability: number; // 0-1
  confidence: number; // 0-100
  timestamp: string;
}

// ============================================
// PICKS E SUGESTÕES
// ============================================

export interface Pick {
  id: string;
  match_id: string;
  match?: Match;
  market: MarketType;
  selection: string;
  line?: number;
  odd: number;
  bookmaker: string;
  implied_probability: number; // da odd
  model_probability: number; // do modelo
  edge: number; // diferença percentual
  ev: number; // expected value
  confidence: number; // 0-100
  risk_profile: RiskProfile;
  rationale: PickRationale;
  suggested_stake?: number;
  kelly_stake?: number;
  created_at: string;
  result?: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  settled_at?: string;
}

export interface PickRationale {
  factors: Array<{
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }>;
  model_used: string;
  key_stats?: Record<string, any>;
}

// ============================================
// ALERTAS E NOTIFICAÇÕES
// ============================================

export interface Alert {
  id: string;
  user_id: string;
  name: string;
  filters: AlertFilters;
  active: boolean;
  created_at: string;
}

export interface AlertFilters {
  leagues?: string[];
  markets?: MarketType[];
  min_odd?: number;
  max_odd?: number;
  min_confidence?: number;
  risk_profiles?: RiskProfile[];
  min_edge?: number;
}

// ============================================
// HISTÓRICO E PERFORMANCE
// ============================================

export interface PerformanceStats {
  total_picks: number;
  wins: number;
  losses: number;
  voids: number;
  win_rate: number;
  roi: number;
  profit: number;
  avg_odd: number;
  by_market: Record<MarketType, {
    picks: number;
    wins: number;
    roi: number;
  }>;
  by_league: Record<string, {
    picks: number;
    wins: number;
    roi: number;
  }>;
  by_risk: Record<RiskProfile, {
    picks: number;
    wins: number;
    roi: number;
  }>;
}

export interface HistoryEntry {
  pick: Pick;
  result: 'WIN' | 'LOSS' | 'VOID';
  profit: number;
  settled_at: string;
}

// ============================================
// FAVORITOS E WATCHLIST
// ============================================

export interface Favorite {
  user_id: string;
  match_id?: string;
  league_id?: string;
  team_id?: string;
  created_at: string;
}

// ============================================
// ADMIN E BACKOFFICE
// ============================================

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  services: {
    database: boolean;
    cache: boolean;
    odds_api: boolean;
    models: boolean;
  };
  last_odds_update: string;
  last_predictions_run: string;
  active_users_24h: number;
}

export interface AdminSettings {
  risk_thresholds: {
    SAFE: { min_edge: number; min_confidence: number; max_odd: number };
    BALANCED: { min_edge: number; min_confidence: number; max_odd: number };
    AGGRESSIVE: { min_edge: number; min_confidence: number; max_odd: number };
  };
  active_markets: MarketType[];
  kelly_fractions: {
    SAFE: number;
    BALANCED: number;
    AGGRESSIVE: number;
  };
  free_plan_limits: {
    picks_per_day: number;
    data_delay_minutes: number;
  };
}

// ============================================
// UTILS E HELPERS
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
