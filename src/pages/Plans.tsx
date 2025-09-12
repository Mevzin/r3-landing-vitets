import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { paymentService } from '../services/api';
import type { Plan } from '../types';
import { Check, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../lib/auth';
import PlanFormDialog from '../components/PlanFormDialog';

const Plans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (user && user.role !== 'admin') {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await paymentService.getPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar planos. Tente novamente.');
      setPlans([]);
      console.error('Erro ao buscar planos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      if (user?.id) {
        const subscription = await paymentService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (err) {
      console.error('Erro ao buscar assinatura do usuário:', err);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribingPlan(planId);
      setError(null);

      const subscription = await paymentService.subscribe({
        userId: 'user_id',
        planId: planId,
        paymentMethodId: 'payment_method_id'
      });


      if (subscription.checkoutUrl) {
        window.location.href = subscription.checkoutUrl;
      } else {
        alert('Assinatura criada com sucesso!');

        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Erro ao processar assinatura. Tente novamente.');
      console.error('Erro ao assinar plano:', err);
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      if (userSubscription?.id) {
        await paymentService.cancelSubscription(userSubscription.id);
        setUserSubscription(null);
        alert('Assinatura cancelada com sucesso!');
      }
    } catch (err) {
      setError('Erro ao cancelar assinatura. Tente novamente.');
      console.error('Erro ao cancelar assinatura:', err);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanDialogOpen(true);
  };

  const handleEditPlan = (planId: string) => {
    const plan = plans.find(p => p._id === planId);
    if (plan) {
      setEditingPlan(plan);
      setPlanDialogOpen(true);
    }
  };

  const handlePlanFormSuccess = () => {
    fetchPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      if (confirm('Tem certeza que deseja deletar este plano?')) {
        await paymentService.deletePlan(planId);
        setPlans(plans.filter(plan => plan._id !== planId));
        alert('Plano deletado com sucesso!');
      }
    } catch (err) {
      setError('Erro ao deletar plano. Tente novamente.');
      console.error('Erro ao deletar plano:', err);
    }
  };

  const handleSyncStripeProducts = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      const response = await paymentService.syncStripeProducts();
      
      alert(`Sincronização concluída!\n${response.result.syncedCount} produtos sincronizados\n${response.result.skippedCount} produtos já existiam`);
      
      await fetchPlans();
    } catch (err) {
      setError('Erro ao sincronizar produtos do Stripe. Tente novamente.');
      console.error('Erro ao sincronizar produtos:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPlanFeatures = (plan: Plan) => {
    const baseFeatures = [
      'Acesso à academia',
      'Treinos personalizados',
      'Acompanhamento de progresso'
    ];

    if (plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('anual')) {
      return [
        ...baseFeatures,
        'Personal trainer',
        'Nutricionista',
        'Acesso a todas as aulas',
        'Suporte prioritário'
      ];
    }

    if (plan.name.toLowerCase().includes('mensal')) {
      return [
        ...baseFeatures,
        'Acesso a aulas básicas'
      ];
    }

    return baseFeatures;
  };

  const isPopularPlan = (plan: Plan) => {
    return plan.name.toLowerCase().includes('mensal') || plan.name.toLowerCase().includes('monthly');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderUserPlansSection = () => {
    if (!userSubscription) {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Escolha seu Plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan._id} className={`relative ${isPopularPlan(plan) ? 'border-primary shadow-lg scale-105' : ''}`}>
                {isPopularPlan(plan) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description || 'Plano completo para seus treinos'}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {getPlanFeatures(plan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={subscribingPlan === plan._id}
                    variant={isPopularPlan(plan) ? 'default' : 'outline'}
                  >
                    {subscribingPlan === plan._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      'Assinar Plano'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    const currentPlan = plans.find(plan => plan._id === userSubscription.planId);
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Meu Plano Atual</h2>
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentPlan?.name || 'Plano Ativo'}</CardTitle>
            <CardDescription>
              {currentPlan?.description || 'Seu plano atual'}
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(currentPlan?.price || 0)}</span>
              <span className="text-muted-foreground">/{currentPlan?.interval || 'mês'}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getPlanFeatures(currentPlan || {} as Plan).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setUserSubscription(null)}
            >
              Alterar Plano
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelSubscription}
            >
              Cancelar Assinatura
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderAdminPlansSection = () => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Planos Criados</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSyncStripeProducts}
            disabled={isSyncing}
          >
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Stripe'}
          </Button>
          <Button onClick={handleCreatePlan}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Plano
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description || 'Sem descrição'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPlan(plan._id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getPlanFeatures(plan).slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-xs">{feature}</span>
                  </li>
                ))}
                {getPlanFeatures(plan).length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    +{getPlanFeatures(plan).length - 3} recursos adicionais
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {user?.role === 'admin' ? 'Gerenciar Planos' : 'Planos'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {user?.role === 'admin' 
            ? 'Gerencie todos os planos disponíveis na plataforma.'
            : 'Encontre o plano perfeito para seus objetivos fitness.'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600 text-center">{error}</p>
          <div className="text-center mt-2">
            <Button variant="outline" onClick={fetchPlans}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {user?.role === 'admin' ? renderAdminPlansSection() : renderUserPlansSection()}

      {plans.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Nenhum plano disponível</h3>
          <p className="text-muted-foreground mb-4">
            {user?.role === 'admin' 
              ? 'Nenhum plano foi criado ainda. Clique em "Criar Novo Plano" para começar.'
              : 'Não há planos cadastrados no momento.'
            }
          </p>
          <Button onClick={user?.role === 'admin' ? handleCreatePlan : fetchPlans}>
            {user?.role === 'admin' ? 'Criar Primeiro Plano' : 'Recarregar'}
          </Button>
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Dúvidas sobre os planos?</h2>
          <p className="text-muted-foreground mb-6">
            Entre em contato conosco para mais informações sobre nossos planos e benefícios.
          </p>
          <Button variant="outline">
            Falar com Suporte
          </Button>
        </div>
      )}

      <PlanFormDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        plan={editingPlan}
        onSuccess={handlePlanFormSuccess}
      />
    </div>
  );
};

export default Plans;