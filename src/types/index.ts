export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  stripeProductId: string;
  stripePriceId: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  _id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface ProgressData {
  _id: string;
  userId: string;
  weightLoss: number;
  caloriesBurned: number;
  workoutsCompleted: number;
  performanceMetrics: {
    strength: number;
    endurance: number;
    flexibility: number;
  };
  achievements: string[];
  monthlyGoals: {
    weightLoss: number;
    workouts: number;
    calories: number;
  };
  weeklyProgress: {
    workouts: number;
    calories: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}