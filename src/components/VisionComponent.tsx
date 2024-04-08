import React from 'react';

const VisionComponent: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <img className="h-48 w-full object-cover md:w-48" src="/path/to/image.jpg" alt="Vision" />
    </div>
  );
};

export default VisionComponent;

