import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles } from 'lucide-react';
import { InvitationData } from '../../types/invitation';
import { InvitationCard } from './InvitationCard';

interface InvitationPreviewProps {
  data: InvitationData;
  cardRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  data,
  cardRef,
  isExporting,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.7, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleFitToScreen = () => {
    if (window.innerWidth < 640) {
      setZoomLevel(0.85);
    } else {
      setZoomLevel(1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Preview Header & Controls */}
      <div className="w-full max-w-[540px] flex items-center justify-between pb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89028] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89028]"></span>
          </span>
          <h2 className="font-cormorant font-bold text-[18px] sm:text-[20px] text-[#3E342B] tracking-wide flex items-center gap-1.5">
            Live Preview
          </h2>
          <span className="hidden sm:inline-flex text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#FAF0DD] text-[#8C6D27] border border-[#DFC48A]/50">
            5:7 Portrait
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[#FAF6EE] border border-[#E8DFC9] rounded-lg p-0.5 shadow-sm">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            disabled={zoomLevel <= 0.7}
            className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors disabled:opacity-40"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[12px] font-sans font-medium text-[#6B5A4B] px-1.5 min-w-[42px] text-center select-none">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            disabled={zoomLevel >= 1.3}
            className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors disabled:opacity-40"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-3.5 bg-[#D8CEB9] mx-0.5" />

          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom (100%)"
            className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFitToScreen}
            title="Fit to Screen"
            className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Card Viewport Container */}
      <div className="w-full flex justify-center items-center overflow-x-auto py-2 px-1">
        <div
          className="transition-transform duration-200 ease-out origin-top flex justify-center w-full max-w-[540px]"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          <InvitationCard
            ref={cardRef}
            data={data}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Subtle reassurance note */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-[#7A6B5D] font-sans">
        <Sparkles className="w-3.5 h-3.5 text-[#B89028]" />
        <span>Ready for ultra HD print (1080×1512) and mobile WhatsApp sharing</span>
      </div>
    </div>
  );
};
