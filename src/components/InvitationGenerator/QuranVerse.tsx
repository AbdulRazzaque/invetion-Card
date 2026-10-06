import React from 'react';

interface QuranVerseProps {
  verse: string;
  reference: string;
  className?: string;
}

export const QuranVerse: React.FC<QuranVerseProps> = ({
  verse,
  reference,
  className = '',
}) => {
  if (!verse && !reference) return null;

  return (
    <div className={`w-full max-w-[340px] mx-auto text-center ${className}`}>
      {/* Decorative Gold Separator */}
      <div className="flex items-center justify-center gap-2 mb-1.5 opacity-60">
        <span className="w-10 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
        <span className="w-1.5 h-1.5 rotate-45 border border-[#B89028]" />
        <span className="w-10 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
      </div>

      {reference && (
        <p className="font-cormorant font-semibold text-[11px] sm:text-[12px] tracking-widest uppercase text-[#94721C] mb-1">
          {reference}
        </p>
      )}

      {verse && (
        <p className="font-cormorant italic text-[11px] sm:text-[12px] leading-[1.45] text-[#554A41] px-2 sm:px-4">
          {verse}
        </p>
      )}

      {/* Decorative Gold Separator bottom */}
      <div className="flex items-center justify-center gap-2 mt-1.5 opacity-60">
        <span className="w-10 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
        <span className="w-1.5 h-1.5 rotate-45 border border-[#B89028]" />
        <span className="w-10 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
      </div>
    </div>
  );
};
