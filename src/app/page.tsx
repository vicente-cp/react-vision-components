'use client'

import React from 'react';
import "../styles/globals.css";
import VideoFrameNavigator from '../components/VideoFrameNavigator';
import VideoCard from '../components/VideoCard';

const Home: React.FC = () => {

  return (
    <>
     <section className="flex items-center justify-center min-h-[25%] bg-white px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold mb-4">
          Video Frame Navigator
        </h2>
        <p className="text-xl">
        Interactive video playback, offering standard viewing, scroll-based frame control, and variable speed playback.        </p>
      </div>
    </section>
    
    <VideoCard
          title="People Walking"
          description="This video demonstrates object detection and tracking of people walking in a scene."
          videoSrc="media/videos/people_walking.mp4"
        />



    <section className="flex items-center justify-center min-h-[25%] bg-white px-4 pb-10">
      <VideoFrameNavigator src="media/videos/people_walking.mp4" width="60%" />
    </section> 
    <section className="flex items-center justify-center min-h-[25%] bg-gray-200 px-4 p-10">
      <VideoFrameNavigator src="media/videos/traffic.mp4" width="80%"/>
    </section>

    </>
  );
};

export default Home;