import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoBytes: Uint8Array;
  className?: string;
}

export default function VideoPlayer({ videoBytes, className = '' }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Convert to standard Uint8Array to ensure compatibility
    const standardArray = new Uint8Array(videoBytes);
    const blob = new Blob([standardArray], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setIsLoading(false);

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [videoBytes]);

  if (isLoading || !videoUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      playsInline
      className={`w-full rounded-lg bg-black ${className}`}
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );
}

