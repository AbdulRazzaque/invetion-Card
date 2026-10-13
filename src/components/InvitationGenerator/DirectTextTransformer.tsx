import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Type, Palette, Check } from 'lucide-react';
import {
  CardGuestNameConfig,
  CardGuestNameCustomization
} from '../../utils/individualCardExport';

export interface DirectTextTransformerProps {
  cardId: 1 | 2 | 3;
  text: string;
  customization: CardGuestNameCustomization;
  defaultConfig: CardGuestNameConfig;
  nativeWidth: number;
  nativeHeight: number;
  onChange: (updated: CardGuestNameCustomization) => void;
  onReset: () => void;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isExporting?: boolean;
}

const COLOR_PRESETS_BY_CARD: Record<1 | 2 | 3, { label: string; value: string }[]> = {
  1: [
    { label: 'White', value: '#FFFFFF' },
    { label: 'Off-White', value: '#FDFBF7' },
    { label: 'Champagne', value: '#F5E6C8' },
    { label: 'Metallic Gold', value: '#E8C87A' },
  ],
  2: [
    { label: 'Antique Sepia', value: '#4A361C' },
    { label: 'Warm Bronze', value: '#6D4E12' },
    { label: 'Rich Gold', value: '#91773E' },
    { label: 'Espresso', value: '#2C2218' },
  ],
  3: [
    { label: 'Royal Navy', value: '#13213F' },
    { label: 'Espresso Bronze', value: '#2B2018' },
    { label: 'Rich Black', value: '#1C1917' },
    { label: 'Antique Sepia', value: '#4A361C' },
  ],
};

export const DirectTextTransformer: React.FC<DirectTextTransformerProps> = ({
  cardId,
  text,
  customization,
  defaultConfig,
  nativeWidth,
  nativeHeight: _nativeHeight,
  onChange,
  onReset,
  isSelected,
  onSelect,
  onDeselect,
  containerRef,
  isExporting = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // Active interaction drag state
  const [activeDrag, setActiveDrag] = useState<
    'move' | 'rotate' | 'resize-corner' | 'resize-edge-w' | 'resize-edge-e' | null
  >(null);

  // Feedback indicators
  const [indicatorText, setIndicatorText] = useState<string | null>(null);
  const [showCenterGuideV, setShowCenterGuideV] = useState(false);
  const [showCenterGuideH, setShowCenterGuideH] = useState(false);

  // Track card container scale factor (display width / native width)
  const [scale, setScale] = useState<number>(1);

  // Color picker dropdown popover state
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  // Measure card container display size
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setScale(rect.width / nativeWidth);
      }
    }
  }, [containerRef, nativeWidth]);

  useEffect(() => {
    updateScale();
    const handleResize = () => updateScale();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScale]);

  // Current values
  const currentLeft = customization.leftPercent ?? defaultConfig.leftPercent;
  const currentTop = customization.topPercent ?? defaultConfig.topPercent;
  const currentRotation = customization.rotationDeg ?? (defaultConfig.rotationDeg || 0);
  const currentFontSize = customization.baseFontSizePx ?? defaultConfig.baseFontSizePx;
  const currentMaxWidth = customization.maxWidthPercent ?? defaultConfig.maxWidthPercent;
  const currentColor = customization.color ?? defaultConfig.color;

  // Display font size scaled to preview pixels
  const displayFontSizePx = Math.max(9, Math.round(currentFontSize * scale));

  // Determine transform origin and translate offset based on card alignment style
  const isLeftAligned = defaultConfig.textAlign === 'left';
  const transformTranslate = isLeftAligned ? 'translate(0, -92%)' : 'translate(-50%, -50%)';
  const transformOrigin = isLeftAligned ? 'left bottom' : 'center center';

  // --- DRAG TO MOVE ---
  const handlePointerDownMove = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    e.stopPropagation();
    onSelect();

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = currentLeft;
    const startTop = currentTop;

    setActiveDrag('move');

    const handlePointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      let newLeft = startLeft + (deltaX / containerRect.width) * 100;
      let newTop = startTop + (deltaY / containerRect.height) * 100;

      // Card boundary clamping
      newLeft = Math.max(3, Math.min(97, newLeft));
      newTop = Math.max(4, Math.min(96, newTop));

      // Snapping to horizontal center (50%)
      let snappedH = false;
      let snappedV = false;

      if (!isLeftAligned && Math.abs(newLeft - 50) < 1.0) {
        newLeft = 50.0;
        snappedV = true;
      }

      // Snapping to vertical center (50%)
      if (Math.abs(newTop - 50) < 1.0) {
        newTop = 50.0;
        snappedH = true;
      }

      setShowCenterGuideV(snappedV);
      setShowCenterGuideH(snappedH);
      setIndicatorText(`X: ${newLeft.toFixed(1)}%  Y: ${newTop.toFixed(1)}%`);

      onChange({
        ...customization,
        leftPercent: Number(newLeft.toFixed(2)),
        topPercent: Number(newTop.toFixed(2)),
        hasCustomPosition: true,
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      setActiveDrag(null);
      setIndicatorText(null);
      setShowCenterGuideV(false);
      setShowCenterGuideH(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // --- DRAG TO ROTATE ---
  const handlePointerDownRotate = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect();

    if (!elementRef.current) return;
    const elRect = elementRef.current.getBoundingClientRect();
    const centerX = elRect.left + elRect.width / 2;
    const centerY = elRect.top + elRect.height / 2;

    setActiveDrag('rotate');

    const handlePointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const dx = moveEvt.clientX - centerX;
      const dy = moveEvt.clientY - centerY;

      // Angle from center of box to current pointer
      let angleRad = Math.atan2(dy, dx);
      let rawAngleDeg = angleRad * (180 / Math.PI) + 90;

      // Normalize to -180 to 180
      while (rawAngleDeg > 180) rawAngleDeg -= 360;
      while (rawAngleDeg < -180) rawAngleDeg += 360;

      let finalAngle = rawAngleDeg;

      // Snapping:
      if (moveEvt.shiftKey) {
        // Shift key: snap to 15-degree steps
        finalAngle = Math.round(finalAngle / 15) * 15;
      } else {
        // Standard snapping to 0, 90, -90, 180, 45, -45
        if (Math.abs(finalAngle - 0) < 2.5) finalAngle = 0;
        else if (Math.abs(finalAngle - 90) < 2.5) finalAngle = 90;
        else if (Math.abs(finalAngle - (-90)) < 2.5) finalAngle = -90;
        else if (Math.abs(finalAngle - 180) < 2.5 || Math.abs(finalAngle - (-180)) < 2.5) finalAngle = 180;
        else if (Math.abs(finalAngle - 45) < 2.0) finalAngle = 45;
        else if (Math.abs(finalAngle - (-45)) < 2.0) finalAngle = -45;
        // Template-specific calibrated slant snaps:
        else if (cardId === 1 && Math.abs(finalAngle - 9.0) < 2.0) finalAngle = 9.0;
        else if (cardId === 3 && Math.abs(finalAngle - (-2.6)) < 2.0) finalAngle = -2.6;
      }

      finalAngle = Number(finalAngle.toFixed(1));
      setIndicatorText(`${finalAngle}°`);

      onChange({
        ...customization,
        rotationDeg: finalAngle,
        hasCustomPosition: true,
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      setActiveDrag(null);
      setIndicatorText(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // --- DRAG TO RESIZE (CORNER HANDLES -> FONT SIZE) ---
  const handlePointerDownCornerResize = (e: React.PointerEvent, _corner: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect();

    if (!elementRef.current) return;
    const elRect = elementRef.current.getBoundingClientRect();
    const centerX = elRect.left + elRect.width / 2;
    const centerY = elRect.top + elRect.height / 2;

    const initialDistance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const startFontSize = currentFontSize;

    setActiveDrag('resize-corner');

    const handlePointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const currentDistance = Math.hypot(moveEvt.clientX - centerX, moveEvt.clientY - centerY);
      if (initialDistance <= 0) return;

      const scaleRatio = currentDistance / initialDistance;
      let newFontSize = Math.round(startFontSize * scaleRatio);

      // Clamp font size to usable bounds
      newFontSize = Math.max(10, Math.min(56, newFontSize));

      setIndicatorText(`Font: ${newFontSize}px`);

      onChange({
        ...customization,
        baseFontSizePx: newFontSize,
        hasCustomPosition: true,
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      setActiveDrag(null);
      setIndicatorText(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // --- DRAG TO RESIZE EDGE (WIDTH) ---
  const handlePointerDownEdgeResize = (e: React.PointerEvent, edge: 'w' | 'e') => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect();

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startWidth = currentMaxWidth;

    setActiveDrag(edge === 'w' ? 'resize-edge-w' : 'resize-edge-e');

    const handlePointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const deltaPx = moveEvt.clientX - startX;
      const deltaPercent = (deltaPx / containerRect.width) * 100;

      let newWidth = edge === 'e' ? startWidth + deltaPercent * 2 : startWidth - deltaPercent * 2;
      newWidth = Math.max(12, Math.min(85, newWidth));

      setIndicatorText(`Width: ${Math.round(newWidth)}%`);

      onChange({
        ...customization,
        maxWidthPercent: Number(newWidth.toFixed(1)),
        hasCustomPosition: true,
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      setActiveDrag(null);
      setIndicatorText(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Keyboard nudging & shortcuts
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      const step = e.shiftKey ? 1.0 : e.altKey ? 0.05 : 0.25;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onChange({
            ...customization,
            leftPercent: Math.max(2, Number((currentLeft - step).toFixed(2))),
            hasCustomPosition: true,
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          onChange({
            ...customization,
            leftPercent: Math.min(98, Number((currentLeft + step).toFixed(2))),
            hasCustomPosition: true,
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          onChange({
            ...customization,
            topPercent: Math.max(3, Number((currentTop - step).toFixed(2))),
            hasCustomPosition: true,
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          onChange({
            ...customization,
            topPercent: Math.min(97, Number((currentTop + step).toFixed(2))),
            hasCustomPosition: true,
          });
          break;
        case 'Escape':
          e.preventDefault();
          onDeselect();
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) return;
          e.preventDefault();
          onReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, currentLeft, currentTop, customization, onChange, onDeselect, onReset]);

  // Color options
  const colorPresets = COLOR_PRESETS_BY_CARD[cardId] || COLOR_PRESETS_BY_CARD[1];

  if (!text) return null;

  return (
    <>
      {/* Alignment Center Guide Lines */}
      {showCenterGuideV && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: '50%',
            width: '1px',
            borderLeft: '1.5px dashed #3B82F6',
            boxShadow: '0 0 4px rgba(59, 130, 246, 0.6)',
          }}
        />
      )}
      {showCenterGuideH && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-30"
          style={{
            top: '50%',
            height: '1px',
            borderTop: '1.5px dashed #3B82F6',
            boxShadow: '0 0 4px rgba(59, 130, 246, 0.6)',
          }}
        />
      )}

      {/* Main Direct-Manipulation Element Container */}
      <div
        ref={elementRef}
        data-testid={`card-${cardId}-text-transformer`}
        data-active-drag={activeDrag || undefined}
        className={`absolute z-20 group transition-shadow select-none ${
          isSelected ? 'cursor-move ring-offset-0' : 'cursor-pointer hover:ring-1 hover:ring-blue-400/60'
        }`}
        style={{
          top: `${currentTop}%`,
          left: `${currentLeft}%`,
          maxWidth: `${currentMaxWidth}%`,
          transform: `${transformTranslate} rotate(${currentRotation}deg)`,
          transformOrigin,
          touchAction: 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerDown={handlePointerDownMove}
      >
        {/* Actual Text Rendered Inside */}
        <div
          className="relative px-2 py-0.5 select-none"
          style={{
            color: currentColor,
            fontFamily: defaultConfig.fontFamily,
            fontWeight: defaultConfig.fontWeight,
            fontSize: `${displayFontSizePx}px`,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            textShadow:
              cardId === 1
                ? '0 1px 2px rgba(0, 0, 0, 0.65)'
                : cardId === 2
                ? 'none'
                : 'none',
          }}
        >
          {text}

          {/* Canva/Figma Thin Blue Selection Outline */}
          {isSelected && !isExporting && (
            <div
              className="absolute -inset-1 border-[1.5px] border-[#2563EB] rounded pointer-events-none"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(255, 255, 255, 0.6), 0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            />
          )}
        </div>

        {/* Selected Interactive Controls: Handles, Rotation Stem & Mini Toolbar */}
        {isSelected && !isExporting && (
          <>
            {/* --- ROTATION STEM & CIRCULAR HANDLE --- */}
            <div
              className="absolute left-1/2 -top-7 -translate-x-1/2 flex flex-col items-center pointer-events-auto"
              style={{ height: '28px' }}
            >
              {/* Circular Rotation Handle */}
              <div
                className="w-4 h-4 bg-white border-2 border-[#2563EB] rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                style={{
                  touchAction: 'none',
                }}
                title="Drag to rotate text (Hold Shift for 15° steps)"
                onPointerDown={handlePointerDownRotate}
              >
                <div className="w-1 h-1 bg-[#2563EB] rounded-full pointer-events-none" />
              </div>

              {/* Connecting Blue Line to Bounding Box */}
              <div className="w-[1.5px] flex-1 bg-[#2563EB]" />
            </div>

            {/* --- 4 CORNER RESIZE HANDLES --- */}
            {/* Top-Left */}
            <div
              className="absolute -top-1.5 -left-1.5 w-6 h-6 flex items-center justify-center cursor-nwse-resize pointer-events-auto -translate-x-1/2 -translate-y-1/2"
              onPointerDown={(e) => handlePointerDownCornerResize(e, 'nw')}
              title="Drag to resize text font size"
            >
              <div className="w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-full shadow-sm hover:scale-125 transition-transform" />
            </div>

            {/* Top-Right */}
            <div
              className="absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center cursor-nesw-resize pointer-events-auto translate-x-1/2 -translate-y-1/2"
              onPointerDown={(e) => handlePointerDownCornerResize(e, 'ne')}
              title="Drag to resize text font size"
            >
              <div className="w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-full shadow-sm hover:scale-125 transition-transform" />
            </div>

            {/* Bottom-Right */}
            <div
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 flex items-center justify-center cursor-nwse-resize pointer-events-auto translate-x-1/2 translate-y-1/2"
              onPointerDown={(e) => handlePointerDownCornerResize(e, 'se')}
              title="Drag to resize text font size"
            >
              <div className="w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-full shadow-sm hover:scale-125 transition-transform" />
            </div>

            {/* Bottom-Left */}
            <div
              className="absolute -bottom-1.5 -left-1.5 w-6 h-6 flex items-center justify-center cursor-nesw-resize pointer-events-auto -translate-x-1/2 translate-y-1/2"
              onPointerDown={(e) => handlePointerDownCornerResize(e, 'sw')}
              title="Drag to resize text font size"
            >
              <div className="w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-full shadow-sm hover:scale-125 transition-transform" />
            </div>

            {/* --- 2 EDGE WIDTH HANDLES --- */}
            {/* Left Edge Handle */}
            <div
              className="absolute top-1/2 -left-1.5 w-5 h-6 flex items-center justify-center cursor-ew-resize pointer-events-auto -translate-x-1/2 -translate-y-1/2"
              onPointerDown={(e) => handlePointerDownEdgeResize(e, 'w')}
              title="Drag to adjust text bounding width"
            >
              <div className="w-1.5 h-3.5 bg-white border border-[#2563EB] rounded-full shadow-sm hover:scale-110 transition-transform" />
            </div>

            {/* Right Edge Handle */}
            <div
              className="absolute top-1/2 -right-1.5 w-5 h-6 flex items-center justify-center cursor-ew-resize pointer-events-auto translate-x-1/2 -translate-y-1/2"
              onPointerDown={(e) => handlePointerDownEdgeResize(e, 'e')}
              title="Drag to adjust text bounding width"
            >
              <div className="w-1.5 h-3.5 bg-white border border-[#2563EB] rounded-full shadow-sm hover:scale-110 transition-transform" />
            </div>

            {/* --- FLOATING CONTEXTUAL INDICATOR BADGE --- */}
            {indicatorText && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 text-white text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow-xl pointer-events-none whitespace-nowrap border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150 z-40">
                {indicatorText}
              </div>
            )}

            {/* --- FLOATING QUICK-ACTION TOOLBAR --- */}
            <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#1E293B]/95 text-white px-2 py-1 rounded-lg shadow-xl border border-slate-700 backdrop-blur-sm pointer-events-auto z-40 select-none animate-in fade-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Font Size Indicator */}
              <div className="flex items-center gap-1 px-1 text-[11px] font-mono text-slate-300">
                <Type className="w-3 h-3 text-blue-400" />
                <span>{currentFontSize}px</span>
              </div>

              {/* Angle Indicator */}
              <div className="text-[11px] font-mono text-slate-300 border-l border-slate-700 pl-1.5">
                <span>{currentRotation}°</span>
              </div>

              {/* Color Swatch Menu Button */}
              <div className="relative border-l border-slate-700 pl-1">
                <button
                  type="button"
                  onClick={() => setColorMenuOpen(!colorMenuOpen)}
                  className="w-5 h-5 rounded-full border border-white/40 shadow-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: currentColor }}
                  title="Choose text color"
                >
                  <Palette className="w-2.5 h-2.5 text-black/70 mix-blend-difference" />
                </button>

                {colorMenuOpen && (
                  <div
                    className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-slate-700 rounded-lg p-1.5 shadow-2xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {colorPresets.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          onChange({ ...customization, color: c.value, hasCustomPosition: true });
                          setColorMenuOpen(false);
                        }}
                        className="w-5 h-5 rounded-full border border-slate-600 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      >
                        {currentColor === c.value && (
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset to Default Button */}
              <button
                type="button"
                onClick={onReset}
                className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors cursor-pointer border-l border-slate-700 ml-0.5"
                title="Reset text position, rotation and size to template defaults"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
