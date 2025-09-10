import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell, Users, Calendar, Trophy, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const plans = [
    {
      name: 'Básico',
      price: 'R$ 89,90',
      duration: 'mensal',
      features: [
        'Acesso à academia',
        'Treino personalizado',
        'Acompanhamento básico',
        'Horário comercial'
      ]
    },
    {
      name: 'Premium',
      price: 'R$ 149,90',
      duration: 'mensal',
      features: [
        'Acesso à academia 24h',
        'Treino personalizado',
        'Acompanhamento completo',
        'Aulas em grupo',
        'Nutricionista'
      ],
      popular: true
    },
    {
      name: 'VIP',
      price: 'R$ 249,90',
      duration: 'mensal',
      features: [
        'Acesso à academia 24h',
        'Personal trainer',
        'Acompanhamento premium',
        'Todas as aulas',
        'Nutricionista',
        'Massagem relaxante'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transforme seu corpo,
            <br />
            transforme sua vida
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            A melhor academia da cidade com equipamentos modernos e profissionais qualificados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/login">Começar Agora</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#planos">Ver Planos</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por que escolher a GymSys?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipamentos Modernos</h3>
              <p className="text-muted-foreground">
                Equipamentos de última geração para todos os tipos de treino
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profissionais Qualificados</h3>
              <p className="text-muted-foreground">
                Personal trainers e nutricionistas certificados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Horários Flexíveis</h3>
              <p className="text-muted-foreground">
                Funcionamento 24h para se adequar à sua rotina
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resultados Garantidos</h3>
              <p className="text-muted-foreground">
                Acompanhamento personalizado para atingir seus objetivos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Escolha seu plano
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    <Link to="/login">Escolher Plano</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já transformaram suas vidas
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/login">Cadastre-se Agora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;