import React, { useState, useEffect } from 'react';
import {
  Type,
  RotateCcw,
  Palette,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  MousePointer,
  Undo2
} from 'lucide-react';
import {
  CardGuestNameConfig,
  CardGuestNameCustomization,
} from '../../utils/individualCardExport';

export interface CardSideControlsProps {
  cardId: 1 | 2 | 3;
  cardTitle: string;
  cardBadge: string;
  guestDisplayName: string;
  customization: CardGuestNameCustomization;
  defaultConfig: CardGuestNameConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onChange: (updated: CardGuestNameCustomization) => void;
  onReset: () => void;
}

const COLOR_PRESETS_BY_CARD: Record<1 | 2 | 3, { name: string; hex: string }[]> = {
  1: [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Luxury Gold', hex: '#D4AF37' },
    { name: 'Metallic Brass', hex: '#E8C87A' },
    { name: 'Champagne', hex: '#F5E6C8' },
    { name: 'Off-White', hex: '#FDFBF7' },
    { name: 'Royal Navy', hex: '#1B2A4A' },
    { name: 'Rich Black', hex: '#1C1917' },
  ],
  2: [
    { name: 'Antique Sepia', hex: '#4A361C' },
    { name: 'Warm Bronze', hex: '#6D4E12' },
    { name: 'Rich Gold', hex: '#91773E' },
    { name: 'Luxury Gold', hex: '#D4AF37' },
    { name: 'Espresso', hex: '#2C2218' },
    { name: 'Emerald', hex: '#1E5E3A' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ],
  3: [
    { name: 'Royal Navy', hex: '#13213F' },
    { name: 'Espresso Bronze', hex: '#2B2018' },
    { name: 'Rich Black', hex: '#1C1917' },
    { name: 'Antique Sepia', hex: '#4A361C' },
    { name: 'Luxury Gold', hex: '#D4AF37' },
    { name: 'Warm Bronze', hex: '#6D4E12' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ],
};

export const CardSideControls: React.FC<CardSideControlsProps> = ({
  cardId,
  cardTitle,
  cardBadge,
  guestDisplayName,
  customization,
  defaultConfig,
  isSelected,
  onSelect,
  onDeselect,
  onChange,
  onReset,
}) => {
  // Current values (merged from customization or defaultConfig)
  const currentLeft = customization.leftPercent ?? defaultConfig.leftPercent;
  const currentTop = customization.topPercent ?? defaultConfig.topPercent;
  const currentRotation = customization.rotationDeg ?? (defaultConfig.rotationDeg || 0);
  const currentFontSize = customization.baseFontSizePx ?? defaultConfig.baseFontSizePx;
  const currentColor = customization.color ?? defaultConfig.color;

  const [hexInput, setHexInput] = useState<string>(currentColor);

  useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor]);

  const update = (partial: Partial<CardGuestNameCustomization>) => {
    // If not selected yet, activate selection on this card
    if (!isSelected) {
      onSelect();
    }
    onChange({
      ...customization,
      ...partial,
      hasCustomPosition: true,
    });
  };

  // Font size handlers (8px to 72px)
  const handleFontSizeChange = (val: number) => {
    const clamped = Math.max(8, Math.min(72, Math.round(val)));
    update({ baseFontSizePx: clamped });
  };

  // Horizontal position handlers (3% to 97%)
  const handleLeftChange = (val: number) => {
    const clamped = Math.max(3, Math.min(97, Number(val.toFixed(2))));
    update({ leftPercent: clamped });
  };

  const handleNudgeLeft = (step = 0.5) => {
    const newLeft = Math.max(3, Number((currentLeft - step).toFixed(2)));
    update({ leftPercent: newLeft });
  };

  const handleNudgeRight = (step = 0.5) => {
    const newLeft = Math.min(97, Number((currentLeft + step).toFixed(2)));
    update({ leftPercent: newLeft });
  };

  // Vertical position handlers (4% to 96%)
  // "Moving the slider upward should move the text upward; moving it downward should move the text downward."
  // When upwardSliderValue increases, topPercent decreases (moves UPWARD towards 0%).
  const upwardSliderValue = Number((100 - currentTop).toFixed(1));

  const handleUpwardSliderChange = (upwardVal: number) => {
    const newTop = Math.max(4, Math.min(96, Number((100 - upwardVal).toFixed(2))));
    update({ topPercent: newTop });
  };

  const handleNudgeUp = (step = 0.5) => {
    const newTop = Math.max(4, Number((currentTop - step).toFixed(2)));
    update({ topPercent: newTop });
  };

  const handleNudgeDown = (step = 0.5) => {
    const newTop = Math.min(96, Number((currentTop + step).toFixed(2)));
    update({ topPercent: newTop });
  };

  // Rotation handlers (-180° to +180°)
  const handleRotationChange = (val: number) => {
    let normalized = val;
    while (normalized > 180) normalized -= 360;
    while (normalized < -180) normalized += 360;
    update({ rotationDeg: Number(normalized.toFixed(1)) });
  };

  // Color handlers
  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    update({ color: newColor });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      update({ color: val.toUpperCase() });
    }
  };

  const colorPresets = COLOR_PRESETS_BY_CARD[cardId] || COLOR_PRESETS_BY_CARD[1];

  return (
    <div
      data-testid={`card-${cardId}-side-controls`}
      className={`w-full bg-[#FFFFFF] rounded-xl border transition-all duration-200 flex flex-col p-3.5 sm:p-4 shadow-sm ${
        isSelected
          ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-gradient-to-b from-[#FAFDFE] to-white'
          : 'border-[#DFC48A]/70 hover:border-[#DFC48A]'
      }`}
    >
      {/* --------------------------------------------------
          PANEL HEADER: TITLE, BADGE, ACTIVE STATUS & RESET
      -------------------------------------------------- */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
              isSelected
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#FAF0DD] text-[#8C6D27] border border-[#DFC48A]/40'
            }`}
          >
            {cardId}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4
                className="font-cormorant font-bold text-[16px] text-[#34281E] leading-tight"
                title={cardTitle}
              >
                Text Controls
              </h4>
              <span className="text-[10px] font-sans font-semibold text-[#8C6D27] bg-[#FAF0DD] px-1.5 py-0.5 rounded border border-[#DFC48A]/40 uppercase tracking-wide">
                {cardBadge}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-500 truncate max-w-[190px]">
              {guestDisplayName || 'Guest Name'}
            </p>
          </div>
        </div>

        {/* Action buttons: Reset & Focus/Done */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
            title="Reset this card's text to default calibrated alignment"
          >
            <Undo2 className="w-3 h-3 text-[#2563EB]" />
            <span>Reset</span>
          </button>

          {isSelected ? (
            <button
              type="button"
              onClick={onDeselect}
              className="flex items-center gap-1 text-[11px] font-sans font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-2.5 py-1 rounded-md shadow-xs transition-colors cursor-pointer"
              title="Deselect text handles"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Done</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Click to select text with blue handles"
            >
              <MousePointer className="w-3 h-3" />
              <span>Select</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Selection Banner */}
      {isSelected && (
        <div className="mb-3 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/60 text-[11.5px] font-sans text-[#1D4ED8] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-medium">Direct Handles Active on Card {cardId}</span>
          </div>
          <span className="text-[10px] text-blue-600 font-mono">Synced</span>
        </div>
      )}

      {/* --------------------------------------------------
          CONTROLS BODY (VERTICALLY ORGANIZED FOR RIGHT COLUMN)
      -------------------------------------------------- */}
      <div className="flex flex-col gap-3.5">

        {/* 1. FONT SIZE SLIDER */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Font Size</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleFontSizeChange(currentFontSize - 1)}
                disabled={currentFontSize <= 8}
                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[12px] font-bold disabled:opacity-40 cursor-pointer"
                title="Decrease font size by 1px"
              >
                -
              </button>
              <span className="text-[12px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 min-w-[46px] text-center">
                {currentFontSize}px
              </span>
              <button
                type="button"
                onClick={() => handleFontSizeChange(currentFontSize + 1)}
                disabled={currentFontSize >= 72}
                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[12px] font-bold disabled:opacity-40 cursor-pointer"
                title="Increase font size by 1px"
              >
                +
              </button>
            </div>
          </div>

          <input
            type="range"
            min={8}
            max={72}
            step={1}
            value={currentFontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            aria-label={`Card ${cardId} font size`}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          />

          {/* Quick Font Size Presets */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-slate-400 font-sans">Presets:</span>
            {[16, 18, 20, 22, 26, 32].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleFontSizeChange(size)}
                className={`px-1.5 py-0.5 rounded text-[10.5px] font-mono transition-colors cursor-pointer ${
                  currentFontSize === size
                    ? 'bg-[#2563EB] text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 2. VERTICAL POSITION (Y) SLIDER */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Vertical Position (Y)</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNudgeDown(0.5)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                title="Nudge downward (0.5%)"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <span className="text-[12px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 min-w-[54px] text-center">
                {currentTop.toFixed(1)}%
              </span>
              <button
                type="button"
                onClick={() => handleNudgeUp(0.5)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                title="Nudge upward (0.5%)"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Slider for Vertical Position:
              Moving slider upward (towards right label '▲ Up') moves text UPWARD on the card.
              Moving slider downward (towards left label '▼ Down') moves text DOWNWARD on the card. */}
          <input
            type="range"
            min={4}
            max={96}
            step={0.5}
            value={upwardSliderValue}
            onChange={(e) => handleUpwardSliderChange(Number(e.target.value))}
            aria-label={`Card ${cardId} vertical position`}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
            <span>▼ Down</span>
            <button
              type="button"
              onClick={() => update({ topPercent: 50.0 })}
              className="text-[#2563EB] hover:underline font-medium"
            >
              Center Y
            </button>
            <span>▲ Up (Card Top)</span>
          </div>
        </div>

        {/* 3. HORIZONTAL POSITION (X) SLIDER */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Horizontal Position (X)</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNudgeLeft(0.5)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                title="Nudge left (0.5%)"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <span className="text-[12px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 min-w-[54px] text-center">
                {currentLeft.toFixed(1)}%
              </span>
              <button
                type="button"
                onClick={() => handleNudgeRight(0.5)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                title="Nudge right (0.5%)"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <input
            type="range"
            min={3}
            max={97}
            step={0.5}
            value={currentLeft}
            onChange={(e) => handleLeftChange(Number(e.target.value))}
            aria-label={`Card ${cardId} horizontal position`}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
            <span>◀ Left</span>
            <button
              type="button"
              onClick={() => update({ leftPercent: 50.0 })}
              className="text-[#2563EB] hover:underline font-medium"
            >
              Center X (50%)
            </button>
            <span>Right ▶</span>
          </div>
        </div>

        {/* 4. ROTATION SLIDER (-180° to +180°) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Rotation Angle</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRotationChange(currentRotation - 1)}
                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] cursor-pointer"
                title="Rotate -1°"
              >
                ↺
              </button>
              <span className="text-[12px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 min-w-[54px] text-center">
                {currentRotation > 0 ? `+${currentRotation}°` : `${currentRotation}°`}
              </span>
              <button
                type="button"
                onClick={() => handleRotationChange(currentRotation + 1)}
                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] cursor-pointer"
                title="Rotate +1°"
              >
                ↻
              </button>
            </div>
          </div>

          <input
            type="range"
            min={-180}
            max={180}
            step={0.5}
            value={currentRotation}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            aria-label={`Card ${cardId} rotation angle`}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          />

          <div className="grid grid-cols-4 gap-1 mt-1">
            <button
              type="button"
              onClick={() => handleRotationChange(0)}
              className={`py-1 px-1 rounded text-[10.5px] font-mono transition-colors text-center cursor-pointer ${
                currentRotation === 0
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Level Horizontal (0°)"
            >
              0° Flat
            </button>

            {/* Default calibrated slant for this specific card */}
            <button
              type="button"
              onClick={() => handleRotationChange(defaultConfig.rotationDeg || 0)}
              className={`py-1 px-1 rounded text-[10.5px] font-mono transition-colors text-center cursor-pointer col-span-2 ${
                currentRotation === (defaultConfig.rotationDeg || 0)
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border border-blue-200 font-semibold'
              }`}
              title={`Calibrated Card Tilt (${defaultConfig.rotationDeg || 0}°)`}
            >
              {defaultConfig.rotationDeg || 0}° Tilt
            </button>

            <button
              type="button"
              onClick={() => handleRotationChange(45)}
              className={`py-1 px-1 rounded text-[10.5px] font-mono transition-colors text-center cursor-pointer ${
                currentRotation === 45
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              +45°
            </button>
          </div>
        </div>

        {/* 5. TEXT COLOR SELECTOR */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Text Color</span>
            </label>
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                style={{ backgroundColor: currentColor }}
              />
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                placeholder="#FFFFFF"
                maxLength={7}
                className="w-18 px-1.5 py-0.5 text-[11px] font-mono uppercase bg-slate-50 border border-slate-200 rounded text-center focus:outline-none focus:border-blue-500"
                title="Enter HEX color code"
              />
              {/* Native color picker button */}
              <label
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden p-0"
                title="Open native color picker"
              >
                <input
                  type="color"
                  value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#FFFFFF'}
                  onChange={(e) => handleColorChange(e.target.value.toUpperCase())}
                  className="opacity-0 w-0 h-0 absolute pointer-events-none"
                />
                <Palette className="w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              </label>
            </div>
          </div>

          {/* Palette Presets */}
          <div className="grid grid-cols-4 gap-1.5 mt-0.5">
            {colorPresets.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => handleColorChange(preset.hex)}
                className={`flex items-center gap-1 p-1 rounded border text-[10px] font-sans transition-all cursor-pointer ${
                  currentColor.toLowerCase() === preset.hex.toLowerCase()
                    ? 'border-[#2563EB] ring-1 ring-[#2563EB] bg-blue-50/50 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                title={`${preset.name} (${preset.hex})`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.hex }}
                />
                <span className="truncate text-slate-600">{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
