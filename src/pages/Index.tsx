
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Play, Pause, User, Search, Upload, Home, Users } from "lucide-react";
import Header from "@/components/Header";
import MusicCard from "@/components/MusicCard";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Mock data for demonstration
  const mockTracks = [
    {
      id: 1,
      title: "Midnight Vibes",
      artist: "DJ Luna",
      duration: "3:45",
      likes: 1247,
      views: 5821,
      comments: 34,
      cover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
      isPublic: true
    },
    {
      id: 2,
      title: "Summer Dreams",
      artist: "Acoustic Soul",
      duration: "4:12",
      likes: 892,
      views: 3245,
      comments: 18,
      cover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
      isPublic: true
    },
    {
      id: 3,
      title: "Electronic Waves",
      artist: "Synth Master",
      duration: "5:23",
      likes: 2156,
      views: 8932,
      comments: 67,
      cover: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop",
      isPublic: true
    }
  ];

  const handlePlay = (trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

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

      {/* Music Feed */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Descubra Novas Músicas
        </h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          {mockTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              isPlaying={currentTrack === track.id && isPlaying}
              onPlay={() => handlePlay(track.id)}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/20 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Por que escolher o Soundfly?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Upload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Fácil</h3>
              <p className="text-gray-300">Compartilhe suas músicas com capas personalizadas e estilos únicos</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Users className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Conecte-se</h3>
              <p className="text-gray-300">Faça amizades e descubra artistas incríveis na comunidade</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Interaja</h3>
              <p className="text-gray-300">Curta, comente e acompanhe suas músicas favoritas</p>
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
