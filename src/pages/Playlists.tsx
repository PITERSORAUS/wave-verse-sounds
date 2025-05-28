
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';

const Playlists = () => {
  const navigate = useNavigate();
  const [playlists] = useState([]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Minhas Playlists</h1>
              <p className="text-gray-300 mt-2">Organize suas músicas favoritas</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Nova Playlist
            </Button>
          </div>
        </div>

        {playlists.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-12 text-center">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhuma playlist criada
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Crie sua primeira playlist para organizar suas músicas favoritas
              e compartilhar com seus amigos.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Playlist
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Playlists will be rendered here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;
