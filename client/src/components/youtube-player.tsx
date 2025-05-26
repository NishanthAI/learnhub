import { useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubePlayer({ videoId, title, onVideoEnd, onProgress }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (containerRef.current && window.YT?.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED && onVideoEnd) {
                onVideoEnd();
              }
            },
          },
        });

        // Progress tracking
        if (onProgress) {
          const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
              const currentTime = playerRef.current.getCurrentTime();
              const duration = playerRef.current.getDuration();
              if (duration > 0) {
                const progress = (currentTime / duration) * 100;
                onProgress(progress);
              }
            }
          }, 1000);

          return () => clearInterval(interval);
        }
      }
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onVideoEnd, onProgress]);

  const handlePrevious = () => {
    // This would be implemented with lesson navigation logic
    console.log("Previous lesson");
  };

  const handleNext = () => {
    // This would be implemented with lesson navigation logic
    console.log("Next lesson");
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden video-container">
        <div ref={containerRef} className="absolute inset-0" />
        {!videoId && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg">{title}</p>
              <p className="text-sm opacity-80">Video not available</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <SkipBack className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            Next
            <SkipForward className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
