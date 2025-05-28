
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Play, Pause, MoreHorizontal, Eye } from "lucide-react";
import WaveformVisualizer from "./WaveformVisualizer";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  likes: number;
  views: number;
  comments: number;
  cover: string;
  isPublic: boolean;
}

interface MusicCardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
}

const MusicCard = ({ track, isPlaying, onPlay }: MusicCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Album Cover */}
          <div className="relative flex-shrink-0">
            <img 
              src={track.cover} 
              alt={track.title}
              className="w-20 h-20 rounded-lg object-cover shadow-lg"
            />
            <Button
              size="sm"
              onClick={onPlay}
              className="absolute inset-0 bg-black/50 hover:bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Track Info and Waveform */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white truncate">{track.title}</h3>
                <p className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">
                  {track.artist}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{track.duration}</span>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Waveform */}
            <div className="mb-4">
              <WaveformVisualizer isPlaying={isPlaying} />
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(track.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{formatNumber(track.likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{track.comments}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`${isLiked ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'} transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MusicCard;
