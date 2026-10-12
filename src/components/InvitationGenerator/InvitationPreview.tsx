import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Copy,
  Check,
  Loader2,
  MessageCircle,
  Download,
  AlertTriangle,
  Info,
  Layers,
  FileText,
  UserCheck,
} from 'lucide-react';
import { InvitationData } from '../../types/invitation';
import { InvitationCard } from './InvitationCard';
import { DirectTextTransformer } from './DirectTextTransformer';
import { CardSideControls } from './CardSideControls';
import {
  formatGuestDisplayName,
  GUEST_NAME_CONFIG,
  CardGuestNameCustomization,
} from '../../utils/individualCardExport';

interface InvitationPreviewProps {
  data: InvitationData;
  cardRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
  copyingCardId: number | null;
  copiedCardId: number | null;
  cardErrorMessage: { [key: number]: string | null };
  cardCustomizations: Record<1 | 2 | 3, CardGuestNameCustomization>;
  onCardCustomizationChange: (cardId: 1 | 2 | 3, updated: CardGuestNameCustomization) => void;
  onCardCustomizationReset: (cardId: 1 | 2 | 3) => void;
  onCopyCard: (cardId: 1 | 2 | 3) => void;
  onDownloadCard: (cardId: 1 | 2 | 3) => void;
  onWhatsAppDirect: () => void;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  data,
  cardRef,
  isExporting,
  copyingCardId,
  copiedCardId,
  cardErrorMessage,
  cardCustomizations,
  onCardCustomizationChange,
  onCardCustomizationReset,
  onCopyCard,
  onDownloadCard,
  onWhatsAppDirect,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [previewTab, setPreviewTab] = useState<'three-cards' | 'custom-card'>('three-cards');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const card1ContainerRef = useRef<HTMLDivElement>(null);
  const card3ContainerRef = useRef<HTMLDivElement>(null);

  const guestDisplayName = formatGuestDisplayName(
    data.guestName,
    data.guestTitle,
    data.familyMode
  );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.65, Number((prev - 0.1).toFixed(2))));
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
      {/* ==================================================
          PREVIEW HEADER & CONTROLS
      ================================================== */}
      <div className="w-full max-w-6xl flex flex-col gap-2.5 pb-3 px-1 sm:px-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89028] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B89028]"></span>
            </span>
            <h2 className="font-cormorant font-bold text-[20px] sm:text-[22px] text-[#34281E] tracking-wide">
              Invitation Preview
            </h2>
            <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#FAF0DD] text-[#8C6D27] border border-[#DFC48A]/50">
              {previewTab === 'three-cards' ? '3 Individual Cards' : 'Live Card'}
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-[#FAF6EE] border border-[#E8DFC9] rounded-lg p-0.5 shadow-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              disabled={zoomLevel <= 0.65}
              className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors disabled:opacity-40 cursor-pointer"
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
              className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-3.5 bg-[#D8CEB9] mx-0.5" />

            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom (100%)"
              className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleFitToScreen}
              title="Fit to Screen"
              className="p-1.5 text-[#5C4D40] hover:text-[#2C241E] hover:bg-[#F0E8D7] rounded transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guest Name Live Indicator Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#FAF4E6] border border-[#DFC48A]/60 rounded-xl text-[12px] font-sans">
          <div className="flex items-center gap-2 text-[#6D5316]">
            <UserCheck className="w-4 h-4 text-[#8C6D27] shrink-0" />
            <span>Active Guest Name:</span>
            <span className="font-bold text-[#3B2C0D] underline decoration-[#DFC48A] underline-offset-2">
              {guestDisplayName || '(No name entered yet)'}
            </span>
          </div>
          <span className="text-[11px] text-[#8C6D27] hidden sm:inline">
            ✨ Auto-synced to all 3 cards
          </span>
        </div>

        {/* View Switcher: 3 Cards vs Customizable Single Card */}
        <div className="flex items-center gap-1.5 bg-[#F2ECE1] p-1 rounded-xl border border-[#DFC48A]/40 text-[12.5px] font-sans font-medium w-full">
          <button
            type="button"
            onClick={() => setPreviewTab('three-cards')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${previewTab === 'three-cards'
                ? 'bg-white text-[#382B20] shadow-sm font-semibold border border-[#D5C299]/50'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-white/50'
              }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8A6725]" />
            <span>All 3 Cards (Individual Copy)</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('custom-card')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${previewTab === 'custom-card'
                ? 'bg-white text-[#382B20] shadow-sm font-semibold border border-[#D5C299]/50'
                : 'text-[#6E6053] hover:text-[#2C241E] hover:bg-white/50'
              }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#8A6725]" />
            <span>Customizable Card</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          PREVIEW VIEWPORT CONTAINER
      ================================================== */}
      <div className="w-full flex justify-center items-center overflow-x-auto py-2 px-1">
        <div
          className="transition-transform duration-200 ease-out origin-top flex flex-col items-center w-full max-w-6xl"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          {previewTab === 'three-cards' ? (
            /* ==================================================
               THREE INVITATION PREVIEWS (EACH WITH ITS OWN COPY BUTTON & SIDE CONTROLS)
            ================================================== */
            <div className="w-full flex flex-col items-center gap-8">

              {/* Dual-Control Text Editor Banner */}
              <div className="w-full bg-gradient-to-r from-[#F0F7FF] via-[#E6F0FA] to-[#F0F7FF] border border-[#BFDBFE] rounded-xl p-3 px-4 flex items-center justify-between gap-3 shadow-xs text-[12.5px] text-[#1E3A8A] flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                  <span className="font-medium text-[#1E3A8A]">
                    <strong>Dual-Control Designer:</strong> Every card has its own dedicated <strong>Text Controls Panel</strong> on its right side! You can also click, drag, scale with corner handles, and rotate directly on each invitation image.
                  </span>
                </div>
                {selectedElement && (
                  <button
                    type="button"
                    onClick={() => setSelectedElement(null)}
                    className="shrink-0 px-3 py-1 rounded-md text-[11px] bg-white border border-[#93C5FD] text-[#1D4ED8] hover:bg-[#DBEAFE] shadow-xs cursor-pointer font-semibold transition-colors"
                  >
                    Done Editing
                  </button>
                )}
              </div>

              {/* --------------------------------------------------
                  INVITATION 1: ROYAL BLUE ARABIC CARD
              -------------------------------------------------- */}
              <div
                id="invitation-card-1-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 shadow-luxury flex flex-col"
              >
                {/* Header for Card 1 */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E8DEC9]/70">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8A6725] text-white flex items-center justify-center text-[11px] font-bold">
                      1
                    </span>
                    <h3 className="font-cormorant font-bold text-[18px] text-[#34281E]">
                      Invitation 1 • Royal Blue Arabic Card
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#8C6D27] uppercase tracking-wider font-semibold bg-[#FAF0DD] px-2 py-0.5 rounded-md border border-[#DFC48A]/40">
                    Front / Main
                  </span>
                </div>

                {/* 2-Column Responsive Body: Left Image & Actions, Right Controls */}
                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
                  {/* LEFT: Card 1 Artwork & Actions */}
                  <div className="xl:col-span-7 flex flex-col gap-3">
                    <div
                      ref={card1ContainerRef}
                      className="w-full relative rounded-xl overflow-hidden border border-[#DFC48A]/60 shadow-md bg-[#1B2A4A] aspect-[1024/558] cursor-default"
                      onClick={() => setSelectedElement(null)}
                    >
                      <img
                        src="/invitations/card-1.jpg"
                        alt="Invitation 1 - Royal Blue Arabic Card"
                        className="w-full h-full object-cover block select-none pointer-events-none"
                        loading="eager"
                      />

                      {guestDisplayName && (
                        <DirectTextTransformer
                          cardId={1}
                          text={guestDisplayName}
                          customization={cardCustomizations[1]}
                          defaultConfig={GUEST_NAME_CONFIG[1]}
                          nativeWidth={1024}
                          nativeHeight={558}
                          onChange={(updated) => onCardCustomizationChange(1, updated)}
                          onReset={() => onCardCustomizationReset(1)}
                          isSelected={selectedElement === 'card-1-guest'}
                          onSelect={() => setSelectedElement('card-1-guest')}
                          onDeselect={() => setSelectedElement(null)}
                          containerRef={card1ContainerRef}
                          isExporting={isExporting}
                        />
                      )}
                    </div>

                    {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 1 */}
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          id="copy-card-1-btn"
                          onClick={() => onCopyCard(1)}
                          disabled={copyingCardId === 1}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-white bg-gradient-to-r from-[#8A6725] via-[#A88235] to-[#8A6725] hover:from-[#78571B] hover:to-[#78571B] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                        >
                          {copyingCardId === 1 ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>⏳ Copying...</span>
                            </>
                          ) : copiedCardId === 1 ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                              <span className="font-semibold text-emerald-100">✓ Image Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-white" />
                              <span>📋 Copy Image</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onWhatsAppDirect}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#1E5E3A] bg-[#E9F6EE] hover:bg-[#DCF0E3] border border-[#BDE0CB] shadow-sm transition-colors cursor-pointer"
                          title="Open WhatsApp to paste and share Invitation 1"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>💬 WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownloadCard(1)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#423214] bg-[#F7F0DE] hover:bg-[#EFE5CD] border border-[#D5C299] shadow-sm transition-colors cursor-pointer"
                          title="Download Invitation 1 PNG"
                        >
                          <Download className="w-4 h-4 text-[#8A6725]" />
                          <span>⬇ Download Image</span>
                        </button>
                      </div>

                      {cardErrorMessage[1] && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-[12px] text-rose-800 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{cardErrorMessage[1]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Dedicated Text Controls Panel for Card 1 */}
                  <div className="xl:col-span-5 flex flex-col">
                    <CardSideControls
                      cardId={1}
                      cardTitle="Invitation 1 • Royal Blue Arabic Card"
                      cardBadge="Front / Main"
                      guestDisplayName={guestDisplayName}
                      customization={cardCustomizations[1]}
                      defaultConfig={GUEST_NAME_CONFIG[1]}
                      isSelected={selectedElement === 'card-1-guest'}
                      onSelect={() => setSelectedElement('card-1-guest')}
                      onDeselect={() => setSelectedElement(null)}
                      onChange={(updated) => onCardCustomizationChange(1, updated)}
                      onReset={() => onCardCustomizationReset(1)}
                    />
                  </div>
                </div>
              </div>


              {/* --------------------------------------------------
                  INVITATION 2: RECEPTION CEREMONY FLORAL CARD
              -------------------------------------------------- */}
              <div
                id="invitation-card-2-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 shadow-luxury flex flex-col"
              >
                {/* Header for Card 2 */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E8DEC9]/70 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8A6725] text-white flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <h3 className="font-cormorant font-bold text-[18px] text-[#34281E]">
                      Invitation 2 • Reception Ceremony Floral Card
                    </h3>
                  </div>

                  <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#FAF0DD] text-[#8C6D27] border border-[#DFC48A]/50">
                    Customizable Card
                  </span>
                </div>

                {/* 2-Column Responsive Body: Left Customizable Card & Actions, Right Controls */}
                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
                  {/* LEFT: Card 2 Customizable Card & Actions */}
                  <div className="xl:col-span-7 flex flex-col gap-3">
                    <div className="w-full flex justify-center">
                      <InvitationCard
                        ref={cardRef}
                        data={data}
                        customization={cardCustomizations[2]}
                        isSelected={selectedElement === 'card-2-guest'}
                        onSelect={() => setSelectedElement('card-2-guest')}
                        isExporting={isExporting}
                        className="rounded-xl border border-[#DFC48A]/60 shadow-md"
                      />
                    </div>

                    {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 2 */}
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          id="copy-card-2-btn"
                          onClick={() => onCopyCard(2)}
                          disabled={copyingCardId === 2}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-white bg-gradient-to-r from-[#8A6725] via-[#A88235] to-[#8A6725] hover:from-[#78571B] hover:to-[#78571B] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                        >
                          {copyingCardId === 2 ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>⏳ Copying...</span>
                            </>
                          ) : copiedCardId === 2 ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                              <span className="font-semibold text-emerald-100">✓ Image Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-white" />
                              <span>📋 Copy Image</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onWhatsAppDirect}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#1E5E3A] bg-[#E9F6EE] hover:bg-[#DCF0E3] border border-[#BDE0CB] shadow-sm transition-colors cursor-pointer"
                          title="Open WhatsApp to paste and share Invitation 2"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>💬 WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownloadCard(2)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#423214] bg-[#F7F0DE] hover:bg-[#EFE5CD] border border-[#D5C299] shadow-sm transition-colors cursor-pointer"
                          title="Download Invitation 2 PNG"
                        >
                          <Download className="w-4 h-4 text-[#8A6725]" />
                          <span>⬇ Download Image</span>
                        </button>
                      </div>

                      {cardErrorMessage[2] && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-[12px] text-rose-800 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{cardErrorMessage[2]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Dedicated Text Controls Panel for Card 2 */}
                  <div className="xl:col-span-5 flex flex-col">
                    <CardSideControls
                      cardId={2}
                      cardTitle="Invitation 2 • Reception Ceremony Floral Card"
                      cardBadge="Reception Floral"
                      guestDisplayName={guestDisplayName}
                      customization={cardCustomizations[2]}
                      defaultConfig={GUEST_NAME_CONFIG[2]}
                      isSelected={selectedElement === 'card-2-guest'}
                      onSelect={() => setSelectedElement('card-2-guest')}
                      onDeselect={() => setSelectedElement(null)}
                      onChange={(updated) => onCardCustomizationChange(2, updated)}
                      onReset={() => onCardCustomizationReset(2)}
                    />
                  </div>
                </div>
              </div>


              {/* --------------------------------------------------
                  INVITATION 3: ENGLISH INVITATION & PROGRAMS COASTER
              -------------------------------------------------- */}
              <div
                id="invitation-card-3-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 shadow-luxury flex flex-col"
              >
                {/* Header for Card 3 */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E8DEC9]/70">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8A6725] text-white flex items-center justify-center text-[11px] font-bold">
                      3
                    </span>
                    <h3 className="font-cormorant font-bold text-[18px] text-[#34281E]">
                      Invitation 3 • English Invitation & Schedule
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#8C6D27] uppercase tracking-wider font-semibold bg-[#FAF0DD] px-2 py-0.5 rounded-md border border-[#DFC48A]/40">
                    Programs Coaster
                  </span>
                </div>

                {/* 2-Column Responsive Body: Left Image & Actions, Right Controls */}
                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
                  {/* LEFT: Card 3 Artwork & Actions */}
                  <div className="xl:col-span-7 flex flex-col gap-3">
                    <div
                      ref={card3ContainerRef}
                      className="w-full relative rounded-xl overflow-hidden border border-[#DFC48A]/60 shadow-md bg-[#1B2A4A] aspect-[1024/558] cursor-default"
                      onClick={() => setSelectedElement(null)}
                    >
                      <img
                        src="/invitations/card-3.jpg"
                        alt="Invitation 3 - English Invitation & Schedule"
                        className="w-full h-full object-cover block select-none pointer-events-none"
                        loading="eager"
                      />

                      {guestDisplayName && (
                        <DirectTextTransformer
                          cardId={3}
                          text={guestDisplayName}
                          customization={cardCustomizations[3]}
                          defaultConfig={GUEST_NAME_CONFIG[3]}
                          nativeWidth={1024}
                          nativeHeight={558}
                          onChange={(updated) => onCardCustomizationChange(3, updated)}
                          onReset={() => onCardCustomizationReset(3)}
                          isSelected={selectedElement === 'card-3-guest'}
                          onSelect={() => setSelectedElement('card-3-guest')}
                          onDeselect={() => setSelectedElement(null)}
                          containerRef={card3ContainerRef}
                          isExporting={isExporting}
                        />
                      )}
                    </div>

                    {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 3 */}
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          id="copy-card-3-btn"
                          onClick={() => onCopyCard(3)}
                          disabled={copyingCardId === 3}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-white bg-gradient-to-r from-[#8A6725] via-[#A88235] to-[#8A6725] hover:from-[#78571B] hover:to-[#78571B] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                        >
                          {copyingCardId === 3 ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>⏳ Copying...</span>
                            </>
                          ) : copiedCardId === 3 ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                              <span className="font-semibold text-emerald-100">✓ Image Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-white" />
                              <span>📋 Copy Image</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onWhatsAppDirect}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#1E5E3A] bg-[#E9F6EE] hover:bg-[#DCF0E3] border border-[#BDE0CB] shadow-sm transition-colors cursor-pointer"
                          title="Open WhatsApp to paste and share Invitation 3"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>💬 WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownloadCard(3)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl font-sans font-medium text-[13.5px] text-[#423214] bg-[#F7F0DE] hover:bg-[#EFE5CD] border border-[#D5C299] shadow-sm transition-colors cursor-pointer"
                          title="Download Invitation 3 PNG"
                        >
                          <Download className="w-4 h-4 text-[#8A6725]" />
                          <span>⬇ Download Image</span>
                        </button>
                      </div>

                      {cardErrorMessage[3] && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-[12px] text-rose-800 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{cardErrorMessage[3]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Dedicated Text Controls Panel for Card 3 */}
                  <div className="xl:col-span-5 flex flex-col">
                    <CardSideControls
                      cardId={3}
                      cardTitle="Invitation 3 • English Invitation & Schedule"
                      cardBadge="Programs Coaster"
                      guestDisplayName={guestDisplayName}
                      customization={cardCustomizations[3]}
                      defaultConfig={GUEST_NAME_CONFIG[3]}
                      isSelected={selectedElement === 'card-3-guest'}
                      onSelect={() => setSelectedElement('card-3-guest')}
                      onDeselect={() => setSelectedElement(null)}
                      onChange={(updated) => onCardCustomizationChange(3, updated)}
                      onReset={() => onCardCustomizationReset(3)}
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Sharing Workflow Info Card */}
              <div className="w-full bg-[#FAF6EE] border border-[#E8DFC9] rounded-xl p-3 text-[12px] text-[#6B5A4B] leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#B89028] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-[#382B20]">
                    Individual Card WhatsApp Sharing Workflow:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[#5A4D40]">
                    <li>Type the <strong>Guest Name</strong> in the editor.</li>
                    <li>Verify the name appears on the card preview above.</li>
                    <li>Click <strong>Copy Image</strong> under the specific card you wish to share.</li>
                    <li>Open <strong>WhatsApp</strong> and select your chat.</li>
                    <li>Press <strong>Ctrl+V</strong> (or tap Paste) to send that individual card.</li>
                  </ol>
                </div>
              </div>

            </div>
          ) : (
            /* ==================================================
               LIVE CUSTOMIZABLE SINGLE CARD
            ================================================== */
            <div className="w-full flex flex-col items-center">
              <InvitationCard
                ref={cardRef}
                data={data}
                isExporting={isExporting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
