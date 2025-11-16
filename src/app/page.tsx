'use client';

import { useState } from 'react';
import { Shield, Scale, Flame, TrendingUp, Target, BarChart3, Bell, Settings, Trophy, Calendar, Filter, ChevronRight, Lock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function BetAnalyticsApp() {
  const [riskProfile, setRiskProfile] = useState<'SAFE' | 'BALANCED' | 'AGGRESSIVE'>('BALANCED');
  const [isPremium, setIsPremium] = useState(false);

  const riskProfiles = {
    SAFE: {
      label: 'Seguro',
      icon: Shield,
      color: 'emerald',
      description: 'Picks conservadoras com alta confiança',
      minEdge: '3%',
      minConfidence: '70%',
      maxOdd: '2.50'
    },
    BALANCED: {
      label: 'Equilibrado',
      icon: Scale,
      color: 'blue',
      description: 'Balanço entre valor e segurança',
      minEdge: '5%',
      minConfidence: '60%',
      maxOdd: '4.00'
    },
    AGGRESSIVE: {
      label: 'Agressivo',
      icon: Flame,
      color: 'red',
      description: 'Maior risco, maior retorno potencial',
      minEdge: '8%',
      minConfidence: '50%',
      maxOdd: '10.00'
    }
  };

  const todayPicks = [
    {
      id: 1,
      league: 'Premier League',
      homeTeam: 'Manchester City',
      awayTeam: 'Arsenal',
      time: '16:00',
      market: 'Resultado Final',
      selection: 'Manchester City',
      odd: 2.15,
      confidence: 78,
      edge: 8.5,
      ev: 12.3,
      rationale: [
        { factor: 'Forma recente superior (4W-1D)', impact: 'HIGH' },
        { factor: 'Vantagem do mando de casa', impact: 'MEDIUM' },
        { factor: 'xG favorável (2.1 vs 1.4)', impact: 'HIGH' }
      ],
      expectedGoals: { home: 2.1, away: 1.4 },
      riskProfile: 'BALANCED'
    },
    {
      id: 2,
      league: 'La Liga',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      time: '18:30',
      market: 'Mais de 2.5 Gols',
      selection: 'Over 2.5',
      odd: 1.85,
      confidence: 72,
      edge: 6.2,
      ev: 8.7,
      rationale: [
        { factor: 'Média de 3.2 gols nos últimos 5 jogos', impact: 'HIGH' },
        { factor: 'Ambos com ataque forte', impact: 'MEDIUM' },
        { factor: 'Histórico de jogos abertos', impact: 'MEDIUM' }
      ],
      expectedGoals: { home: 1.8, away: 1.6 },
      riskProfile: 'SAFE'
    },
    {
      id: 3,
      league: 'Brasileirão',
      homeTeam: 'Flamengo',
      awayTeam: 'Palmeiras',
      time: '20:00',
      market: 'Ambas Marcam',
      selection: 'Sim',
      odd: 1.95,
      confidence: 65,
      edge: 5.8,
      ev: 7.2,
      rationale: [
        { factor: 'Ambos marcaram em 4 dos últimos 5', impact: 'HIGH' },
        { factor: 'Defesas vulneráveis', impact: 'MEDIUM' },
        { factor: 'Jogo decisivo (mais ofensivo)', impact: 'LOW' }
      ],
      expectedGoals: { home: 1.5, away: 1.3 },
      riskProfile: 'BALANCED'
    }
  ];

  const stats = {
    totalPicks: 247,
    wins: 156,
    losses: 78,
    voids: 13,
    winRate: 63.1,
    roi: 12.8,
    profit: 3245.50,
    avgOdd: 2.15
  };

  const currentProfile = riskProfiles[riskProfile];
  const ProfileIcon = currentProfile.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BetAnalytics Pro</h1>
                <p className="text-xs text-gray-400">Análises baseadas em dados</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isPremium && (
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Premium
                </Button>
              )}
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Button size="sm" variant="ghost" className="text-gray-300">
                <Bell className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-300">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Disclaimer */}
        <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-200">
                <strong>Aviso Legal:</strong> Este aplicativo fornece análises informativas baseadas em dados estatísticos. 
                Não processamos apostas nem garantimos resultados. Aposte com responsabilidade. +18 anos.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil de Risco */}
        <Card className="mb-6 border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Perfil de Risco
            </CardTitle>
            <CardDescription className="text-gray-400">
              Escolha sua estratégia de análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(riskProfiles).map(([key, profile]) => {
                const Icon = profile.icon;
                const isActive = riskProfile === key;
                return (
                  <button
                    key={key}
                    onClick={() => setRiskProfile(key as any)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isActive
                        ? `border-${profile.color}-500 bg-${profile.color}-500/10`
                        : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-${profile.color}-500/20 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${profile.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{profile.label}</h3>
                        {isActive && (
                          <Badge variant="outline" className="text-xs mt-1 border-green-500/50 text-green-400">
                            Ativo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{profile.description}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Edge mínimo:</span>
                        <span className="text-gray-300">{profile.minEdge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confiança mín:</span>
                        <span className="text-gray-300">{profile.minConfidence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Odd máxima:</span>
                        <span className="text-gray-300">{profile.maxOdd}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Win Rate</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
              <Progress value={stats.winRate} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">ROI</span>
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">+{stats.roi}%</div>
              <div className="text-xs text-gray-500 mt-1">{stats.totalPicks} picks</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Lucro</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                R$ {stats.profit.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Últimos 30 dias</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Odd Média</span>
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.avgOdd}</div>
              <div className="text-xs text-gray-500 mt-1">{stats.wins}W / {stats.losses}L</div>
            </CardContent>
          </Card>
        </div>

        {/* Picks do Dia */}
        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Picks de Hoje
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {todayPicks.length} oportunidades identificadas para o perfil {currentProfile.label}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayPicks.map((pick) => (
              <Card key={pick.id} className="border-white/10 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                          {pick.league}
                        </Badge>
                        <span className="text-xs text-gray-500">{pick.time}</span>
                      </div>
                      <div className="text-white font-semibold mb-1">
                        {pick.homeTeam} vs {pick.awayTeam}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className="bg-blue-500/20 text-blue-300 border-0">
                          {pick.market}
                        </Badge>
                        <span className="text-gray-400">→</span>
                        <span className="text-white font-medium">{pick.selection}</span>
                        <span className="text-gray-400">@</span>
                        <span className="text-emerald-400 font-bold">{pick.odd.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Confiança</div>
                        <div className="flex items-center gap-1">
                          <div className={`text-lg font-bold ${
                            pick.confidence >= 70 ? 'text-green-400' : 
                            pick.confidence >= 60 ? 'text-blue-400' : 'text-yellow-400'
                          }`}>
                            {pick.confidence}%
                          </div>
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-12 bg-white/10" />

                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Edge</div>
                        <div className="text-lg font-bold text-emerald-400">
                          +{pick.edge.toFixed(1)}%
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-12 bg-white/10" />

                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">EV</div>
                        <div className="text-lg font-bold text-blue-400">
                          +{pick.ev.toFixed(1)}%
                        </div>
                      </div>

                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Ver Análise
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Por que esta pick?</div>
                    <div className="flex flex-wrap gap-2">
                      {pick.rationale.map((factor, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={`text-xs ${
                            factor.impact === 'HIGH' ? 'border-green-500/50 text-green-400' :
                            factor.impact === 'MEDIUM' ? 'border-blue-500/50 text-blue-400' :
                            'border-gray-500/50 text-gray-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {factor.factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Expected Goals */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>xG Esperado:</span>
                    <span className="text-white">{pick.homeTeam.split(' ')[0]} {pick.expectedGoals.home.toFixed(1)}</span>
                    <span>-</span>
                    <span className="text-white">{pick.expectedGoals.away.toFixed(1)} {pick.awayTeam.split(' ')[0]}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {!isPremium && (
              <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <CardContent className="p-6 text-center">
                  <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Desbloqueie Picks Ilimitadas
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upgrade para Premium e tenha acesso a todas as análises, dados em tempo real e alertas personalizados
                  </p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Zap className="w-4 h-4 mr-2" />
                    Começar Teste Grátis de 7 Dias
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Modelos Avançados</h3>
              <p className="text-sm text-gray-400">
                Poisson, Elo, xG e análise de forma combinados para máxima precisão
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Transparência Total</h3>
              <p className="text-sm text-gray-400">
                Veja exatamente por que cada pick foi sugerida com análise detalhada
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Alertas Inteligentes</h3>
              <p className="text-sm text-gray-400">
                Receba notificações quando surgir uma oportunidade que atende seus critérios
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
          <p className="mb-2">
            BetAnalytics Pro - Análises esportivas baseadas em dados estatísticos
          </p>
          <p className="text-xs">
            Conteúdo exclusivamente educacional e informativo. Não processamos apostas. +18 anos. Jogue com responsabilidade.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacidade</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Jogo Responsável</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
