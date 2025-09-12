import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Workouts from '../pages/Workouts';
import Progress from '../pages/Progress';
import Plans from '../pages/Plans';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import Layout from '../components/Layout';

export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="workouts" element={
        <ProtectedRoute>
          <Layout>
            <Workouts />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="progress" element={
        <ProtectedRoute>
          <Layout>
            <Progress />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="plans" element={
        <ProtectedRoute>
          <Layout>
            <Plans />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};