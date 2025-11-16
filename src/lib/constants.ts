// ============================================
// CONSTANTES DO SISTEMA
// ============================================

import { RiskProfile, MarketType, OddsFormat } from './types';

// ============================================
// CONFIGURAÇÕES DE RISCO
// ============================================

export const RISK_PROFILES = {
  SAFE: {
    label: 'Seguro',
    description: 'Picks conservadoras com alta confiança',
    min_edge: 0.03, // 3%
    min_confidence: 70,
    max_odd: 2.5,
    kelly_fraction: 0.25,
    color: 'emerald',
    icon: 'Shield'
  },
  BALANCED: {
    label: 'Equilibrado',
    description: 'Balanço entre valor e segurança',
    min_edge: 0.05, // 5%
    min_confidence: 60,
    max_odd: 4.0,
    kelly_fraction: 0.5,
    color: 'blue',
    icon: 'Scale'
  },
  AGGRESSIVE: {
    label: 'Agressivo',
    description: 'Maior risco, maior retorno potencial',
    min_edge: 0.08, // 8%
    min_confidence: 50,
    max_odd: 10.0,
    kelly_fraction: 1.0,
    color: 'red',
    icon: 'Flame'
  }
} as const;

// ============================================
// MERCADOS DE APOSTAS
// ============================================

export const MARKETS = {
  '1X2': {
    label: 'Resultado Final',
    description: 'Vitória Casa, Empate ou Vitória Fora',
    selections: ['HOME', 'DRAW', 'AWAY']
  },
  'OVER_UNDER': {
    label: 'Mais/Menos Gols',
    description: 'Total de gols acima ou abaixo da linha',
    selections: ['OVER', 'UNDER'],
    common_lines: [0.5, 1.5, 2.5, 3.5, 4.5]
  },
  'BTTS': {
    label: 'Ambas Marcam',
    description: 'Ambos os times marcam gol',
    selections: ['YES', 'NO']
  },
  'DNB': {
    label: 'Empate Anula',
    description: 'Aposta devolvida em caso de empate',
    selections: ['HOME', 'AWAY']
  },
  'ASIAN_HANDICAP': {
    label: 'Handicap Asiático',
    description: 'Handicap com linhas fracionadas',
    selections: ['HOME', 'AWAY'],
    common_lines: [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5]
  },
  'DOUBLE_CHANCE': {
    label: 'Chance Dupla',
    description: 'Dois resultados possíveis',
    selections: ['HOME_DRAW', 'HOME_AWAY', 'DRAW_AWAY']
  }
} as const;

// ============================================
// LIGAS PRINCIPAIS
// ============================================

export const MAIN_LEAGUES = [
  { id: 'brasileirao', name: 'Brasileirão Série A', country: 'BR', sport: 'FOOTBALL' },
  { id: 'premier-league', name: 'Premier League', country: 'GB', sport: 'FOOTBALL' },
  { id: 'la-liga', name: 'La Liga', country: 'ES', sport: 'FOOTBALL' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'DE', sport: 'FOOTBALL' },
  { id: 'serie-a', name: 'Serie A', country: 'IT', sport: 'FOOTBALL' },
  { id: 'ligue-1', name: 'Ligue 1', country: 'FR', sport: 'FOOTBALL' },
  { id: 'champions-league', name: 'UEFA Champions League', country: 'EU', sport: 'FOOTBALL' },
  { id: 'europa-league', name: 'UEFA Europa League', country: 'EU', sport: 'FOOTBALL' },
  { id: 'libertadores', name: 'Copa Libertadores', country: 'SA', sport: 'FOOTBALL' },
  { id: 'copa-do-brasil', name: 'Copa do Brasil', country: 'BR', sport: 'FOOTBALL' }
] as const;

// ============================================
// PLANOS E PREÇOS
// ============================================

export const PLANS = {
  FREE: {
    name: 'Gratuito',
    price: 0,
    currency: 'BRL',
    features: [
      '3 picks por dia',
      'Dados com 15min de atraso',
      'Mercados básicos (1X2, Over/Under)',
      'Sem alertas personalizados',
      'Histórico de 7 dias'
    ],
    limits: {
      picks_per_day: 3,
      data_delay_minutes: 15,
      history_days: 7,
      alerts: 0
    }
  },
  PREMIUM: {
    name: 'Premium',
    price: 49.90,
    currency: 'BRL',
    billing: 'mensal',
    trial_days: 7,
    features: [
      'Picks ilimitadas',
      'Dados em tempo real',
      'Todos os mercados disponíveis',
      'Alertas personalizados ilimitados',
      'Histórico completo',
      'Modelos avançados (live betting)',
      'Suporte prioritário',
      'Análises detalhadas com xG/xGA'
    ],
    limits: {
      picks_per_day: -1, // ilimitado
      data_delay_minutes: 0,
      history_days: -1,
      alerts: -1
    }
  }
} as const;

// ============================================
// FORMATOS DE ODDS
// ============================================

export const ODDS_FORMATS: Record<OddsFormat, { label: string; example: string }> = {
  DECIMAL: { label: 'Decimal', example: '2.50' },
  AMERICAN: { label: 'Americana', example: '+150' },
  FRACTIONAL: { label: 'Fracionária', example: '3/2' }
};

// ============================================
// PAÍSES COM RESTRIÇÕES
// ============================================

export const RESTRICTED_COUNTRIES = [
  'US', // Estados Unidos (varia por estado)
  'AU', // Austrália (regulamentação específica)
  'SG', // Singapura
  'CN', // China
  'KR', // Coreia do Sul
  'TH', // Tailândia
  'VN', // Vietnã
  'MY', // Malásia
  'ID', // Indonésia
  'PH', // Filipinas
  'TR', // Turquia
  'AE', // Emirados Árabes
  'SA', // Arábia Saudita
  'PK', // Paquistão
  'BD', // Bangladesh
];

// Estados dos EUA com restrições específicas
export const RESTRICTED_US_STATES = [
  'UT', 'HI', 'AK', 'WA', 'ID', 'MT', 'ND', 'SD', 'NE', 'KS', 'OK', 'TX', 
  'MO', 'AR', 'LA', 'MS', 'AL', 'GA', 'SC', 'NC', 'KY', 'OH', 'IN', 'WI', 'MN'
];

// ============================================
// LINKS ÚTEIS
// ============================================

export const RESPONSIBLE_GAMING_LINKS = {
  BR: {
    name: 'Jogo Responsável Brasil',
    links: [
      { label: 'CVV - Centro de Valorização da Vida', url: 'https://www.cvv.org.br', phone: '188' },
      { label: 'Jogadores Anônimos', url: 'https://www.jogadoresanonimos.com.br' },
      { label: 'CAPS - Centro de Atenção Psicossocial', url: 'https://www.gov.br/saude/pt-br/composicao/saps/caps' }
    ]
  },
  INTERNATIONAL: {
    name: 'International Resources',
    links: [
      { label: 'Gamblers Anonymous', url: 'https://www.gamblersanonymous.org' },
      { label: 'BeGambleAware', url: 'https://www.begambleaware.org' },
      { label: 'National Council on Problem Gambling', url: 'https://www.ncpgambling.org' }
    ]
  }
};

// ============================================
// CONFIGURAÇÕES DA API
// ============================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
  CACHE_TTL: {
    matches: 60, // 1 minuto
    odds: 30, // 30 segundos
    picks: 300, // 5 minutos
    leagues: 3600, // 1 hora
    stats: 180 // 3 minutos
  }
};

// ============================================
// MENSAGENS E TEXTOS
// ============================================

export const MESSAGES = {
  ERRORS: {
    GENERIC: 'Ocorreu um erro. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Você precisa estar logado.',
    FORBIDDEN: 'Você não tem permissão para isso.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION: 'Dados inválidos. Verifique os campos.',
    RATE_LIMIT: 'Muitas requisições. Aguarde um momento.',
    AGE_VERIFICATION: 'Você precisa ter 18+ anos para usar este app.',
    GEO_BLOCKED: 'Este serviço não está disponível na sua região.'
  },
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso!',
    SIGNUP: 'Conta criada! Verifique seu e-mail.',
    LOGOUT: 'Logout realizado.',
    PROFILE_UPDATED: 'Perfil atualizado!',
    ALERT_CREATED: 'Alerta criado com sucesso!',
    FAVORITE_ADDED: 'Adicionado aos favoritos!',
    SUBSCRIPTION_ACTIVATED: 'Assinatura ativada! Bem-vindo ao Premium.'
  },
  DISCLAIMERS: {
    MAIN: 'Este aplicativo fornece análises informativas baseadas em dados estatísticos. Não processamos apostas nem garantimos resultados. Aposte com responsabilidade.',
    AGE: 'Você deve ter 18 anos ou mais para usar este aplicativo.',
    RISK: 'Apostas envolvem risco. Nunca aposte mais do que pode perder.',
    NO_GUARANTEE: 'Análises passadas não garantem resultados futuros.',
    EDUCATIONAL: 'Conteúdo exclusivamente educacional e informativo.'
  }
};

// ============================================
// CONFIGURAÇÕES PWA
// ============================================

export const PWA_CONFIG = {
  name: 'BetAnalytics Pro',
  short_name: 'BetAnalytics',
  description: 'Análises esportivas e sugestões de apostas baseadas em dados',
  theme_color: '#0ea5e9',
  background_color: '#0f172a',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
  ]
};

// ============================================
// VALIDAÇÕES
// ============================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_AGE: 18,
  MAX_BANKROLL: 1000000,
  MIN_STAKE: 1,
  MAX_STAKE_PERCENTAGE: 0.1 // 10% da banca
};
