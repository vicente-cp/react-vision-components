'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import "../../styles/slider.css"

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
  const controlsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [isProgressBarHovered, setIsProgressBarHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    };

    const intervalId = setInterval(updateProgress, 5); // Increased frequency (5ms interval)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsContainerHovered(true);
    };

    const handleMouseLeave = () => {
      setIsContainerHovered(false);
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

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsProgressBarHovered(true);
      animationRef.current = window.requestAnimationFrame(animateProgressBar);
    };

    const handleMouseLeave = () => {
      setIsProgressBarHovered(false);
      if (!isDragging && animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const progressBarElement = progressBarRef.current;
    if (progressBarElement) {
      progressBarElement.addEventListener('mouseenter', handleMouseEnter);
      progressBarElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (progressBarElement) {
        progressBarElement.removeEventListener('mouseenter', handleMouseEnter);
        progressBarElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isDragging]);

  const animateProgressBar = (timestamp: number) => {
    const startTime = animationRef.current || timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / 1000, 1); // Limit progress to 1 second
    const height = 4 + (8 - 4) * progress; // Interpolate height from 4px to 8px
    const top = 8 - height; // Adjust top position to grow towards the top

    const progressBarElement = progressBarRef.current;
    if (progressBarElement) {
      progressBarElement.style.height = `${height}px`;
      progressBarElement.style.top = `${top}px`;
    }

    if (progress < 1 && (isProgressBarHovered || isDragging)) {
      animationRef.current = window.requestAnimationFrame(animateProgressBar);
    } else {
      animationRef.current = null;
    }
  };

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

  const handleProgressChange = (value: number) => {
    if (videoRef.current) {
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

  const renderTrack = (props: any, state: any) => {
    const played = (progress / duration) * 100;
    const unplayed = 100 - played;
    const progressBarHeight = isProgressBarHovered || isDragging ? 8 : 4;
  
    return (
      <div
        className="progress-track relative"
        style={{
          background: `linear-gradient(to right, #820000 0%, #820000 ${played}%, rgba(0, 0, 0, 0.5) ${played}%, rgba(0, 0, 0, 0.5) 100%)`,
          height: `${progressBarHeight}px`,
          transition: 'height .3s ease',
          position: 'absolute',
          top: isProgressBarHovered || isDragging ? 0 : `${4 - progressBarHeight}px`,
          left: 0,
          right: 0,
        }}
      >
        {(isProgressBarHovered || isDragging) && (
          <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full" />
        )}
      </div>
    );
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
    <div className="video-frame-navigator flex justify-center items-center ">
      <div
        ref={containerRef}
        className="video-container relative overflow-hidden shadow-lg "
        style={{ width, height, aspectRatio }}
        onMouseEnter={() => setIsContainerHovered(true)}
        onMouseLeave={() => setIsContainerHovered(false)}
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
  className={`controls absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end transition-opacity duration-300 ${
    isContainerHovered ? 'opacity-100' : isPlaying ? 'opacity-0' : 'opacity-100'
  }`}
>
  <div ref={progressBarRef} className="w-full relative">
    <ReactSlider
      className="progress-bar"
      thumbClassName=""
      renderTrack={renderTrack}
      min={0}
      max={duration}
      value={progress}
      onChange={handleProgressChange}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    />
  </div>
  <div
    className="flex items-center justify-between w-full bg-black bg-opacity-30 px-2 py-1"
  >
            <button className="text-white mr-2" onClick={handlePlayPause}>
              {isPlaying ? (
                <FaPause className="text-base" />
              ) : (
                <FaPlay className="text-base" />
              )}
            </button>
            <button className="text-white mr-2" onClick={handleMute}>
              {isMuted ? (
                <FaVolumeMute className="text-base" />
              ) : (
                <FaVolumeUp className="text-base" />
              )}
            </button>
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button
              className="text-white ml-auto text-sm"
              onClick={handleSpeedChange}
            >
              {speed}x
            </button>
            <button className="text-white ml-2" onClick={handleFullscreen}>
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