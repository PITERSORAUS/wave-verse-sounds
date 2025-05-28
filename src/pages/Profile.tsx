
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, X, Music, Heart, Users, ArrowLeft, Repeat } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { getUserTracks } from '@/services/trackService';
import { getUserReposts } from '@/services/repostService';
import MusicCard from '@/components/MusicCard';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userTracks, setUserTracks] = useState([]);
  const [userReposts, setUserReposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    profilePicture: null as File | null
  });

  const isOwnProfile = !userId || userId === user?.uid;

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

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || user?.uid;
      
      const [tracks, reposts] = await Promise.all([
        getUserTracks(targetUserId),
        getUserReposts(targetUserId)
      ]);
      
      setUserTracks(tracks);
      setUserReposts(reposts);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
                
                {isEditing && isOwnProfile ? (
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

              {isOwnProfile && (
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
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userTracks.length}</div>
                  <div className="text-sm text-gray-400">Faixas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userReposts.length}</div>
                  <div className="text-sm text-gray-400">Reposts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Seguidores</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                <TabsTrigger value="tracks" className="text-white">
                  Faixas ({userTracks.length})
                </TabsTrigger>
                <TabsTrigger value="reposts" className="text-white">
                  Reposts ({userReposts.length})
                </TabsTrigger>
                <TabsTrigger value="liked" className="text-white">Curtidas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracks" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-pulse">
                        <div className="h-16 bg-white/20 rounded"></div>
                      </Card>
                    ))}
                  </div>
                ) : userTracks.length > 0 ? (
                  <div className="space-y-4">
                    {userTracks.map((track) => (
                      <MusicCard key={track.id} track={track} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                    <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {isOwnProfile ? 'Nenhuma música ainda' : 'Nenhuma música publicada'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {isOwnProfile 
                        ? 'Faça upload de suas primeiras músicas para aparecerem aqui'
                        : 'Este usuário ainda não publicou nenhuma música'
                      }
                    </p>
                    {isOwnProfile && (
                      <Button 
                        onClick={() => navigate('/upload')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Fazer Upload
                      </Button>
                    )}
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reposts" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-pulse">
                        <div className="h-16 bg-white/20 rounded"></div>
                      </Card>
                    ))}
                  </div>
                ) : userReposts.length > 0 ? (
                  <div className="space-y-4">
                    {userReposts.map((repost) => (
                      <Card key={repost.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Repeat className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300 text-sm">
                            {isOwnProfile ? 'Você' : userProfile?.username} repostou
                          </span>
                        </div>
                        {/* Here you would load and display the original track */}
                        <div className="text-white">Track ID: {repost.trackId}</div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                    <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {isOwnProfile ? 'Nenhum repost ainda' : 'Nenhum repost'}
                    </h3>
                    <p className="text-gray-400">
                      {isOwnProfile 
                        ? 'Reposte músicas que você gosta para aparecerem aqui'
                        : 'Este usuário ainda não repostou nenhuma música'
                      }
                    </p>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="liked" className="mt-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isOwnProfile ? 'Nenhuma música curtida' : 'Curtidas privadas'}
                  </h3>
                  <p className="text-gray-400">
                    {isOwnProfile 
                      ? 'Curta algumas músicas para vê-las aqui'
                      : 'As curtidas deste usuário são privadas'
                    }
                  </p>
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
