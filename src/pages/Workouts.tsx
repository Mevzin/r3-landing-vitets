import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { fileService, userService } from '../services/api';
import type { Workout } from '../types';
import { Upload, Download, FileText, Image, Video, Trash2, Eye, Plus } from 'lucide-react';

interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
  url?: string;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchWorkoutsAndFiles();
  }, []);

  const fetchWorkoutsAndFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar treinos do usuário
      const userWorkouts = await userService.getUserWorkouts();
      setWorkouts(userWorkouts);
      
      // Buscar arquivos do usuário
      try {
        const userFiles = await fileService.getUserFiles();
        setFiles(userFiles);
      } catch (fileError) {
        console.warn('Erro ao buscar arquivos:', fileError);
        setFiles([]);
      }
    } catch (err) {
      setError('Erro ao carregar treinos. Tente novamente.');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB');
        return;
      }
      
      // Verificar tipo do arquivo
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/'];
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
      
      if (!isAllowed) {
        setError('Tipo de arquivo não permitido. Use imagens, vídeos, PDFs ou documentos de texto.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setError(null);
      
      const uploadedFile = await fileService.uploadFile(selectedFile);
      
      // Atualizar lista de arquivos
      setFiles(prev => [uploadedFile, ...prev]);
      setSelectedFile(null);
      
      // Limpar input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Erro ao fazer upload do arquivo. Tente novamente.');
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await fileService.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file._id !== fileId));
    } catch (err) {
      setError('Erro ao deletar arquivo.');
      console.error('Erro ao deletar:', err);
    }
  };

  const handleFileDownload = async (fileId: string, filename: string) => {
    try {
      const blob = await fileService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Erro ao baixar arquivo.');
      console.error('Erro no download:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (mimetype.startsWith('video/')) {
      return <Video className="w-5 h-5 text-purple-500" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Badge variant="secondary">Imagem</Badge>;
    } else if (mimetype.startsWith('video/')) {
      return <Badge variant="secondary">Vídeo</Badge>;
    } else if (mimetype.includes('pdf')) {
      return <Badge variant="secondary">PDF</Badge>;
    } else {
      return <Badge variant="outline">Documento</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meus Treinos</h1>
        <p className="text-muted-foreground">
          Gerencie seus treinos e arquivos relacionados.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Upload de Arquivos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload de Arquivos
          </CardTitle>
          <CardDescription>
            Faça upload de imagens, vídeos ou documentos relacionados aos seus treinos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.txt,.doc,.docx"
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tipos permitidos: Imagens, vídeos, PDFs, documentos de texto. Tamanho máximo: 10MB
              </p>
            </div>
            
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile.type)}
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Treinos */}
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
              Seus treinos cadastrados e histórico de atividades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <div key={workout._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{workout.name}</h4>
                      <Badge variant="outline">
                        {workout.exercises?.length || 0} exercícios
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {workout.description || 'Sem descrição'}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum treino cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro treino para começar!
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Arquivos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Arquivos</CardTitle>
            <CardDescription>
              Arquivos enviados relacionados aos seus treinos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.mimetype)}
                      <div>
                        <p className="font-medium">{file.originalName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {getFileTypeBadge(file.mimetype)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFileDownload(file._id, file.originalName)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFileDelete(file._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum arquivo enviado</h3>
                <p className="text-muted-foreground">
                  Faça upload de arquivos relacionados aos seus treinos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Workouts;