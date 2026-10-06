import React from 'react';

interface GoldFrameProps {
  className?: string;
}

export const GoldFrame: React.FC<GoldFrameProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-4 pointer-events-none select-none ${className}`}>
      {/* Outer subtle gold border */}
      <div className="absolute inset-0 border border-[#D4AF37]/50 rounded-[4px]" />

      {/* Inner thin gold border */}
      <div className="absolute inset-[6px] border border-[#C5A059]/40 rounded-[2px]" />

      {/* Ornate Gold Filigree Corners (Top-Left) */}
      <svg
        className="absolute -top-[1px] -left-[1px] w-20 h-20 text-[#B89028] opacity-80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C2 14 14 2 30 2 M2 2 L2 45 M2 2 L45 2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8 L8 35 M8 8 L35 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        {/* Scrollwork flourish */}
        <path
          d="M14 22 C18 16 26 14 32 18 C38 22 36 30 30 32 C22 34 16 26 24 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M22 14 C16 18 14 26 18 32 C22 38 30 36 32 30 C34 22 26 16 20 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="2.5" fill="currentColor" />
        <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.7" />
        <path d="M5 45 C15 40 25 45 35 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M45 5 C40 15 45 25 40 35" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Ornate Gold Filigree Corners (Top-Right) */}
      <svg
        className="absolute -top-[1px] -right-[1px] w-20 h-20 text-[#B89028] opacity-80 transform scale-x-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C2 14 14 2 30 2 M2 2 L2 45 M2 2 L45 2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8 L8 35 M8 8 L35 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <path
          d="M14 22 C18 16 26 14 32 18 C38 22 36 30 30 32 C22 34 16 26 24 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M22 14 C16 18 14 26 18 32 C22 38 30 36 32 30 C34 22 26 16 20 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="2.5" fill="currentColor" />
        <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.7" />
        <path d="M5 45 C15 40 25 45 35 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M45 5 C40 15 45 25 40 35" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Ornate Gold Filigree Corners (Bottom-Left) */}
      <svg
        className="absolute -bottom-[1px] -left-[1px] w-20 h-20 text-[#B89028] opacity-80 transform scale-y-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C2 14 14 2 30 2 M2 2 L2 45 M2 2 L45 2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8 L8 35 M8 8 L35 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <path
          d="M14 22 C18 16 26 14 32 18 C38 22 36 30 30 32 C22 34 16 26 24 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M22 14 C16 18 14 26 18 32 C22 38 30 36 32 30 C34 22 26 16 20 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="2.5" fill="currentColor" />
        <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.7" />
        <path d="M5 45 C15 40 25 45 35 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M45 5 C40 15 45 25 40 35" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Ornate Gold Filigree Corners (Bottom-Right) */}
      <svg
        className="absolute -bottom-[1px] -right-[1px] w-20 h-20 text-[#B89028] opacity-80 transform scale-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C2 14 14 2 30 2 M2 2 L2 45 M2 2 L45 2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8 L8 35 M8 8 L35 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <path
          d="M14 22 C18 16 26 14 32 18 C38 22 36 30 30 32 C22 34 16 26 24 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M22 14 C16 18 14 26 18 32 C22 38 30 36 32 30 C34 22 26 16 20 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="2.5" fill="currentColor" />
        <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.7" />
        <path d="M5 45 C15 40 25 45 35 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M45 5 C40 15 45 25 40 35" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Center top delicate crest detail */}
      <div className="absolute top-[3px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[#B89028]/70">
        <span className="w-6 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2 L14 8 L20 10 L15 14 L16 20 L12 16 L8 20 L9 14 L4 10 L10 8 Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
        <span className="w-6 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
      </div>

      {/* Center bottom delicate crest detail */}
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[#B89028]/70">
        <span className="w-6 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 22 L14 16 L20 14 L15 10 L16 4 L12 8 L8 4 L9 10 L4 14 L10 16 Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
        <span className="w-6 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
      </div>
    </div>
  );
};
