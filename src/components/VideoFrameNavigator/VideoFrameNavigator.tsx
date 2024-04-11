'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from 'react-icons/fa';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoFrameCallback = (now: DOMHighResTimeStamp, metadata: VideoFrameMetadata) => {
        setCurrentTime(metadata.mediaTime);
        videoElement.requestVideoFrameCallback(handleVideoFrameCallback);
      };

      videoElement.requestVideoFrameCallback(handleVideoFrameCallback);

      return () => {
        videoElement.cancelVideoFrameCallback(handleVideoFrameCallback);
      };
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsControlsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsControlsVisible(false);
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('mouseenter', handleMouseEnter);
      containerElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('mouseenter', handleMouseEnter);
        containerElement.removeEventListener('mouseleave', handleMouseLeave);
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

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleFullscreen = () => {
    const containerElement = containerRef.current;
    if (containerElement) {
      if (!isFullscreen) {
        if (containerElement.requestFullscreen) {
          containerElement.requestFullscreen();
        } else if (containerElement.webkitRequestFullscreen) {
          containerElement.webkitRequestFullscreen();
        } else if (containerElement.mozRequestFullScreen) {
          containerElement.mozRequestFullScreen();
        } else if (containerElement.msRequestFullscreen) {
          containerElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="video-frame-navigator flex justify-center items-center">
      <div
        ref={containerRef}
        className="video-container relative overflow-hidden shadow-lg"
        style={{ width, height, aspectRatio }}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onClick={handlePlayPause}
          onEnded={handleVideoEnded}
        />
        <div
          className={`controls absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end transition-opacity duration-300 ${
            isControlsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between w-full px-2 py-1">
            <button
              className="text-white mr-2"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <FaPause className="text-base" />
              ) : (
                <FaPlay className="text-base" />
              )}
            </button>
            <button
              className="text-white mr-2"
              onClick={handleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <FaVolumeMute className="text-base" />
              ) : (
                <FaVolumeUp className="text-base" />
              )}
            </button>
            <div className="text-white text-sm font-thin">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button
              className="text-white ml-auto text-sm"
              onClick={handleSpeedChange}
              aria-label="Change playback speed"
            >
              {speed}x
            </button>
            <button
              className="text-white ml-2"
              onClick={handleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <FaCompress className="text-base" />
              ) : (
                <FaExpand className="text-base" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFrameNavigator;