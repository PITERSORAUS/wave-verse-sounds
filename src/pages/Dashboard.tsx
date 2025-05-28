
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

const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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
                  variant={activeTab === 'discover' ? 'default' : 'ghost'}
                  className="w-full justify-start text-white"
                  onClick={() => setActiveTab('discover')}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Descobrir
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

            {activeTab === 'discover' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Descobrir Músicas</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Buscar músicas, artistas..."
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-80"
                    />
                  </div>
                </div>
                <div className="text-center text-gray-400 py-12">
                  Implemente a funcionalidade de descobrir músicas aqui
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
