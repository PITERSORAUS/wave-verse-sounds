
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, MessageCircle, Share2, Play, Repeat } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { getPublicTracks, likeTrack, addComment, getTrackComments, incrementPlays } from '@/services/trackService';
import { repostTrack } from '@/services/repostService';

const TrackView = () => {
  const navigate = useNavigate();
  const { uniqueId } = useParams();
  const { user, userProfile } = useAuth();
  const [track, setTrack] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uniqueId) {
      loadTrack();
    }
  }, [uniqueId]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const tracks = await getPublicTracks(100);
      const foundTrack = tracks.find(t => t.uniqueId === uniqueId);
      
      if (foundTrack) {
        setTrack(foundTrack);
        const trackComments = await getTrackComments(foundTrack.id);
        setComments(trackComments);
        
        // Increment play count
        await incrementPlays(foundTrack.id);
      }
    } catch (error) {
      console.error('Error loading track:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !track) return;
    
    try {
      await likeTrack(track.id, user.uid);
      await loadTrack(); // Reload to get updated like count
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleComment = async () => {
    if (!user || !track || !newComment.trim()) return;
    
    try {
      await addComment(track.id, user.uid, userProfile?.username || '', newComment);
      setNewComment('');
      await loadTrack(); // Reload to get updated comments
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.message);
    }
  };

  const handleRepost = async () => {
    if (!user || !track) return;
    
    try {
      await repostTrack(user.uid, userProfile?.username || '', track.id, track.userId, track.username);
      alert('Música repostada!');
    } catch (error) {
      console.error('Error reposting track:', error);
      alert('Erro ao repostar música');
    }
  };

  const shareTrack = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <DashboardHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Música não encontrada</h2>
            <p className="text-gray-400">A música que você está procurando não existe ou foi removida.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Track Player */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {track.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-white text-6xl">♪</div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{track.title}</h1>
              <p className="text-xl text-purple-300 mb-4">{track.artist}</p>
              <p className="text-gray-400 mb-6">{track.description}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Play className="mr-2 h-4 w-4" />
                  Reproduzir
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 h-4 w-4 ${track.likedBy?.includes(user?.uid) ? 'fill-red-500 text-red-500' : ''}`} />
                  {track.likes}
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleRepost}
                >
                  <Repeat className="mr-2 h-4 w-4" />
                  Repostar
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={shareTrack}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
              
              <div className="text-gray-400 text-sm">
                <p>{track.plays} reproduções • {track.comments} comentários</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Comentários</h3>
          
          {user && (
            <div className="flex gap-2 mb-6">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Adicionar comentário..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleComment}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-white/20 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold">{comment.username}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(comment.createdAt.toDate()).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Seja o primeiro a comentar nesta música!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrackView;
