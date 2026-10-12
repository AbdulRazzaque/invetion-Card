import React, { useState } from 'react';
import {
  Sliders,
  Type,
  RotateCcw,
  Palette,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import {
  CardGuestNameConfig,
  CardGuestNameCustomization,
} from '../../utils/individualCardExport';

export interface TextControlsPanelProps {
  cardId: 1 | 2 | 3;
  guestDisplayName: string;
  customization: CardGuestNameCustomization;
  defaultConfig: CardGuestNameConfig;
  onChange: (cardId: 1 | 2 | 3, updated: CardGuestNameCustomization) => void;
  onReset: (cardId: 1 | 2 | 3) => void;
  onSelectCard: (cardId: 1 | 2 | 3) => void;
  onDoneEditing: () => void;
}

const COLOR_PRESETS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Rich Black', hex: '#1C1917' },
  { name: 'Luxury Gold', hex: '#D4AF37' },
  { name: 'Metallic Brass', hex: '#E8C87A' },
  { name: 'Royal Navy', hex: '#1B2A4A' },
  { name: 'Warm Bronze', hex: '#6D4E12' },
  { name: 'Champagne', hex: '#F5E6C8' },
  { name: 'Antique Sepia', hex: '#4A361C' },
  { name: 'Emerald', hex: '#1E5E3A' },
];

const CARD_TITLES: Record<1 | 2 | 3, { name: string; badge: string }> = {
  1: { name: 'Invitation 1: Royal Blue Arabic Card', badge: 'Card 1' },
  2: { name: 'Invitation 2: Reception Ceremony Floral Card', badge: 'Card 2' },
  3: { name: 'Invitation 3: English Invitation & Schedule', badge: 'Card 3' },
};

export const TextControlsPanel: React.FC<TextControlsPanelProps> = ({
  cardId,
  guestDisplayName,
  customization,
  defaultConfig,
  onChange,
  onReset,
  onSelectCard,
  onDoneEditing,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hexInput, setHexInput] = useState<string>(
    customization.color || defaultConfig.color
  );

  // Current values (merged from customization or defaultConfig)
  const currentLeft = customization.leftPercent ?? defaultConfig.leftPercent;
  const currentTop = customization.topPercent ?? defaultConfig.topPercent;
  const currentRotation = customization.rotationDeg ?? (defaultConfig.rotationDeg || 0);
  const currentFontSize = customization.baseFontSizePx ?? defaultConfig.baseFontSizePx;
  const currentColor = customization.color ?? defaultConfig.color;

  // Sync hex input when color changes from outside
  React.useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor]);

  // Keep values in valid bounds
  const updateCustomization = (partial: Partial<CardGuestNameCustomization>) => {
    onChange(cardId, {
      ...customization,
      ...partial,
      hasCustomPosition: true,
    });
  };

  // Font size handlers (Range: 8px to 72px)
  const handleFontSizeChange = (val: number) => {
    const clamped = Math.max(8, Math.min(72, Math.round(val)));
    updateCustomization({ baseFontSizePx: clamped });
  };

  // Horizontal position handlers (Range: 3% to 97%)
  const handleLeftChange = (val: number) => {
    const clamped = Math.max(3, Math.min(97, Number(val.toFixed(2))));
    updateCustomization({ leftPercent: clamped });
  };

  // Vertical position handlers (Range: 4% to 96%)
  // "Moving the slider upward should move the text upward; moving it downward should move the text downward."
  // When upwardSliderValue increases, topPercent decreases (text moves UPWARD towards 0%).
  // When upwardSliderValue decreases, topPercent increases (text moves DOWNWARD towards 100%).
  const upwardSliderValue = Number((100 - currentTop).toFixed(1));

  const handleUpwardSliderChange = (upwardVal: number) => {
    const newTop = Math.max(4, Math.min(96, Number((100 - upwardVal).toFixed(2))));
    updateCustomization({ topPercent: newTop });
  };

  const handleNudgeUp = (step = 0.5) => {
    const newTop = Math.max(4, Number((currentTop - step).toFixed(2)));
    updateCustomization({ topPercent: newTop });
  };

  const handleNudgeDown = (step = 0.5) => {
    const newTop = Math.min(96, Number((currentTop + step).toFixed(2)));
    updateCustomization({ topPercent: newTop });
  };

  const handleNudgeLeft = (step = 0.5) => {
    const newLeft = Math.max(3, Number((currentLeft - step).toFixed(2)));
    updateCustomization({ leftPercent: newLeft });
  };

  const handleNudgeRight = (step = 0.5) => {
    const newLeft = Math.min(97, Number((currentLeft + step).toFixed(2)));
    updateCustomization({ leftPercent: newLeft });
  };

  // Rotation handlers (Range: -180° to +180°)
  const handleRotationChange = (val: number) => {
    let normalized = val;
    while (normalized > 180) normalized -= 360;
    while (normalized < -180) normalized += 360;
    updateCustomization({ rotationDeg: Number(normalized.toFixed(1)) });
  };

  // Color handlers
  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    updateCustomization({ color: newColor });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      updateCustomization({ color: val.toUpperCase() });
    }
  };

  return (
    <div
      id="compact-text-controls-panel"
      className="w-full bg-[#FCFAF6] border-2 border-[#2563EB]/40 rounded-2xl shadow-xl overflow-hidden mb-4 transition-all duration-200"
    >
      {/* --------------------------------------------------
          TOP HEADER: STATUS, CARD SWITCHER & ACTIONS
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE]/60 to-[#EFF6FF] px-3.5 py-2.5 border-b border-[#BFDBFE] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-sans font-bold text-[#1E3A8A] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
              Text Controls:
            </span>
            <span className="text-[12px] font-sans font-semibold text-[#1D4ED8] bg-white px-2 py-0.5 rounded-md border border-[#93C5FD]">
              {CARD_TITLES[cardId].badge}
            </span>
            <span className="text-[11.5px] font-sans text-[#475569] hidden md:inline truncate max-w-[220px]">
              {guestDisplayName ? `"${guestDisplayName}"` : 'Guest Name'}
            </span>
          </div>
        </div>

        {/* Card Switcher Pills */}
        <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-lg border border-[#BFDBFE] text-[11px] font-sans">
          <button
            type="button"
            onClick={() => onSelectCard(1)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
              cardId === 1
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#1E3A8A] hover:bg-[#EFF6FF]'
            }`}
            title="Switch to Card 1 (Arabic)"
          >
            Card 1
          </button>
          <button
            type="button"
            onClick={() => onSelectCard(2)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
              cardId === 2
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#1E3A8A] hover:bg-[#EFF6FF]'
            }`}
            title="Switch to Card 2 (Floral)"
          >
            Card 2
          </button>
          <button
            type="button"
            onClick={() => onSelectCard(3)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
              cardId === 3
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#1E3A8A] hover:bg-[#EFF6FF]'
            }`}
            title="Switch to Card 3 (English & Schedule)"
          >
            Card 3
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Reset button */}
          <button
            type="button"
            onClick={() => onReset(cardId)}
            className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#475569] hover:text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
            title="Reset this card's text to default calibrated alignment"
          >
            <RotateCcw className="w-3 h-3 text-[#2563EB]" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Collapse/Expand button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#1E3A8A] hover:text-[#1D4ED8] bg-white hover:bg-blue-50 border border-[#BFDBFE] px-2 py-1 rounded-md transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Controls Panel' : 'Collapse Controls Panel'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            )}
          </button>

          {/* Done Editing button */}
          <button
            type="button"
            onClick={onDoneEditing}
            className="flex items-center gap-1 text-[11px] font-sans font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-2.5 py-1 rounded-md shadow-xs transition-colors cursor-pointer"
            title="Deselect text element"
          >
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Done</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          COLLAPSED SUMMARY VIEW (WHEN MINIMIZED)
      -------------------------------------------------- */}
      {isCollapsed && (
        <div className="px-4 py-2 bg-[#F8FAFC] flex items-center justify-between text-[12px] font-sans text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span>Size: <strong>{currentFontSize}px</strong></span>
            <span>Position: <strong>X {currentLeft.toFixed(1)}% / Y {currentTop.toFixed(1)}%</strong></span>
            <span>Angle: <strong>{currentRotation}°</strong></span>
            <span className="flex items-center gap-1">
              Color:
              <span
                className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block align-middle"
                style={{ backgroundColor: currentColor }}
              />
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="text-[#2563EB] hover:underline font-medium text-[11.5px] cursor-pointer"
          >
            Edit Sliders →
          </button>
        </div>
      )}

      {/* --------------------------------------------------
          FULL SLIDERS & CONTROLS (WHEN EXPANDED)
      -------------------------------------------------- */}
      {!isCollapsed && (
        <div className="p-3 sm:p-4 bg-[#FCFAF6] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">

          {/* ==================================================
              COLUMN 1: FONT SIZE & TEXT COLOR
          ================================================== */}
          <div className="flex flex-col gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs">
            {/* A. Font Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
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

              {/* Native range slider */}
              <input
                type="range"
                min={8}
                max={72}
                step={1}
                value={currentFontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                aria-label="Font size in pixels"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />

              {/* Quick Font Size Presets */}
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
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

            {/* E. Text Color Selector */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
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
                  {/* Native HTML5 Color Picker Trigger */}
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

              {/* Color Presets Palette */}
              <div className="grid grid-cols-5 gap-1.5 mt-1">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleColorChange(preset.hex)}
                    className={`flex items-center gap-1 p-1 rounded border text-[10px] font-sans transition-all cursor-pointer ${
                      currentColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'border-[#2563EB] ring-1 ring-[#2563EB] bg-blue-50/50'
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

          {/* ==================================================
              COLUMN 2: POSITION (VERTICAL & HORIZONTAL)
          ================================================== */}
          <div className="flex flex-col gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs">
            {/* B. Vertical Position Slider (Upward/Downward) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
                  <ArrowUp className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Vertical Position (Y)</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleNudgeDown(0.5)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] cursor-pointer"
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
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] cursor-pointer"
                    title="Nudge upward (0.5%)"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Slider for Vertical Position:
                  Moving slider upward (towards right label '▲ Up') moves text UPWARD.
                  Moving slider downward (towards left label '▼ Down') moves text DOWNWARD. */}
              <input
                type="range"
                min={4}
                max={96}
                step={0.5}
                value={upwardSliderValue}
                onChange={(e) => handleUpwardSliderChange(Number(e.target.value))}
                aria-label="Vertical position (sliding up moves text upward)"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mt-1">
                <span>▼ Down (Card Bottom)</span>
                <button
                  type="button"
                  onClick={() => updateCustomization({ topPercent: 50.0 })}
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Center Y (50%)
                </button>
                <span>▲ Up (Card Top)</span>
              </div>
            </div>

            {/* D. Horizontal Position Slider (Left/Right) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-sans font-bold text-slate-700 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Horizontal Position (X)</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleNudgeLeft(0.5)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] cursor-pointer"
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
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] cursor-pointer"
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
                aria-label="Horizontal position left to right"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mt-1">
                <span>◀ Left</span>
                <button
                  type="button"
                  onClick={() => updateCustomization({ leftPercent: 50.0 })}
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Center X (50%)
                </button>
                <span>Right ▶</span>
              </div>
            </div>
          </div>

          {/* ==================================================
              COLUMN 3: ROTATION (-180° to +180°)
          ================================================== */}
          <div className="flex flex-col gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-1.5">
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

              {/* Rotation Slider (-180° to +180°) */}
              <input
                type="range"
                min={-180}
                max={180}
                step={0.5}
                value={currentRotation}
                onChange={(e) => handleRotationChange(Number(e.target.value))}
                aria-label="Rotation angle from -180 to 180 degrees"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mt-1">
                <span>-180°</span>
                <span className="text-slate-500 font-mono">0°</span>
                <span>+180°</span>
              </div>

              {/* Quick Rotation Angle Presets */}
              <div className="grid grid-cols-4 gap-1 mt-2">
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

                {/* Card-specific calibrated default tilt */}
                <button
                  type="button"
                  onClick={() => handleRotationChange(defaultConfig.rotationDeg || 0)}
                  className={`py-1 px-1 rounded text-[10.5px] font-mono transition-colors text-center cursor-pointer ${
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

                <button
                  type="button"
                  onClick={() => handleRotationChange(90)}
                  className={`py-1 px-1 rounded text-[10.5px] font-mono transition-colors text-center cursor-pointer ${
                    currentRotation === 90
                      ? 'bg-[#2563EB] text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  90°
                </button>
              </div>
            </div>

            {/* Quick helper tip */}
            <div className="p-2 bg-[#F8FAFC] rounded-lg border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-1.5 mt-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#B89028] shrink-0" />
              <span>Sliders and mouse handles stay 100% synchronized in real-time.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
