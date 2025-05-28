
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Music, User } from "lucide-react";

const FeedActivity = () => {
  // Mock data - will be replaced with real Firebase data
  const activities = [
    {
      id: 1,
      type: 'new_track',
      user: 'João Silva',
      action: 'postou uma nova música',
      track: 'Midnight Vibes',
      time: '2 horas atrás',
      avatar: null
    },
    {
      id: 2,
      type: 'like',
      user: 'Maria Santos',
      action: 'curtiu',
      track: 'Summer Dreams',
      time: '4 horas atrás',
      avatar: null
    },
    {
      id: 3,
      type: 'comment',
      user: 'Pedro Lima',
      action: 'comentou em',
      track: 'Electronic Waves',
      time: '6 horas atrás',
      avatar: null
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_track':
        return <Music className="h-5 w-5 text-blue-400" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-green-400" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

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
                    <span className="font-semibold text-purple-300">{activity.track}</span>
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
};

export default FeedActivity;
