import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell, Eye, EyeOff, User, Mail, Lock, Calendar } from 'lucide-react';
import { authService } from '../services/api';
import { useFieldErrors } from '../hooks/useFieldErrors';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  phone?: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');
  const { setErrorsFromApi, getFieldError, generalError } = useFieldErrors();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validar se as senhas coincidem
      if (data.password !== data.confirmPassword) {
        setError('As senhas não coincidem');
        setIsLoading(false);
        return;
      }

      // Preparar dados para envio (removendo confirmPassword)
      const { confirmPassword, ...userData } = data;
      
      await authService.register(userData);
      
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: unknown) {
      setErrorsFromApi(err);
      const fallback = (err as any)?.response?.data?.message || 'Erro ao criar conta';
      setError(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GymSys</span>
          </Link>
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground">Comece sua jornada fitness hoje</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {(generalError || error) && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                  {generalError || error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    }
                  })}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
                {getFieldError('name') && (
                  <p className="text-sm text-destructive">{getFieldError('name')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
                {getFieldError('email') && (
                  <p className="text-sm text-destructive">{getFieldError('email')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    {...register('password', {
                      required: 'Senha é obrigatória',
                      minLength: {
                        value: 8,
                        message: 'Senha deve ter pelo menos 8 caracteres'
                      },
                      validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || 'Senha deve conter: minúscula, maiúscula, número e caractere especial'
                    })}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                {getFieldError('password') && (
                  <p className="text-sm text-destructive">{getFieldError('password')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    {...register('confirmPassword', {
                      required: 'Confirmação de senha é obrigatória',
                      validate: (value) => value === password || 'As senhas não coincidem'
                    })}
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Idade
                </label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Sua idade"
                  {...register('age', {
                    required: 'Idade é obrigatória',
                    min: {
                      value: 13,
                      message: 'Idade mínima é 13 anos'
                    },
                    max: {
                      value: 120,
                      message: 'Idade máxima é 120 anos'
                    },
                    valueAsNumber: true
                  })}
                  className={errors.age ? 'border-destructive' : ''}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age.message}</p>
                )}
                {getFieldError('age') && (
                  <p className="text-sm text-destructive">{getFieldError('age')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefone (opcional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  {...register('phone')}
                />
                {getFieldError('phone') && (
                  <p className="text-sm text-destructive">{getFieldError('phone')}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;