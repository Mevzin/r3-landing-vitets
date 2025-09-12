import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import { PublicRoute } from '../components/auth/PublicRoute';
import { UserRoutes } from './user.routes';
import { PersonalRoutes } from './personal.routes';
import { AdminRoutes } from './admin.routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/*" element={<UserRoutes />} />
      <Route path="personal/*" element={<PersonalRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};