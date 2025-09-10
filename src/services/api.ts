import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api/v1';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Import types
import type { User, Plan, Workout, Exercise } from '../types';

// Serviços de API
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    height: number;
    phone?: string;
  }) => {
    const response = await api.post('/user/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
};

export const userService = {
  updateUser: async (userId: string, userData: Partial<User>) => {
    const response = await api.patch(`/user/update/${userId}`, userData);
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.post('/user/getUserById', { userId });
    return response.data;
  },

  getUserByEmail: async (email: string) => {
    const response = await api.post('/user/getUserByEmail', { email });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/user/all');
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/user/delete/${userId}`);
    return response.data;
  },

  assignPersonalRole: async (userId: string) => {
    const response = await api.patch(`/user/assign-personal/${userId}`);
    return response.data;
  },

  removePersonalRole: async (userId: string) => {
    const response = await api.patch(`/user/remove-personal/${userId}`);
    return response.data;
  },
};

export const paymentService = {
  getPlans: async () => {
    const response = await api.get('/payment/plans');
    return response.data;
  },

  createCustomer: async (userId: string) => {
    const response = await api.post('/payment/customer', { userId });
    return response.data;
  },

  createSubscription: async (data: {
    userId: string;
    planId: string;
    paymentMethodId: string;
  }) => {
    const response = await api.post('/payment/monthly-payment', data);
    return response.data;
  },

  cancelSubscription: async (subscriptionId: string) => {
    const response = await api.patch(`/payment/monthly-payment/${subscriptionId}/cancel`);
    return response.data;
  },

  getUserSubscription: async (userId: string) => {
    const response = await api.get(`/payment/monthly-payment/user/${userId}`);
    return response.data;
  },

  createPlan: async (planData: Partial<Plan>) => {
    const response = await api.post('/payment/plans', planData);
    return response.data;
  },

  updatePlan: async (planId: string, planData: Partial<Plan>) => {
    const response = await api.patch(`/payment/plans/${planId}`, planData);
    return response.data;
  },

  deletePlan: async (planId: string) => {
    const response = await api.delete(`/payment/plans/${planId}`);
    return response.data;
  },

  subscribe: async (data: {
    userId: string;
    planId: string;
    paymentMethodId: string;
  }) => {
    const response = await api.post('/payment/subscribe', data);
    return response.data;
  },
};

export const fileService = {
  createFile: async (fileData: {
    userId: string;
    name: string;
    exercises: Exercise[];
  }) => {
    const response = await api.post('/files/createFile', fileData);
    return response.data;
  },

  getAllFiles: async () => {
    const response = await api.get('/files/');
    return response.data;
  },

  getFileById: async (fileId: string) => {
    const response = await api.get(`/files/getFileById/${fileId}`);
    return response.data;
  },

  getFileByUserId: async (userId: string) => {
    const response = await api.post('/files/getFileByUserId', { userId });
    return response.data;
  },

  updateFileById: async (fileId: string, fileData: Partial<Workout>) => {
    const response = await api.put(`/files/updateFileById/${fileId}`, fileData);
    return response.data;
  },

  getExercisesByDay: async (day: string, userId: string) => {
    const response = await api.get(`/files/day/${day}/${userId}`);
    return response.data;
  },

  updateExercisesByDay: async (day: string, exercises: Exercise[]) => {
    const response = await api.put(`/files/day/${day}`, { exercises });
    return response.data;
  },
};

export const progressService = {
  getProgress: async () => {
    const response = await api.get('/progress/me');
    return response.data;
  },

  updateWeightLoss: async (weightLoss: number) => {
    const response = await api.put('/progress/weight-loss', { weightLoss });
    return response.data;
  },

  updateCaloriesBurned: async (calories: number) => {
    const response = await api.put('/progress/calories', { calories });
    return response.data;
  },

  completeWorkout: async (workoutData: {
    workoutId: string;
    duration: number;
    caloriesBurned: number;
  }) => {
    const response = await api.post('/progress/complete-workout', workoutData);
    return response.data;
  },

  updatePerformanceMetrics: async (metrics: {
    strength?: number;
    endurance?: number;
    flexibility?: number;
  }) => {
    const response = await api.put('/progress/performance-metrics', metrics);
    return response.data;
  },

  addAchievement: async (achievement: string) => {
    const response = await api.post('/progress/achievement', { achievement });
    return response.data;
  },

  updateMonthlyGoals: async (goals: {
    weightLoss?: number;
    workouts?: number;
    calories?: number;
  }) => {
    const response = await api.put('/progress/monthly-goals', goals);
    return response.data;
  },

  resetWeeklyProgress: async () => {
    const response = await api.put('/progress/reset-weekly');
    return response.data;
  },
};

export const measurementsService = {
  getMeasurements: async (userId: string) => {
    const response = await api.get(`/user/measurements/${userId}`);
    return response.data;
  },

  updateMeasurements: async (userId: string, measurements: {
    weight?: number;
    height?: number;
    bodyFat?: number;
    muscleMass?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  }) => {
    const response = await api.put(`/user/measurements/${userId}`, measurements);
    return response.data;
  },
};

export default api;