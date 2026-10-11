import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { InvitationData } from '../../types/invitation';
import { InvitationCard } from './InvitationCard';
import {
  formatGuestDisplayName,
  GUEST_NAME_CONFIG
} from '../../utils/individualCardExport';

interface InvitationPreviewProps {
  data: InvitationData;
  cardRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
  copyingCardId: number | null;
  copiedCardId: number | null;
  cardErrorMessage: { [key: number]: string | null };
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
  onCopyCard,
  onDownloadCard,
  onWhatsAppDirect,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [previewTab, setPreviewTab] = useState<'three-cards' | 'custom-card'>('three-cards');

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
      <div className="w-full max-w-[620px] flex flex-col gap-2.5 pb-3 px-1 sm:px-2">
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
          className="transition-transform duration-200 ease-out origin-top flex flex-col items-center w-full max-w-[620px]"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          {previewTab === 'three-cards' ? (
            /* ==================================================
               THREE INVITATION PREVIEWS (EACH WITH ITS OWN COPY BUTTON)
            ================================================== */
            <div className="w-full flex flex-col items-center gap-7">

              {/* --------------------------------------------------
                  INVITATION 1: ROYAL BLUE ARABIC CARD
              -------------------------------------------------- */}
              <div
                id="invitation-card-1-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-3 sm:p-5 shadow-luxury flex flex-col items-center"
              >
                {/* Header for Card 1 */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#E8DEC9]/70">
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

                {/* Card 1 Artwork with Dynamic Guest Name rendered directly beside label without overlapping */}
                <div className="w-full relative rounded-xl overflow-hidden border border-[#DFC48A]/60 shadow-md bg-[#1B2A4A] aspect-[1024/558]">
                  <img
                    src="/invitations/card-1.jpg"
                    alt="Invitation 1 - Royal Blue Arabic Card"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    loading="eager"
                  />

                  {/* Dynamic Guest Name Overlay at GUEST_NAME_CONFIG[1] coordinates */}
                  {/* {guestDisplayName && (
                    <div
                      className="absolute pointer-events-none select-none flex items-center justify-center overflow-hidden"
                      style={{
                        top: `${GUEST_NAME_CONFIG[1].topPercent}%`,
                        left: `${GUEST_NAME_CONFIG[1].leftPercent}%`,
                        maxWidth: `${GUEST_NAME_CONFIG[1].maxWidthPercent}%`,
                        transform: `translate(-50%, -50%) rotate(${GUEST_NAME_CONFIG[1].rotationDeg || 0}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <span
                        className="font-cormorant font-semibold select-none whitespace-nowrap text-center tracking-wide"
                        style={{
                          color: GUEST_NAME_CONFIG[1].color,
                          fontSize: GUEST_NAME_CONFIG[1].previewFontSizeRem,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.55)',
                        }}
                      >
                        {guestDisplayName}
                      </span>
                    </div>
                  )} */}

                  {guestDisplayName && (
                    <div
                      className="absolute pointer-events-none select-none flex items-center justify-center"
                      style={{
                        top: `${GUEST_NAME_CONFIG[1].topPercent}%`,
                        left: `${GUEST_NAME_CONFIG[1].leftPercent}%`,
                        width: `${GUEST_NAME_CONFIG[1].maxWidthPercent}%`,
                        transform: `translate(-50%, -50%) rotate(${GUEST_NAME_CONFIG[1].rotationDeg || 0
                          }deg)`,
                        transformOrigin: "center",
                      }}
                    >
                      <span
                        className="font-cormorant font-semibold text-center"
                        style={{
                          color: GUEST_NAME_CONFIG[1].color,
                          fontSize: `clamp(10px, ${GUEST_NAME_CONFIG[1].previewFontSizeRem}rem, 24px)`,
                          lineHeight: 1.2,
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                        }}
                      >
                        {guestDisplayName}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 1 */}
                <div className="w-full mt-4 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Independent Copy Button for Card 1 */}
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


              {/* --------------------------------------------------
                  INVITATION 2: RECEPTION CEREMONY FLORAL CARD
              -------------------------------------------------- */}
              <div
                id="invitation-card-2-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-3 sm:p-5 shadow-luxury flex flex-col items-center"
              >
                {/* Header for Card 2 */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#E8DEC9]/70">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8A6725] text-white flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <h3 className="font-cormorant font-bold text-[18px] text-[#34281E]">
                      Invitation 2 • Reception Ceremony Floral Card
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#8C6D27] uppercase tracking-wider font-semibold bg-[#FAF0DD] px-2 py-0.5 rounded-md border border-[#DFC48A]/40">
                    Reception Program
                  </span>
                </div>

                {/* Card 2 Artwork with Dynamic Guest Name rendered in dedicated area */}
                <div className="w-full relative rounded-xl overflow-hidden border border-[#DFC48A]/60 shadow-md bg-[#FAF7F2] aspect-[460/610]">
                  <img
                    src="/invitations/card-2.jpg"
                    alt="Invitation 2 - Reception Ceremony Floral Card"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    loading="eager"
                  />

                  {/* Dynamic Guest Name Overlay at GUEST_NAME_CONFIG[2] coordinates */}
                  {guestDisplayName && (
                    <div
                      className="absolute pointer-events-none select-none flex items-center justify-center text-center px-1 overflow-hidden"
                      style={{
                        top: `${GUEST_NAME_CONFIG[2].topPercent}%`,
                        left: `${GUEST_NAME_CONFIG[2].leftPercent}%`,
                        maxWidth: `${GUEST_NAME_CONFIG[2].maxWidthPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span
                        className="font-cormorant font-semibold select-none whitespace-nowrap text-center tracking-wide"
                        style={{
                          color: GUEST_NAME_CONFIG[2].color,
                          fontSize: GUEST_NAME_CONFIG[2].previewFontSizeRem,
                        }}
                      >
                        <span
                          style={{
                            color: GUEST_NAME_CONFIG[2].labelColor,
                            fontStyle: 'italic',
                            fontWeight: 500,
                            marginRight: '4px',
                          }}
                        >
                          Guest Name:{' '}
                        </span>
                        {guestDisplayName}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 2 */}
                <div className="w-full mt-4 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Independent Copy Button for Card 2 */}
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


              {/* --------------------------------------------------
                  INVITATION 3: ENGLISH INVITATION & PROGRAMS COASTER
              -------------------------------------------------- */}
              <div
                id="invitation-card-3-container"
                className="w-full bg-[#FCFAF6] border border-[#E8DEC9] rounded-2xl p-3 sm:p-5 shadow-luxury flex flex-col items-center"
              >
                {/* Header for Card 3 */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#E8DEC9]/70">
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

                {/* Card 3 Artwork with Dynamic Guest Name rendered directly on the line */}
                <div className="w-full relative rounded-xl overflow-hidden border border-[#DFC48A]/60 shadow-md bg-[#1B2A4A] aspect-[1024/558]">
                  <img
                    src="/invitations/card-3.jpg"
                    alt="Invitation 3 - English Invitation & Schedule"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    loading="eager"
                  />

                  {/* Dynamic Guest Name Overlay at GUEST_NAME_CONFIG[3] coordinates */}
                  {guestDisplayName && (
                    <div
                      className="absolute pointer-events-none select-none flex items-baseline overflow-hidden"
                      style={{
                        top: `${GUEST_NAME_CONFIG[3].topPercent}%`,
                        left: `${GUEST_NAME_CONFIG[3].leftPercent}%`,
                        maxWidth: `${GUEST_NAME_CONFIG[3].maxWidthPercent}%`,
                        transform: `translate(0, -90%) rotate(${GUEST_NAME_CONFIG[3].rotationDeg || 0}deg)`,
                        transformOrigin: 'left bottom',
                      }}
                    >
                      <span
                        className="font-cormorant font-semibold select-none whitespace-nowrap tracking-wide"
                        style={{
                          color: GUEST_NAME_CONFIG[3].color,
                          fontSize: GUEST_NAME_CONFIG[3].previewFontSizeRem,
                        }}
                      >
                        {guestDisplayName}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS SPECIFICALLY FOR INVITATION 3 */}
                <div className="w-full mt-4 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Independent Copy Button for Card 3 */}
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
