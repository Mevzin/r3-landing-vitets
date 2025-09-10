import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Calendar, CreditCard, Activity, Clock, Target } from 'lucide-react';
import { paymentService, fileService, progressService } from '../services/api';
import type { Plan, Workout, ProgressData } from '../types';



const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [userProgress, setUserProgress] = useState<ProgressData | null>(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    nextWorkout: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Buscar dados em paralelo
      const [plansResponse, workoutsResponse, progressResponse] = await Promise.allSettled([
        paymentService.getPlans(),
        user?.id ? fileService.getFileByUserId(user.id) : Promise.resolve({ files: [] }),
        progressService.getProgress()
      ]);

      // Processar planos
      if (plansResponse.status === 'fulfilled' && plansResponse.value.plans?.length > 0) {
        // Por enquanto, pegar o primeiro plano como exemplo
        setUserPlan(plansResponse.value.plans[0]);
      }

      // Processar treinos
      if (workoutsResponse.status === 'fulfilled' && workoutsResponse.value.files) {
        setRecentWorkouts(workoutsResponse.value.files.slice(0, 3)); // Últimos 3 treinos
      }

      // Processar progresso
      if (progressResponse.status === 'fulfilled') {
        setUserProgress(progressResponse.value.progress);
      }

      // Atualizar stats baseado nos dados reais
      setStats({
        totalWorkouts: userProgress?.workoutsCompleted || 0,
        thisWeekWorkouts: userProgress?.weeklyProgress?.workouts || 0,
        nextWorkout: 'Próximo treino disponível'
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar dados</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2 sm:mt-0">
          Bem-vindo de volta, {user?.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              Desde o início da sua jornada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              Treinos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Treino</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{stats.nextWorkout || 'Não agendado'}</div>
            <p className="text-xs text-muted-foreground">
              Mantenha a consistência
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Seu Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userPlan ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{userPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">{userPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{userPlan?.price ? `R$ ${userPlan.price.toFixed(2)}` : 'Não definido'}</p>
                    <p className="text-sm text-muted-foreground">{userPlan?.interval || 'Sem plano ativo'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Benefícios inclusos:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {userPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Target className="h-3 w-3 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Gerenciar Plano
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Você não possui um plano ativo</p>
                <Button>Escolher Plano</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Treinos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout) => (
                  <div key={workout._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{workout.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {workout.exercises?.length || 0} exercícios
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Nenhum treino realizado ainda</p>
                  <Button variant="outline">Ver Treinos Disponíveis</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Agendar Treino</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Activity className="h-6 w-6 mb-2" />
              <span className="text-sm">Meus Treinos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <User className="h-6 w-6 mb-2" />
              <span className="text-sm">Perfil</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm">Planos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;