
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Send, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { getConversations, getConversation, sendMessage } from '@/services/messageService';

const Messages = () => {
  const navigate = useNavigate();
  const { userId: chatUserId } = useParams();
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (chatUserId && user) {
      loadConversation(chatUserId);
    }
  }, [chatUserId, user]);

  const loadConversations = async () => {
    try {
      const convs = await getConversations(user.uid);
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (userId: string) => {
    try {
      const messages = await getConversation(user.uid, userId);
      setCurrentConversation(messages);
      
      // Find user info from conversations
      const userInfo = conversations.find(conv => conv.userId === userId);
      setSelectedUser(userInfo);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatUserId) return;

    try {
      await sendMessage(
        user.uid,
        userProfile?.username || '',
        chatUserId,
        selectedUser?.username || '',
        newMessage
      );
      
      setNewMessage('');
      await loadConversation(chatUserId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp.toDate()).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Mensagens</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full">
              <div className="p-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">Conversas</h2>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                {conversations.map((conv) => (
                  <Button
                    key={conv.userId}
                    variant="ghost"
                    className={`w-full justify-start p-3 h-auto ${
                      chatUserId === conv.userId ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                    onClick={() => navigate(`/messages/${conv.userId}`)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{conv.username}</div>
                        <div className="text-gray-400 text-sm truncate">
                          {conv.lastMessage}
                        </div>
                      </div>
                      {conv.unread && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  </Button>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p>Nenhuma conversa ainda</p>
                    <p className="text-sm mt-2">
                      Vá para Amigos para começar uma conversa
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex flex-col">
              {chatUserId && selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedUser.username}
                      </h2>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {currentConversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.fromUserId === user.uid ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromUserId === user.uid
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/20">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <p>Selecione uma conversa para começar</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
