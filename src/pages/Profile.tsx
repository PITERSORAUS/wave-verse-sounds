
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, X, Music, Heart, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    profilePicture: null as File | null
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        profilePicture: null
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        profilePicture: null
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-16 w-16 text-white" />
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-white text-sm">Nome de usuário</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white text-center"
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName" className="text-white text-sm">Nome de exibição</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white text-center"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white text-sm">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                        rows={3}
                        placeholder="Conte sobre você..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {userProfile?.displayName || userProfile?.username}
                    </h2>
                    <p className="text-purple-300 mb-4">@{userProfile?.username}</p>
                    <p className="text-gray-300 text-sm">
                      {userProfile?.bio || 'Nenhuma bio adicionada ainda.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Músicas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Seguindo</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                <TabsTrigger value="tracks" className="text-white">Músicas</TabsTrigger>
                <TabsTrigger value="liked" className="text-white">Curtidas</TabsTrigger>
                <TabsTrigger value="playlists" className="text-white">Playlists</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracks" className="mt-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma música ainda</h3>
                  <p className="text-gray-400 mb-4">
                    Faça upload de suas primeiras músicas para aparecerem aqui
                  </p>
                  <Button 
                    onClick={() => navigate('/upload')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Fazer Upload
                  </Button>
                </Card>
              </TabsContent>
              
              <TabsContent value="liked" className="mt-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma música curtida</h3>
                  <p className="text-gray-400">
                    Curta algumas músicas para vê-las aqui
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="playlists" className="mt-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma playlist criada</h3>
                  <p className="text-gray-400 mb-4">
                    Crie playlists para organizar suas músicas favoritas
                  </p>
                  <Button 
                    onClick={() => navigate('/playlists')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Criar Playlist
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
