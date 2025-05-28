
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Users, Heart, MessageCircle, Music, User, Plus } from "lucide-react";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header onLogin={() => openAuthModal('login')} onRegister={() => openAuthModal('register')} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Sound
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                fly
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Descubra, compartilhe e conecte-se através da música. Sua jornada sonora começa aqui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                onClick={() => openAuthModal('register')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-400 text-purple-300 hover:bg-purple-800/50 px-8 py-3 text-lg"
                onClick={() => openAuthModal('login')}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/20 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Por que escolher o Soundfly?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Upload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Fácil</h3>
              <p className="text-gray-300">Compartilhe suas músicas com capas personalizadas</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Users className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Conecte-se</h3>
              <p className="text-gray-300">Faça amizades e descubra artistas incríveis</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Interaja</h3>
              <p className="text-gray-300">Curta, comente e acompanhe suas favoritas</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Music className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Playlists</h3>
              <p className="text-gray-300">Crie e organize suas playlists favoritas</p>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
