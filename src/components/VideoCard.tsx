// VideoSection.tsx
import React from 'react';
import VideoFrameNavigator from './VideoFrameNavigator';

interface VideoSectionProps {
  title: string;
  description: string;
  videoSrc: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ title, description, videoSrc }) => {
  return (
    <section className="flex items-center justify-center bg-white px-4 py-10">
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-full md:w-[70%]">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-8 md:mb-0">
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-lg">{description}</p>
          </div>
          <div className="w-full md:w-2/3">
            <VideoFrameNavigator src={videoSrc} width="100%" aspectRatio="16/9" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;