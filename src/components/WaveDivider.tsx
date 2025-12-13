import React from 'react';

export function WaveDivider() {
  return (
    <div className="w-full bg-[#1A1A1A]">
      {/* Mobile wave */}
      <svg
        className="w-full block md:hidden"
        viewBox="0 0 393 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80L9.3 76.5C18.7 73 37.3 68 56 68C74.7 68 93.3 72 112 75C130.7 78 149.3 82 168.2 83C187 84 206 84 224.8 82C243.7 80 262.3 76 281 75C299.7 74 318.3 76 337 77C355.7 78 374.3 77 383.7 75L393 73L393 0L0 0Z"
          fill="#FFE7AD"
        />
      </svg>

      {/* Desktop wave */}
      <svg
        className="w-full hidden md:block"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 68L40 74.3C80 80.7 160 93.3 240 111.5C320 129.7 400 153.3 480 152.8C560 152.3 640 127.7 720 120.5C800 113.3 880 123.7 960 132.8C1040 142 1120 150 1200 146.3C1280 142.7 1360 127.3 1400 119.7L1440 112L1440 0L0 0Z"
          fill="#FFE7AD"
        />
      </svg>
    </div>
  );
}
