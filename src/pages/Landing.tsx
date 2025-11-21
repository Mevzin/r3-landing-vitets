import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Download, Users, Trophy, Target, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

import icon from "../assets/icon.png"

const Landing = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background">

      <header className="bg-gray-800 text-white-foreground py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-w-14 rounded-lg flex items-center justify-center">
              <img src={icon} alt="icon" />
            </div>
            <span className="text-xl font-bold">Fitness Center</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#inicio" className="hover:text-accent transition-colors">Início</a>
            <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
            <a href="#planos" className="hover:text-accent transition-colors">Planos</a>
            <a href="#app" className="hover:text-accent transition-colors">App</a>
            <a href="#contato" className="hover:text-accent transition-colors">Contato</a>
          </nav>
          <Link className="flex items-center justify-center rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground w-20 h-10 font-bold" to="/login">
            Login
          </Link>
        </div>
      </header>


      <section id="inicio" className="relative bg-gradient-to-br from-primary via-secondary to-primary min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-primary-foreground">
          <div className="max-w-3xl">
            <Badge className="bg-destructive text-destructive-foreground mb-4 px-4 py-2">
              Transforme Sua Vida Hoje
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Transforme Seu <span className="text-accent">Corpo</span> e Sua <span className="text-destructive">Vida</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              A Academia R3 oferece equipamentos de última geração e
              acompanhamento profissional para você alcançar seus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-4 text-lg">
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg">
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>


      <section id="sobre" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Sobre a Academia R3</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Há mais de 10 anos transformando vidas através do fitness e bem-estar, oferecendo excelência em equipamentos e acompanhamento profissional.
            </p>
          </div>
        </div>
      </section>


      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Proporcionar um ambiente motivador e seguro para que nossos alunos alcancem seus objetivos de saúde e bem-estar, com equipamentos modernos e profissionais qualificados.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-destructive-foreground" />
                  </div>
                  <span className="text-foreground">Equipamentos de última geração</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-destructive-foreground" />
                  </div>
                  <span className="text-foreground">Profissionais qualificados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-destructive-foreground" />
                  </div>
                  <span className="text-foreground">Ambiente motivador e seguro</span>
                </div>
              </div>
            </div>
            <div className="bg-secondary rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center text-secondary-foreground">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-12 h-12 text-accent-foreground" />
                </div>
                <p className="text-lg">Imagem da Academia</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-tertiary mb-2">5.000+</div>
              <div className="text-gray-300">Alunos Ativos</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-red-500 mb-2">200+</div>
              <div className="text-gray-300">Transformações</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">10+</div>
              <div className="text-gray-300">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>


      <section id="planos" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-foreground mb-4">Planos e Preços</h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para começar sua transformação hoje mesmo!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <Card className="bg-card border-2 border-border hover:border-accent transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-card-foreground">Diária</CardTitle>
                <div className="text-4xl font-bold text-card-foreground mt-4">
                  R$ <span className="text-destructive">89</span>,90
                </div>
                <CardDescription className="text-muted-foreground">por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Acesso à musculação</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Horário comercial</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Vestiário</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>


            <Card className="bg-card border-2 border-destructive hover:border-destructive/80 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-destructive text-destructive-foreground px-4 py-2">
                  MAIS POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold text-card-foreground">Anual</CardTitle>
                <div className="text-4xl font-bold text-card-foreground mt-4">
                  R$ <span className="text-destructive">700</span>,90
                </div>
                <CardDescription className="text-muted-foreground">por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Tudo do plano Básico</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Aulas em grupo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Acesso 24h</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Personal trainer 2x/mês</span>
                  </div>
                </div>
                <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground mt-6">
                  Assinar Premium
                </Button>
              </CardContent>
            </Card>


            <Card className="bg-card border-2 border-border hover:border-accent transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-card-foreground">Mensal</CardTitle>
                <div className="text-4xl font-bold text-card-foreground mt-4">
                  R$ <span className="text-destructive">249</span>,90
                </div>
                <CardDescription className="text-muted-foreground">por mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Tudo do plano Premium</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Personal trainer ilimitado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Nutricionista</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-card-foreground">Área VIP exclusiva</span>
                  </div>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-6">
                  Escolher VIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <section id="app" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Baixe Nosso App</h2>
            <p className="text-xl text-muted-foreground">
              Tenha a Academia R3 na palma da sua mão. Agende treinos, acompanhe seu progresso e muito mais!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                    <Download className="w-6 h-6 text-destructive-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Agendamento Online</h3>
                    <p className="text-muted-foreground">Agende suas aulas e horários de treino diretamente pelo app.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Acompanhe seu Progresso</h3>
                    <p className="text-muted-foreground">Monitore seus treinos, evolução e conquistas.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Comunidade Ativa</h3>
                    <p className="text-muted-foreground">Conecte-se com outros alunos e compartilhe sua jornada.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2 px-6 py-3">
                  <Download className="w-5 h-5" />
                  <span>Google Play</span>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2 px-6 py-3">
                  <Download className="w-5 h-5" />
                  <span>App Store</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-96 bg-secondary rounded-3xl p-4 shadow-2xl">
                <div className="w-full h-full bg-primary rounded-2xl flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-accent-foreground font-bold text-xl">R3</span>
                    </div>
                    <p className="text-sm">App Mockup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer id="contato" className="bg-gray-800 text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-lg">R3</span>
                </div>
                <span className="text-xl font-bold">Academia R3</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Transformando vidas através do fitness e bem-estar há mais de 10 anos.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5 text-destructive-foreground" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Horários</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Professores</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>Rua das Academias, 123 - Centro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>contato@academiar3.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Horários</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Segunda a Sexta: 5h às 23h</div>
                <div>Sábado: 6h às 20h</div>
                <div>Domingo: 8h às 18h</div>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Academia R3. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;