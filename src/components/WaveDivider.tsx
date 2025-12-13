import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function WaveDivider() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative w-full">
      {/* G Logo - clickable, links to home */}
      <Link to="/" className="absolute z-10 w-[69px] h-[81px] top-[75px] left-[11px] md:w-[90px] md:h-[105px] md:top-[80px] md:left-[40px]">
        <img
          src="/glogopro.png"
          alt="G"
          className="w-full h-full object-contain hover:scale-110 transition-transform"
        />
      </Link>

      {/* Navigation - positioned in top-right of cream area */}
      <nav className="absolute z-20 top-[20px] right-[16px] md:top-[30px] md:right-[40px] flex items-center gap-2">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
              isActive("/") ? "bg-[hsl(var(--cream-dark))]" : ""
            }`}
          >
            <span className="font-ui font-semibold">Split</span>
          </Button>
        </Link>

        <Link to="/log">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
              isActive("/log") ? "bg-[hsl(var(--cream-dark))]" : ""
            }`}
          >
            <span className="font-ui font-semibold">Pints</span>
          </Button>
        </Link>

        <Link to="/locals">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-[hsl(var(--header-fg))] hover:bg-[hsl(var(--cream-dark))] ${
              isActive("/locals") ? "bg-[hsl(var(--cream-dark))]" : ""
            }`}
          >
            <span className="font-ui font-semibold">Locals</span>
          </Button>
        </Link>
      </nav>

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
