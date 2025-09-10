import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { paymentService } from '../services/api';
import type { Plan } from '../types';
import { Check, Star } from 'lucide-react';

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const plansData = await paymentService.getPlans();
      setPlans(plansData);
    } catch (err) {
      setError('Erro ao carregar planos. Tente novamente.');
      console.error('Erro ao buscar planos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribingPlan(planId);
      setError(null);
      
      const subscription = await paymentService.subscribe(planId);
      
      // Redirecionar para o checkout do Stripe se houver URL
      if (subscription.checkoutUrl) {
        window.location.href = subscription.checkoutUrl;
      } else {
        alert('Assinatura criada com sucesso!');
        // Atualizar a página ou redirecionar para dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Erro ao processar assinatura. Tente novamente.');
      console.error('Erro ao assinar plano:', err);
    } finally {
      setSubscribingPlan(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Encontre o plano perfeito para seus objetivos fitness. 
          Todos os planos incluem acesso completo à nossa plataforma.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan._id} 
            className={`relative ${isPopularPlan(plan) ? 'border-primary shadow-lg scale-105' : ''}`}
          >
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

      {plans.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Nenhum plano disponível</h3>
          <p className="text-muted-foreground mb-4">
            Não há planos cadastrados no momento.
          </p>
          <Button onClick={fetchPlans}>Recarregar</Button>
        </div>
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Dúvidas sobre os planos?</h2>
        <p className="text-muted-foreground mb-6">
          Entre em contato conosco para mais informações sobre nossos planos e benefícios.
        </p>
        <Button variant="outline">
          Falar com Suporte
        </Button>
      </div>
    </div>
  );
};

export default Plans;