
import { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

const WaveformVisualizer = ({ isPlaying }: WaveformVisualizerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  // Generate random waveform data
  const waveformData = Array.from({ length: 100 }, () => Math.random() * 60 + 20);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prev) => (prev + 0.5) % 100);
        setAnimationFrame(requestAnimationFrame(animate));
      };
      setAnimationFrame(requestAnimationFrame(animate));
    } else if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      setAnimationFrame(null);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-16 bg-gray-900/50 rounded-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 64"
        className="absolute inset-0"
      >
        {waveformData.map((height, index) => {
          const x = (index / waveformData.length) * 400;
          const isActive = isPlaying && index <= (currentTime / 100) * waveformData.length;
          
          return (
            <rect
              key={index}
              x={x}
              y={(64 - height) / 2}
              width="3"
              height={height}
              className={`transition-colors duration-200 ${
                isActive 
                  ? 'fill-gradient-to-t from-purple-500 to-pink-500' 
                  : 'fill-gray-500'
              }`}
              style={{
                fill: isActive 
                  ? `url(#gradient-${index})` 
                  : '#6b7280'
              }}
            />
          );
        })}
        
        {/* Gradient definitions */}
        <defs>
          {waveformData.map((_, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          ))}
        </defs>
      </svg>
      
      {/* Progress indicator */}
      {isPlaying && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transition-all duration-100"
          style={{
            left: `${(currentTime / 100) * 100}%`,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
          }}
        />
      )}
    </div>
  );
};

export default WaveformVisualizer;
