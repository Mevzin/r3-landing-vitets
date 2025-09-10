import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Progress from './pages/Progress';
import Workouts from './pages/Workouts';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Componente para rotas públicas (redireciona se já logado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

// Componente para rotas de admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* Rotas protegidas */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="workouts" element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            } />
            
            <Route path="progress" element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } />
            
            <Route path="plans" element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            } />
            
            {/* Rotas de admin */}
            <Route path="admin/users" element={
              <AdminRoute>
                <div className="text-center py-20">
                  <h1 className="text-3xl font-bold mb-4">Gerenciar Usuários</h1>
                  <p className="text-muted-foreground">Página em desenvolvimento...</p>
                </div>
              </AdminRoute>
            } />
            
            <Route path="admin/workouts" element={
              <AdminRoute>
                <div className="text-center py-20">
                  <h1 className="text-3xl font-bold mb-4">Gerenciar Treinos</h1>
                  <p className="text-muted-foreground">Página em desenvolvimento...</p>
                </div>
              </AdminRoute>
            } />
            
            <Route path="admin/plans" element={
              <AdminRoute>
                <div className="text-center py-20">
                  <h1 className="text-3xl font-bold mb-4">Gerenciar Planos</h1>
                  <p className="text-muted-foreground">Página em desenvolvimento...</p>
                </div>
              </AdminRoute>
            } />
          </Route>
          
          {/* Rota catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
