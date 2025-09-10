import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/button';
import { Dumbbell, User, LogOut, Users, Calendar, CreditCard } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GymSys</span>
            </Link>
            <div className="flex space-x-4">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GymSys</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/workouts" className="text-foreground hover:text-primary transition-colors">
              Treinos
            </Link>
            <Link to="/plans" className="text-foreground hover:text-primary transition-colors">
              Planos
            </Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/users" className="text-foreground hover:text-primary transition-colors">
                  Usuários
                </Link>
                <Link to="/admin/workouts" className="text-foreground hover:text-primary transition-colors">
                  Gerenciar Treinos
                </Link>
                <Link to="/admin/plans" className="text-foreground hover:text-primary transition-colors">
                  Gerenciar Planos
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, {user.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden border-b bg-background">
        <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
          <Link to="/dashboard" className="flex items-center space-x-1 text-sm whitespace-nowrap">
            <User className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/workouts" className="flex items-center space-x-1 text-sm whitespace-nowrap">
            <Calendar className="h-4 w-4" />
            <span>Treinos</span>
          </Link>
          <Link to="/plans" className="flex items-center space-x-1 text-sm whitespace-nowrap">
            <CreditCard className="h-4 w-4" />
            <span>Planos</span>
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin/users" className="flex items-center space-x-1 text-sm whitespace-nowrap">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;