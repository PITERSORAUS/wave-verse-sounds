import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Music, User, Repeat } from "lucide-react";
import { getPublicTracks } from '@/services/trackService';
import { getUserReposts } from '@/services/repostService';
import { useAuth } from '@/hooks/useAuth';

interface FeedItem {
  id: string;
  type: 'track' | 'repost' | 'like' | 'comment';
  user: string;
  action: string;
  track?: string;
  time: string;
  timestamp: number;
}

const FeedActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedActivity = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get recent public tracks with a simpler query that doesn't require a composite index
        const recentTracks = await getPublicTracks(10);
        
        const feedItems: FeedItem[] = [];
        
        // Add track posts to feed
        recentTracks.forEach(track => {
          const timeAgo = getTimeAgo(track.createdAt.toDate());
          feedItems.push({
            id: `track-${track.id}`,
            type: 'track',
            user: track.username,
            action: 'postou uma nova música',
            track: track.title,
            time: timeAgo,
            timestamp: track.createdAt.toDate().getTime()
          });
        });
        
        // Sort by timestamp (most recent first)
        feedItems.sort((a, b) => b.timestamp - a.timestamp);
        
        setActivities(feedItems.slice(0, 20)); // Show last 20 activities
      } catch (error) {
        console.error('Error loading feed activity:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedActivity();
  }, [user]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'track':
        return <Music className="h-5 w-5 text-blue-400" />;
      case 'repost':
        return <Repeat className="h-5 w-5 text-green-400" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-purple-400" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Seu feed está vazio</h3>
          <p className="text-gray-400">
            Siga alguns artistas ou faça upload de suas próprias músicas para ver atividades aqui!
          </p>
        </Card>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-4 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getActivityIcon(activity.type)}
                  <p className="text-white">
                    <span className="font-semibold">{activity.user}</span>
                    <span className="text-gray-300"> {activity.action} </span>
                    {activity.track && (
                      <span className="font-semibold text-purple-300">{activity.track}</span>
                    )}
                  </p>
                </div>
                <p className="text-gray-400 text-sm">{activity.time}</p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export default FeedActivity