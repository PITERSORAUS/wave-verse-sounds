
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Music, Image, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    isPublic: true,
    audioFile: null as File | null,
    coverFile: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 
    'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Punk', 'Metal', 'Outro'
  ];

  const handleFileChange = (type: 'audio' | 'cover', file: File | null) => {
    if (type === 'audio') {
      setFormData(prev => ({ ...prev, audioFile: file }));
    } else {
      setFormData(prev => ({ ...prev, coverFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.audioFile || !formData.title || !formData.artist) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsUploading(true);
    
    try {
      // TODO: Implement Firebase upload logic
      console.log('Uploading track:', formData);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Música enviada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar música. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Upload de Música</h1>
          <p className="text-gray-300 mt-2">Compartilhe sua música com o mundo</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio File Upload */}
            <div>
              <Label htmlFor="audio" className="text-white mb-2 block">
                Arquivo de Áudio *
              </Label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  Arraste e solte seu arquivo de áudio aqui ou clique para selecionar
                </p>
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange('audio', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => document.getElementById('audio')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Arquivo
                </Button>
                {formData.audioFile && (
                  <p className="text-green-400 mt-2">
                    Arquivo selecionado: {formData.audioFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label htmlFor="cover" className="text-white mb-2 block">
                Capa da Música
              </Label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  Adicione uma capa personalizada para sua música
                </p>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('cover', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => document.getElementById('cover')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                </Button>
                {formData.coverFile && (
                  <p className="text-green-400 mt-2">
                    Capa selecionada: {formData.coverFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-white mb-2 block">
                  Título da Música *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Digite o título da música"
                />
              </div>

              {/* Artist */}
              <div>
                <Label htmlFor="artist" className="text-white mb-2 block">
                  Nome do Artista *
                </Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Digite o nome do artista"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <Label htmlFor="genre" className="text-white mb-2 block">
                Gênero Musical
              </Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-white/10">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-white mb-2 block">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Conte sobre sua música..."
                rows={4}
              />
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <Label htmlFor="privacy" className="text-white font-medium">
                  Música Pública
                </Label>
                <p className="text-gray-400 text-sm">
                  Permitir que outros usuários vejam e escutem esta música
                </p>
              </div>
              <Switch
                id="privacy"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !formData.audioFile || !formData.title || !formData.artist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Publicar Música
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
