import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { fileService, userService } from '../services/api';
import { useAuth } from '../lib/auth';
import type { Workout, User } from '../types';
import { Plus, Eye, Edit, Users } from 'lucide-react';

const Workouts: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserWorkout, setSelectedUserWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);

  const isPersonalOrAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isPersonalOrAdmin) {
      fetchAllUsers();
    } else {
      fetchUserWorkouts();
    }
  }, [isPersonalOrAdmin]);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError('Erro ao carregar usuários. Tente novamente.');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserWorkouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (user?.id) {
        const response = await fileService.getFileByUserId(user.id);
        setWorkouts(response.files || []);
      }
    } catch (err) {
      setError('Erro ao carregar treinos. Tente novamente.');
      console.error('Erro ao buscar treinos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUserWorkout = async (selectedUser: User) => {
    try {
      setIsLoading(true);
      const response = await fileService.getFileByUserId(selectedUser.id);
      const userWorkout = response.files?.[0] || null;
      setSelectedUser(selectedUser);
      setSelectedUserWorkout(userWorkout);
      setIsEditingWorkout(true);
    } catch (err) {
      setError('Erro ao carregar treino do usuário.');
      console.error('Erro ao buscar treino:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
    setSelectedUserWorkout(null);
    setIsEditingWorkout(false);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  
  if (isEditingWorkout && selectedUser && isPersonalOrAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBackToUserList}
            className="mb-4"
          >
            ← Voltar para Lista de Usuários
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Editando Treino - {selectedUser.name}
          </h1>
          <p className="text-muted-foreground">
            Edite o treino do usuário selecionado.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Treino de {selectedUser.name}</span>
              <Badge variant="secondary">
                {selectedUser.email}
              </Badge>
            </CardTitle>
            <CardDescription>
              Edite os exercícios e configurações do treino.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedUserWorkout ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{selectedUserWorkout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedUserWorkout.description || 'Sem descrição'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {selectedUserWorkout.exercises?.length || 0} exercícios
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Exercícios:</h5>
                    {selectedUserWorkout.exercises?.length > 0 ? (
                      selectedUserWorkout.exercises.map((exercise, index) => (
                        <div key={exercise._id || index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium">{exercise.name}</h6>
                              <div className="text-sm text-muted-foreground mt-1">
                                {exercise.sets && <span>Séries: {exercise.sets} | </span>}
                                {exercise.reps && <span>Repetições: {exercise.reps} | </span>}
                                {exercise.weight && <span>Peso: {exercise.weight}kg | </span>}
                                {exercise.duration && <span>Duração: {exercise.duration}min</span>}
                              </div>
                              {exercise.notes && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Observações: {exercise.notes}
                                </p>
                              )}
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhum exercício cadastrado neste treino.
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Exercício
                    </Button>
                    <Button variant="outline">
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum treino cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Este usuário ainda não possui treinos. Crie o primeiro treino!
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPersonalOrAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Treinos</h1>
          <p className="text-muted-foreground">
            Selecione um usuário para editar seus treinos.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Lista de Usuários
            </CardTitle>
            <CardDescription>
              Clique em "Editar Treino" para modificar os treinos de cada usuário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.map((userItem) => (
                  <div key={userItem.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{userItem.name}</h4>
                        <p className="text-sm text-muted-foreground">{userItem.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={userItem.role === 'admin' ? 'default' : 'outline'}>
                            {userItem.role === 'admin' ? 'Administrador' : 'Usuário'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Criado em {new Date(userItem.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditUserWorkout(userItem)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Treino
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground">
                  Não há usuários cadastrados no sistema.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meus Treinos</h1>
        <p className="text-muted-foreground">
          Visualize e edite seus treinos personalizados.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Meus Treinos</span>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Novo Treino
            </Button>
          </CardTitle>
          <CardDescription>
            Seus treinos personalizados prontos para edição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {workout.description || 'Sem descrição'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {workout.exercises?.length || 0} exercícios
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Exercícios:</h5>
                    {workout.exercises?.length > 0 ? (
                      workout.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={exercise._id || index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium">{exercise.name}</h6>
                              <div className="text-sm text-muted-foreground mt-1">
                                {exercise.sets && <span>Séries: {exercise.sets} | </span>}
                                {exercise.reps && <span>Repetições: {exercise.reps} | </span>}
                                {exercise.weight && <span>Peso: {exercise.weight}kg | </span>}
                                {exercise.duration && <span>Duração: {exercise.duration}min</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-2">
                        Nenhum exercício cadastrado.
                      </p>
                    )}
                    {workout.exercises?.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{workout.exercises.length - 3} exercícios adicionais
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-muted-foreground">
                      Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum treino cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não possui treinos. Solicite ao seu personal trainer!
              </p>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Contatar Personal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Workouts;