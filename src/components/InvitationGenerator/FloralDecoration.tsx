import React from 'react';

interface FloralDecorationProps {
  className?: string;
}

export const FloralDecoration: React.FC<FloralDecorationProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {/* Soft Pastel Watercolor Wash Clouds matching the reference card */}
      <div
        className="absolute -top-12 -left-12 w-80 h-80 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(246, 218, 203, 0.75) 0%, rgba(240, 225, 235, 0.4) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute -top-10 -right-10 w-80 h-80 rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220, 214, 238, 0.7) 0%, rgba(206, 226, 230, 0.4) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute -bottom-12 -left-10 w-80 h-80 rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212, 228, 215, 0.65) 0%, rgba(226, 218, 236, 0.45) 50%, transparent 75%)',
        }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-84 h-84 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(248, 219, 210, 0.75) 0%, rgba(242, 228, 210, 0.45) 50%, transparent 75%)',
        }}
      />

      {/* Top-Left Floral Bouquet */}
      <div className="absolute -top-6 -left-6 w-52 sm:w-60 md:w-64 aspect-square mix-blend-multiply opacity-95 transition-opacity duration-300">
        <img
          src="/assets/floral-top-left.jpg"
          alt="Watercolor Floral Top Left"
          className="w-full h-full object-contain filter contrast-[1.03]"
          loading="eager"
        />
      </div>

      {/* Top-Right Floral Bouquet (Mirrored horizontally for balanced framing) */}
      <div className="absolute -top-6 -right-6 w-52 sm:w-60 md:w-64 aspect-square mix-blend-multiply opacity-95 transform scale-x-[-1] transition-opacity duration-300">
        <img
          src="/assets/floral-top-left.jpg"
          alt="Watercolor Floral Top Right"
          className="w-full h-full object-contain filter contrast-[1.03]"
          loading="eager"
        />
      </div>

      {/* Bottom-Left Floral Bouquet (Mirrored horizontally) */}
      <div className="absolute -bottom-6 -left-6 w-52 sm:w-60 md:w-64 aspect-square mix-blend-multiply opacity-95 transform scale-x-[-1] transition-opacity duration-300">
        <img
          src="/assets/floral-bottom-right.jpg"
          alt="Watercolor Floral Bottom Left"
          className="w-full h-full object-contain filter contrast-[1.03]"
          loading="eager"
        />
      </div>

      {/* Bottom-Right Floral Bouquet */}
      <div className="absolute -bottom-6 -right-6 w-52 sm:w-60 md:w-64 aspect-square mix-blend-multiply opacity-95 transition-opacity duration-300">
        <img
          src="/assets/floral-bottom-right.jpg"
          alt="Watercolor Floral Bottom Right"
          className="w-full h-full object-contain filter contrast-[1.03]"
          loading="eager"
        />
      </div>

      {/* Center Soft Parchment Radiance ensuring pristine text legibility */}
      <div
        className="absolute inset-[15%] rounded-3xl pointer-events-none opacity-85"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(254, 252, 248, 0.95) 0%, rgba(254, 252, 248, 0.75) 65%, transparent 100%)',
        }}
      />
    </div>
  );
};
