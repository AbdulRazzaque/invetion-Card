import React, { useRef } from 'react';
import { Download, Share2, CheckCircle2, Info, AlertTriangle, X, Sparkles } from 'lucide-react';
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
    toast,
    setToast,
    downloadCard,
    shareCard,
    handleWhatsApp,
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
              className="text-[#968677] hover:text-[#382B20] p-1 rounded"
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
            Create Your Personalized Invitation
          </h1>
          
          <p className="font-sans text-[13px] sm:text-[14.5px] text-[#6E5F52] mt-1.5 max-w-xl">
            Enter your guest's name and create a beautiful luxury invitation ready to share.
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] font-sans font-medium text-[#8C6D27] bg-[#F7EFE1] px-3 py-1 rounded-full border border-[#DFC48A]/40">
            <span>✨ 100% Client-Side Private Generator</span>
            <span>•</span>
            <span>Ultra HD Download</span>
          </div>
        </div>
      </header>

      {/* ==================================================
          MAIN CONTENT WORKSPACE
          Desktop: 2-column (Left: Editor, Right: Preview)
          Mobile: Preview first, Editor below
      ================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN ON DESKTOP / BOTTOM ON MOBILE: EDITOR */}
          <section className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5 space-y-6">
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

          {/* RIGHT COLUMN ON DESKTOP / TOP ON MOBILE: PREVIEW */}
          <section className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:sticky lg:top-6">
            <InvitationPreview
              data={data}
              cardRef={cardRef}
              isExporting={isExporting}
            />
          </section>

        </div>
      </main>

      {/* ==================================================
          STICKY BOTTOM BAR FOR MOBILE SCREENS
      ================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#DFC48A]/60 p-3 shadow-lg flex items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-white bg-gradient-to-r from-[#8A6725] to-[#A88235] shadow-sm disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Saving...' : 'Download PNG'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing || isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-[#423214] bg-[#F7F0DE] border border-[#D5C299] shadow-sm disabled:opacity-60"
        >
          <Share2 className="w-4 h-4 text-[#8A6725]" />
          <span>Share</span>
        </button>
      </div>

    </div>
  );
};
