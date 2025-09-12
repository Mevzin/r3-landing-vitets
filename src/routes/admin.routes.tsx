import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoute } from '../components/auth/AdminRoute';
import Layout from '../components/Layout';
import Users from '../pages/Users';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="users" element={
        <AdminRoute>
          <Layout>
            <Users />
          </Layout>
        </AdminRoute>
      } />
      
      <Route path="workouts" element={
        <AdminRoute>
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Gerenciar Treinos</h1>
              <p className="text-muted-foreground">Página em desenvolvimento...</p>
            </div>
          </Layout>
        </AdminRoute>
      } />
      
      <Route path="plans" element={
        <AdminRoute>
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Gerenciar Planos</h1>
              <p className="text-muted-foreground">Página em desenvolvimento...</p>
            </div>
          </Layout>
        </AdminRoute>
      } />
      
      <Route path="reports" element={
        <AdminRoute>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Relatórios</h1>
            <p className="text-muted-foreground">Página em desenvolvimento...</p>
          </div>
        </AdminRoute>
      } />
      
      <Route path="settings" element={
        <AdminRoute>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Configurações do Sistema</h1>
            <p className="text-muted-foreground">Página em desenvolvimento...</p>
          </div>
        </AdminRoute>
      } />
    </Routes>
  );
};