import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  file: File | null;
  isAnalyzing: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMediaUrl(null);
    }
  }, [file]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!file || !mediaUrl) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Media Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No media selected</p>
        </CardContent>
      </Card>
    );
  }

  const isVideo = file.type.startsWith('video/');

  return (
    <Card className={isAnalyzing ? 'animate-pulse-glow' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Media Preview</span>
          {isVideo && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                disabled={isAnalyzing}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={restart}
                disabled={isAnalyzing}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-auto max-h-96 object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls={false}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          )}
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-background/90 rounded-lg p-4 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Analyzing frames...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>File: {file.name}</span>
            <span>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};