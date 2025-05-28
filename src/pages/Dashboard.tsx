import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Upload, User, Music, Users, Heart, MessageCircle, Plus } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import MusicCard from '@/components/MusicCard';
import FeedActivity from '@/components/FeedActivity';
import { searchTracks } from '@/services/trackService';
import { searchUsers } from '@/services/userService';

const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ tracks: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handlePlayTrack = (trackId: string) => {
    setCurrentlyPlaying(currentlyPlaying === trackId ? null : trackId);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const [tracks, users] = await Promise.all([
        searchTracks(searchTerm),
        searchUsers(searchTerm)
      ]);
      setSearchResults({ tracks, users });
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{userProfile?.username}</h3>
                  <p className="text-gray-400 text-sm">{userProfile?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'feed' ? 'default' : 'ghost'}
                  className="w-full justify-start text-white"
                  onClick={() => setActiveTab('feed')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Feed
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white"
                  onClick={() => navigate('/upload')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Fazer Upload
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white"
                  onClick={() => navigate('/friends')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Amigos
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Mensagens
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white"
                  onClick={() => navigate('/playlists')}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Playlists
                </Button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Buscar músicas, artistas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>

            {activeTab === 'feed' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Seu Feed</h2>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => navigate('/upload')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Música
                  </Button>
                </div>
                <FeedActivity />
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Resultados da Busca</h2>
                
                {searchResults.tracks.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Músicas</h3>
                    <div className="grid gap-4">
                      {searchResults.tracks.map((track) => (
                        <MusicCard 
                          key={track.id} 
                          track={track}
                          isPlaying={currentlyPlaying === track.id}
                          onPlay={() => handlePlayTrack(track.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResults.users.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Usuários</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.users.map((user) => (
                        <Card key={user.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{user.username}</h4>
                              <p className="text-gray-400 text-sm">{user.displayName}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              Ver Perfil
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResults.tracks.length === 0 && searchResults.users.length === 0 && searchTerm && (
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-gray-400">
                      Tente buscar por outros termos
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
