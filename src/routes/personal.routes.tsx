import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PersonalRoute } from '../components/auth/PersonalRoute';
import Layout from '../components/Layout';

export const PersonalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={
        <PersonalRoute>
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Dashboard Personal</h1>
              <p className="text-muted-foreground">Área específica para personal trainers...</p>
            </div>
          </Layout>
        </PersonalRoute>
      } />
      
      <Route path="clients" element={
        <PersonalRoute>
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Gerenciar Clientes</h1>
              <p className="text-muted-foreground">Página em desenvolvimento...</p>
            </div>
          </Layout>
        </PersonalRoute>
      } />
      
      <Route path="workouts" element={
        <PersonalRoute>
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Criar Treinos</h1>
              <p className="text-muted-foreground">Página em desenvolvimento...</p>
            </div>
          </Layout>
        </PersonalRoute>
      } />
      
      <Route path="schedule" element={
        <PersonalRoute>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Agenda</h1>
            <p className="text-muted-foreground">Página em desenvolvimento...</p>
          </div>
        </PersonalRoute>
      } />
    </Routes>
  );
};