import React, { useRef } from 'react';
import {
  Copy,
  Check,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { useInvitation } from '../../hooks/useInvitation';
import { useImageExport } from '../../hooks/useImageExport';
import { InvitationEditor } from './InvitationEditor';
import { InvitationPreview } from './InvitationPreview';

export const InvitationGenerator: React.FC = () => {
  const { data, updateField, resetToDefault, hasChanges } = useInvitation();
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    isExporting,
    isSharing,
    copyingCardId,
    copiedCardId,
    cardErrorMessage,
    toast,
    setToast,
    copyIndividualCard,
    downloadIndividualCard,
    downloadCard,
    shareCard,
    handleWhatsApp,
    handleWhatsAppDirect,
    handleCopy,
    handlePrint,
    triggerCelebration,
  } = useImageExport();

  const handleDownload = () => {
    downloadCard(cardRef.current, data.guestName);
  };

  const handleShare = () => {
    shareCard(cardRef.current, data);
  };

  const handleGenerate = () => {
    triggerCelebration();
    // Smooth scroll to preview on mobile
    if (window.innerWidth < 1024 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#2C241E]">
      
      {/* ==================================================
          TOAST NOTIFICATION (Elegant subtle toast)
      ================================================== */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="bg-[#FAF7F1] border border-[#DFC48A] shadow-xl rounded-xl p-4 flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#967B38]" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="font-cormorant font-bold text-base text-[#382B20]">{toast.title}</h4>
              <p className="text-[12px] text-[#6E6053] leading-relaxed">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-[#968677] hover:text-[#382B20] p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          TOP LUXURY HEADER / HERO SECTION
      ================================================== */}
      <header className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 text-center border-b border-[#E8DEC9]/60 bg-gradient-to-b from-[#FCFAF6] to-[#F8F5EF]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Subtle gold crest flourish */}
          <div className="flex items-center justify-center gap-2 mb-2 opacity-80">
            <span className="w-12 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
            <Sparkles className="w-4 h-4 text-[#B89028]" />
            <span className="w-12 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
          </div>

          <h1 className="font-cormorant font-bold text-2xl sm:text-3xl md:text-4xl text-[#34281E] tracking-wide">
            Wedding Invitation Suite & Generator
          </h1>
          
          <p className="font-sans text-[13px] sm:text-[14.5px] text-[#6E5F52] mt-1.5 max-w-xl">
            Type your guest's name below to personalize all 3 invitation cards, then copy or share each card independently.
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] font-sans font-medium text-[#8C6D27] bg-[#F7EFE1] px-3 py-1 rounded-full border border-[#DFC48A]/40 flex-wrap justify-center">
            <span>✨ Real-Time Guest Personalization</span>
            <span>•</span>
            <span>📋 Independent One-Click Copy Per Card</span>
            <span>•</span>
            <span>Ultra HD PNG</span>
          </div>
        </div>
      </header>

      {/* ==================================================
          MAIN CONTENT WORKSPACE
          Desktop: 2-column (Left: Editor, Right: Preview)
          Mobile: Preview first, Editor below
      ================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN ON DESKTOP / BOTTOM ON MOBILE: EDITOR */}
          <section className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5 space-y-6">
            <InvitationEditor
              data={data}
              updateField={updateField}
              hasChanges={hasChanges}
              onReset={resetToDefault}
              onGenerate={handleGenerate}
              isExporting={isExporting}
              isSharing={isSharing}
              onDownload={handleDownload}
              onShare={handleShare}
              onWhatsApp={() => handleWhatsApp(data)}
              onCopy={() => handleCopy(data)}
              onPrint={handlePrint}
            />
          </section>

          {/* RIGHT COLUMN ON DESKTOP / TOP ON MOBILE: 3 INDEPENDENT CARDS PREVIEW */}
          <section className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 flex flex-col items-center lg:sticky lg:top-6">
            <InvitationPreview
              data={data}
              cardRef={cardRef}
              isExporting={isExporting}
              copyingCardId={copyingCardId}
              copiedCardId={copiedCardId}
              cardErrorMessage={cardErrorMessage}
              onCopyCard={(cardId) => copyIndividualCard(cardId, data)}
              onDownloadCard={(cardId) => downloadIndividualCard(cardId, data)}
              onWhatsAppDirect={handleWhatsAppDirect}
            />
          </section>

        </div>
      </main>

      {/* ==================================================
          STICKY BOTTOM BAR FOR MOBILE SCREENS
      ================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#DFC48A]/60 p-2.5 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={() => copyIndividualCard(1, data)}
          disabled={copyingCardId === 1}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-sans font-medium text-[12.5px] text-white bg-gradient-to-r from-[#8A6725] to-[#A88235] shadow-sm disabled:opacity-60 cursor-pointer active:scale-[0.98]"
        >
          {copyingCardId === 1 ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Copying...</span>
            </>
          ) : copiedCardId === 1 ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>✓ Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white" />
              <span>📋 Card 1</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => copyIndividualCard(2, data)}
          disabled={copyingCardId === 2}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-sans font-medium text-[12.5px] text-white bg-gradient-to-r from-[#8A6725] to-[#A88235] shadow-sm disabled:opacity-60 cursor-pointer active:scale-[0.98]"
        >
          {copyingCardId === 2 ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Copying...</span>
            </>
          ) : copiedCardId === 2 ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>✓ Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white" />
              <span>📋 Card 2</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => copyIndividualCard(3, data)}
          disabled={copyingCardId === 3}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-sans font-medium text-[12.5px] text-white bg-gradient-to-r from-[#8A6725] to-[#A88235] shadow-sm disabled:opacity-60 cursor-pointer active:scale-[0.98]"
        >
          {copyingCardId === 3 ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Copying...</span>
            </>
          ) : copiedCardId === 3 ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>✓ Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white" />
              <span>📋 Card 3</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppDirect}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-sans font-medium text-[12.5px] text-[#1E5E3A] bg-[#E9F6EE] border border-[#BDE0CB] shadow-sm cursor-pointer active:scale-[0.98]"
          title="Open WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </button>
      </div>

    </div>
  );
};
