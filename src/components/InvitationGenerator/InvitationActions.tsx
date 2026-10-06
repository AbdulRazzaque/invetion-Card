import React, { useState } from 'react';
import {
  Download,
  Share2,
  MessageCircle,
  Copy,
  Printer,
  RotateCcw,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { InvitationData } from '../../types/invitation';

interface InvitationActionsProps {
  data: InvitationData;
  isExporting: boolean;
  isSharing: boolean;
  hasChanges: boolean;
  onDownload: () => void;
  onShare: () => void;
  onWhatsApp: () => void;
  onCopy: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export const InvitationActions: React.FC<InvitationActionsProps> = ({
  isExporting,
  isSharing,
  hasChanges,
  onDownload,
  onShare,
  onWhatsApp,
  onCopy,
  onPrint,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Primary Actions: Download & Share */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={isExporting}
          className="relative group overflow-hidden flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-sans font-medium text-[14px] sm:text-[15px] text-white bg-gradient-to-r from-[#8A6725] via-[#A88235] to-[#8A6725] hover:from-[#78571B] hover:to-[#78571B] shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 active:scale-[0.99]"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FDF8EE]" />
              <span>Rendering HD Image...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#FDF8EE] group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Invitation (PNG)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onShare}
          disabled={isSharing || isExporting}
          className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-sans font-medium text-[14px] sm:text-[15px] text-[#423214] bg-[#F7F0DE] hover:bg-[#EFE5CD] border border-[#D5C299] shadow-sm hover:shadow transition-all duration-300 disabled:opacity-70 active:scale-[0.99]"
        >
          {isSharing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#8A6725]" />
              <span>Preparing Share...</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#8A6725]" />
              <span>Share Invitation</span>
            </>
          )}
        </button>
      </div>

      {/* Secondary Actions: WhatsApp, Copy Message, Print, Reset */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={onWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-[#1E5E3A] bg-[#E9F6EE] hover:bg-[#DCF0E3] border border-[#BDE0CB] transition-colors"
          title="Share via WhatsApp with pre-filled message"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </button>

        {/* Copy Message */}
        <button
          type="button"
          onClick={handleCopyClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-[#4D4135] bg-[#F8F5EE] hover:bg-[#EFEAE0] border border-[#E0D7C5] transition-colors"
          title="Copy invitation message text"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#8A6725]" />
              <span>Copy Text</span>
            </>
          )}
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-[#4D4135] bg-[#F8F5EE] hover:bg-[#EFEAE0] border border-[#E0D7C5] transition-colors"
          title="Print invitation card"
        >
          <Printer className="w-4 h-4 text-[#8A6725]" />
          <span>Print Card</span>
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={() => {
            if (hasChanges) {
              setShowResetConfirm(true);
            } else {
              onReset();
            }
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-[#6B5A4B] hover:text-[#9B3D3D] bg-[#F8F5EE] hover:bg-[#FBEBEB] border border-[#E0D7C5] transition-colors"
          title="Reset to default details"
        >
          <RotateCcw className="w-4 h-4 text-[#8A6725]" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] rounded-2xl p-6 max-w-sm w-full border border-[#DFC48A] shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF0DD] text-[#8C6D27] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-cormorant font-bold text-xl text-[#332A22]">Reset All Details?</h3>
              <p className="text-[13px] text-[#6E6155] leading-relaxed">
                This will reset the guest name and all customized event details back to the default invitation template.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#594C41] bg-[#ECE5D8] hover:bg-[#E0D7C5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[#9B3D3D] hover:bg-[#832E2E] transition-colors shadow-sm"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
