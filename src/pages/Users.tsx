import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Users as UsersIcon, Calendar, CreditCard } from 'lucide-react';
import { userService, paymentService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planType: 'monthly' | 'annual' | null;
  purchaseDate: string | null;
  expirationDate: string | null;
  status: 'active' | 'expired' | 'cancelled';
}

interface EditForm {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      const userData = response.users;
      setUsers(userData);
      const subscriptionPromises = userData.map(async (user: User) =>
        await fetchUserSubscription(user.id)
      );

      const subscriptionResults = await Promise.all(subscriptionPromises);
      const subscriptionMap: Record<string, Subscription> = {};

      subscriptionResults.forEach((sub, index) => {
        if (sub) {
          subscriptionMap[userData[index].id] = sub;
        }
      });

      setSubscriptions(subscriptionMap);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async (userId: string): Promise<Subscription | null> => {
    try {
      const response = await paymentService.getUserSubscription(userId);

      const monthlyPayment = response.monthlyPayment;

      if (!monthlyPayment) {
        return null;
      }


      return {
        id: monthlyPayment._id,
        userId: monthlyPayment.userId,
        planType: monthlyPayment.interval === 'month' ? 'monthly' : 'annual',
        purchaseDate: monthlyPayment.currentPeriodStart,
        expirationDate: monthlyPayment.currentPeriodEnd,
        status: monthlyPayment.status
      };
    } catch (error) {
      console.error(`Erro ao buscar assinatura do usuário ${userId}:`, error);
      return null;
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.id, editForm);
      await fetchUsers();
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      user: { label: 'Usuário', variant: 'default' as const, className: 'bg-blue-500 text-white' },
      personal: { label: 'Personal', variant: 'secondary' as const, className: 'bg-orange-500 text-white' },
      admin: { label: 'Admin', variant: 'destructive' as const, className: 'bg-purple-500 text-white' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPlanBadge = (subscription: Subscription | undefined) => {
    if (!subscription || !subscription.planType) {
      return (
        <Badge variant="secondary" className="bg-gray-500 text-white">
          Não possui
        </Badge>
      );
    }

    const planConfig = {
      monthly: { label: 'Mensal', className: 'bg-blue-500 text-white' },
      annual: { label: 'Anual', className: 'bg-purple-500 text-white' }
    };

    const config = planConfig[subscription.planType];

    return (
      <Badge variant="default" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '--/--/--';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '--/--/--';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando usuários...</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <UsersIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
      </div>

      <div className="grid gap-4">
        {users.map((user) => {
          const subscription = subscriptions[user.id];

          return (
            <Card key={user.id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {getRoleBadge(user.role)}
                      {getPlanBadge(subscription)}
                    </div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setEditForm({
                            name: user.name,
                            email: user.email,
                            role: user.role
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="role">Função</Label>
                          <Select value={editForm.role} onValueChange={(value) =>
                            setEditForm(prev => ({ ...prev, role: value as 'user' | 'admin' }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleEditUser}>
                          Salvar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Criação: {formatDate(user.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Compra: {formatDate(subscription?.purchaseDate || null)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Expiração: {formatDate(subscription?.expirationDate || null)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default Users;