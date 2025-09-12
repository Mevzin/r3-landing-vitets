import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { paymentService } from '../services/api';
import type { Plan } from '../types';

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan | null;
  onSuccess: () => void;
}

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  interval: 'month' | 'year';
  duration: string;
  features: string[];
}

const PlanFormDialog: React.FC<PlanFormDialogProps> = ({
  open,
  onOpenChange,
  plan,
  onSuccess
}) => {
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: '',
    interval: 'month',
    duration: '30',
    features: ['']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!plan;

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        price: plan.price.toString(),
        interval: plan.interval as 'month' | 'year',
        duration: plan.duration?.toString() || '30',
        features: plan.features || ['']
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        interval: 'month',
        duration: '30',
        features: ['']
      });
    }
    setError(null);
  }, [plan, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const planData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        interval: formData.interval,
        duration: parseInt(formData.duration),
        features: formData.features.filter(f => f.trim() !== ''),
        isActive: true
      };

      if (isEditing && plan) {
        await paymentService.updatePlan(plan._id, planData);
      } else {
        await paymentService.createPlan(planData);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(isEditing ? 'Erro ao atualizar plano' : 'Erro ao criar plano');
      console.error('Erro ao salvar plano:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PlanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Plano' : 'Criar Novo Plano'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifique as informações do plano abaixo.'
              : 'Preencha as informações para criar um novo plano.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Plano</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Plano Mensal Premium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição do plano (opcional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preço (R$)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duração (dias)</label>
            <Input
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="30"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Intervalo de Cobrança</label>
            <select
              value={formData.interval}
              onChange={(e) => handleInputChange('interval', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              required
            >
              <option value="month">Mensal</option>
              <option value="year">Anual</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Funcionalidades</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Funcionalidade ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="w-full"
              >
                + Adicionar Funcionalidade
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !formData.name || !formData.price || !formData.duration || formData.features.filter(f => f.trim()).length === 0}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Atualizando...' : 'Criando...'}
                </>
              ) : (
                isEditing ? 'Atualizar Plano' : 'Criar Plano'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanFormDialog;