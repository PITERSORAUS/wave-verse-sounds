
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header = ({ onLogin, onRegister }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Sound
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                fly
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar músicas, artistas..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-80"
              />
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">
                  Olá, {userProfile?.username || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={onLogin}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={onRegister}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Registrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar músicas, artistas..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="text-white px-4 py-2">
                    Olá, {userProfile?.username || user.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 justify-start"
                    onClick={onLogin}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 justify-start"
                    onClick={onRegister}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Registrar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
