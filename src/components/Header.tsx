import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="navbar bg-white shadow-md sticky top-0 z-50">
      <div className="navbar-start  pl-[10vw]">
        <Link href="/" className="flex items-center">
          <img src="vialcorpus.svg" alt="Company Logo" className="h-8 w-auto mr-2" />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/detections" className="px-7 py-2 text-gray-600 hover:text-blue-500 transition duration-300">Detections</Link>
          </li>
          <li>
            <Link href="/keypoints" className="px-7 py-2 text-gray-600 hover:text-black-500 transition duration-300">Keypoints</Link>
          </li>
          <li>
            <Link href="/segmentation" className="px-7 py-2 text-gray-600 hover:text-black-500 transition duration-300">Segmentation</Link>
          </li>
          <li>
            <Link href="/optical_flow" className="px-7 py-2 text-gray-600 hover:text-black-500 transition duration-300">Optical Flow</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end  pr-[10vw]">
        <Link href="/login" className="btn btn-primary ">
          Log In
        </Link>
      </div>
    </header>
  );
};

export default Header;