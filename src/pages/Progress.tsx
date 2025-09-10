import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { progressService } from '../services/api';
import type { ProgressData } from '../types';
import { TrendingUp, TrendingDown, Calendar, Target, Activity } from 'lucide-react';

interface ProgressStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  averageWorkoutDuration: number;
}

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar progresso do usuário atual
      const progressData = await progressService.getProgress();
      setProgress(progressData);
      
      // Calcular estatísticas baseadas no progresso
      const calculatedStats: ProgressStats = {
        totalWorkouts: progressData.workoutsCompleted || 0,
        weeklyWorkouts: progressData.weeklyProgress?.workouts || 0,
        monthlyWorkouts: progressData.monthlyProgress?.workouts || 0,
        currentStreak: progressData.currentStreak || 0,
        longestStreak: progressData.longestStreak || 0,
        averageWorkoutDuration: progressData.averageWorkoutDuration || 0
      };
      
      setStats(calculatedStats);
    } catch (err) {
      setError('Erro ao carregar dados de progresso. Tente novamente.');
      console.error('Erro ao buscar progresso:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar progresso</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProgressData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Progresso</h1>
        <p className="text-muted-foreground">
          Acompanhe sua evolução e conquiste seus objetivos fitness.
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Treinos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.weeklyWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {getTrendIcon(stats?.weeklyWorkouts || 0, progress?.previousWeekWorkouts || 0)}
              <span className="ml-1">vs. semana anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência Atual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
            <p className="text-xs text-muted-foreground">
              dias consecutivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats?.averageWorkoutDuration || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              por treino
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metas e Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Metas Semanais</CardTitle>
            <CardDescription>
              Acompanhe o progresso das suas metas desta semana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Treinos (Meta: {progress?.weeklyGoal?.workouts || 3})</span>
                <span>{stats?.weeklyWorkouts || 0}/{progress?.weeklyGoal?.workouts || 3}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${getProgressPercentage(
                      stats?.weeklyWorkouts || 0, 
                      progress?.weeklyGoal?.workouts || 3
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tempo Total (Meta: {progress?.weeklyGoal?.duration || 180}min)</span>
                <span>{progress?.weeklyProgress?.duration || 0}/{progress?.weeklyGoal?.duration || 180}min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${getProgressPercentage(
                      progress?.weeklyProgress?.duration || 0, 
                      progress?.weeklyGoal?.duration || 180
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
            <CardDescription>
              Suas principais conquistas e marcos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-800">Maior Sequência</h4>
                  <p className="text-sm text-green-600">{stats?.longestStreak || 0} dias consecutivos</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Total de Treinos</h4>
                  <p className="text-sm text-blue-600">{stats?.totalWorkouts || 0} treinos completados</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-purple-800">Este Mês</h4>
                  <p className="text-sm text-purple-600">{stats?.monthlyWorkouts || 0} treinos realizados</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
          <CardDescription>
            Seus últimos treinos e atividades
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress?.recentWorkouts && progress.recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {progress.recentWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{workout.name || `Treino ${index + 1}`}</h4>
                    <p className="text-sm text-muted-foreground">
                      {workout.duration ? formatDuration(workout.duration) : 'Duração não registrada'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {workout.date ? new Date(workout.date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum treino registrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece a treinar para ver seu progresso aqui!
              </p>
              <Button>Iniciar Primeiro Treino</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;