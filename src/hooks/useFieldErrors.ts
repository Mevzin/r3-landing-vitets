import { useState, useCallback } from 'react';

interface FieldError {
  field: string;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      code?: string;
      details?: FieldError[];
      message?: string;
    };
  };
}

interface FieldErrors {
  [fieldName: string]: string;
}

export const useFieldErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>('');

  const clearErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError('');
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setErrorsFromApi = useCallback((error: unknown) => {
    const apiError = error as ApiError;
    
    // Limpar erros anteriores
    clearErrors();

    // Verificar se é um erro de validação com detalhes de campos
    if (apiError.response?.data?.code === 'VALIDATION_ERROR' && 
        apiError.response.data.details && 
        Array.isArray(apiError.response.data.details)) {
      
      // Mapear erros para campos específicos
      const errors: FieldErrors = {};
      apiError.response.data.details.forEach((detail: FieldError) => {
        errors[detail.field] = detail.message;
      });
      
      setFieldErrors(errors);
    } else {
      // Erro geral (não específico de campo)
      const message = apiError.response?.data?.message || 'Erro inesperado';
      setGeneralError(message);
    }
  }, [clearErrors]);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  }, [fieldErrors]);

  const hasFieldError = useCallback((fieldName: string): boolean => {
    return !!fieldErrors[fieldName];
  }, [fieldErrors]);

  const hasAnyFieldErrors = useCallback((): boolean => {
    return Object.keys(fieldErrors).length > 0;
  }, [fieldErrors]);

  return {
    fieldErrors,
    generalError,
    clearErrors,
    clearFieldError,
    setErrorsFromApi,
    getFieldError,
    hasFieldError,
    hasAnyFieldErrors
  };
};