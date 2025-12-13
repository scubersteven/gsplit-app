import React from 'react';

export function WaveDivider() {
  return (
    <div className="relative w-full">
      {/* G Logo - positioned on wave */}
      <img
        src="/glogopro.png"
        alt="G"
        className="absolute z-10 w-[69px] h-[81px] top-[75px] left-[11px] md:w-[90px] md:h-[105px] md:top-[80px] md:left-[40px]"
      />

      {/* Mobile wave */}
      <svg
        className="w-full block md:hidden"
        viewBox="0 0 393 250"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="393" height="250" fill="#FFE7AD"/>
        <path d="M0 130L9.3 126.5C18.7 123 37.3 118 56 118C74.7 118 93.3 122 112 125C130.7 128 149.3 132 168.2 133C187 134 206 134 224.8 132C243.7 130 262.3 126 281 125C299.7 124 318.3 126 337 127C355.7 128 374.3 127 383.7 125L393 123L393 250L0 250Z" fill="#1A1A1A"/>
      </svg>

      {/* Desktop wave */}
      <svg
        className="w-full hidden md:block"
        viewBox="0 0 1440 250"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="1440" height="250" fill="#FFE7AD"/>
        <path d="M0 130L40 126C80 122 160 114 240 118C320 122 400 138 480 142C560 146 640 138 720 130C800 122 880 114 960 118C1040 122 1120 138 1200 142C1280 146 1360 138 1400 134L1440 130L1440 250L0 250Z" fill="#1A1A1A"/>
      </svg>
    </div>
  );
}
