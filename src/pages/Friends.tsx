
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserPlus, MessageCircle, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest } from '@/services/friendService';
import { searchUsers } from '@/services/userService';

const Friends = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFriendsData();
    }
  }, [user]);

  const loadFriendsData = async () => {
    try {
      setLoading(true);
      const [friendsData, requestsData] = await Promise.all([
        getFriends(user.uid),
        getFriendRequests(user.uid)
      ]);
      setFriends(friendsData);
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Error loading friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const results = await searchUsers(searchTerm);
      // Filter out current user and existing friends
      const filteredResults = results.filter(result => 
        result.id !== user.uid && 
        !friends.some(friend => friend.id === result.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSendFriendRequest = async (toUserId: string, toUsername: string) => {
    try {
      await sendFriendRequest(user.uid, userProfile?.username || '', toUserId, toUsername);
      alert('Solicitação de amizade enviada!');
      setSearchResults(prev => prev.filter(result => result.id !== toUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Erro ao enviar solicitação de amizade');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      await loadFriendsData();
      alert('Solicitação aceita!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Erro ao aceitar solicitação');
    }
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
          <h1 className="text-3xl font-bold text-white">Amigos</h1>
          <p className="text-gray-300 mt-2">Conecte-se com outros usuários</p>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="friends" className="text-white">
              Meus Amigos ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-white">
              Solicitações ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="search" className="text-white">Buscar Usuários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">{friend.username}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    >
                      Ver Perfil
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => navigate(`/messages/${friend.id}`)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {friends.length === 0 && !loading && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum amigo ainda</h3>
                <p className="text-gray-400">
                  Busque por usuários para adicionar seus primeiros amigos!
                </p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <Card key={request.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{request.fromUsername}</h3>
                        <p className="text-gray-400 text-sm">Enviou uma solicitação de amizade</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-green-700"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Aceitar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Recusar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {friendRequests.length === 0 && !loading && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhuma solicitação</h3>
                <p className="text-gray-400">
                  Você não tem solicitações de amizade pendentes.
                </p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="search" className="mt-6">
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Buscar
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((user) => (
                <Card key={user.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">{user.username}</h3>
                    {user.displayName && user.displayName !== user.username && (
                      <p className="text-gray-400 text-sm">{user.displayName}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      Ver Perfil
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => handleSendFriendRequest(user.id, user.username)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;
