import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface VideoFrameNavigatorProps {
  src: string;
  width?: string;
  height?: string;
  aspectRatio?: string;

}

const VideoFrameNavigator: React.FC<VideoFrameNavigatorProps> = ({
  src,
  width = '100%',
  height = 'auto',
  aspectRatio = '16/9',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const value = videoRef.current.currentTime;
        setProgress(value);
        setCurrentTime(value);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const controlsElement = controlsRef.current;
    if (controlsElement) {
      controlsElement.addEventListener('mouseenter', handleMouseEnter);
      controlsElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (controlsElement) {
        controlsElement.removeEventListener('mouseenter', handleMouseEnter);
        controlsElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = () => {
    if (videoRef.current) {
      const speeds = [0.25, 0.5, 1, 2, 5];
      const currentIndex = speeds.indexOf(speed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      const nextSpeed = speeds[nextIndex];
      videoRef.current.playbackRate = nextSpeed;
      setSpeed(nextSpeed);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const value = parseFloat(event.target.value);
      videoRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="video-frame-navigator flex justify-center items-center">
      <div
        className="video-container relative"
        style={{ width, height, aspectRatio }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onClick={handlePlayPause}
          onEnded={handleVideoEnded}
        />
        <div
          ref={controlsRef}
          className={`controls absolute bottom-0 left-0 right-0 p-2 flex flex-col items-center justify-end transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={progress}
            onChange={handleProgressChange}
            className="w-full mb-2 transition-all duration-200"
            style={{ transition: 'width 0.01s linear' }}
          />
          <div className="flex items-center justify-between w-full">
            <button
              className="bg-white rounded-full p-1 shadow-md transition-all duration-1000"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <FaPause className="text-sm text-gray-800" />
              ) : (
                <FaPlay className="text-sm text-gray-800" />
              )}
            </button>
            <div className="text-white ml-2 text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button
              className="bg-white rounded-full p-1 shadow-md transition-all duration-300 ml-auto text-xs"
              onClick={handleSpeedChange}
              style={{ width: '40px' }}
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFrameNavigator;
