import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { exportInvitationAsPng, getInvitationBlob } from '../utils/exportInvitation';
import { shareInvitationNative, shareViaWhatsApp, copyInvitationText } from '../utils/shareInvitation';
import {
  generateIndividualCardBlob,
  copyCardBlobToClipboard,
  downloadCardBlob,
  formatGuestDisplayName,
  CardGuestNameCustomization,
} from '../utils/individualCardExport';
import { openWhatsAppDirectly } from '../utils/combinedInvitation';
import { InvitationData } from '../types/invitation';

export interface ToastMessage {
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

export const useImageExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Independent card copy/download states (1, 2, or 3)
  const [copyingCardId, setCopyingCardId] = useState<number | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<number | null>(null);
  const [cardErrorMessage, setCardErrorMessage] = useState<{ [key: number]: string | null }>({
    1: null,
    2: null,
    3: null,
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
      setToast({ title, message, type });
      setTimeout(() => {
        setToast((current) => (current?.title === title ? null : current));
      }, 5000);
    },
    []
  );

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#EBD8B8', '#D49B9B', '#9EAF9B', '#FCFBF8'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  /**
   * Copies ONLY the selected invitation card (1, 2, or 3) with dynamic guest name to clipboard.
   */
  const copyIndividualCard = useCallback(
    async (
      cardId: 1 | 2 | 3,
      data: InvitationData,
      customization?: CardGuestNameCustomization
    ) => {
      try {
        setCopyingCardId(cardId);
        setCardErrorMessage((prev) => ({ ...prev, [cardId]: null }));

        let blob: Blob | null = null;
        if (cardId === 2 && !customization?.hasCustomPosition) {
          const cardElement = document.getElementById('wedding-invitation-card');
          if (cardElement) {
            blob = await getInvitationBlob(cardElement, { pixelRatio: 2.5, quality: 0.98 });
          }
        }

        if (!blob) {
          blob = await generateIndividualCardBlob(cardId, {
            guestName: data.guestName,
            guestTitle: data.guestTitle,
            familyMode: data.familyMode,
            customization,
          });
        }

        await copyCardBlobToClipboard(blob);

        setCopiedCardId(cardId);
        triggerCelebration();
        showToast(
          '✓ Image Copied',
          `Invitation ${cardId} copied! Open WhatsApp and paste (Ctrl+V) directly into your chat.`,
          'success'
        );

        // Revert clicked button back to idle after 2 seconds
        setTimeout(() => {
          setCopiedCardId((current) => (current === cardId ? null : current));
        }, 2000);
      } catch (err) {
        console.error(`Error copying card ${cardId}:`, err);
        const errMsg =
          'Unable to copy the image automatically. Please use Download Image and share it manually.';
        setCardErrorMessage((prev) => ({ ...prev, [cardId]: errMsg }));
        showToast('Clipboard Notice', errMsg, 'error');
      } finally {
        setCopyingCardId(null);
      }
    },
    [showToast, triggerCelebration]
  );

  /**
   * Downloads ONLY the selected invitation card (1, 2, or 3) as a PNG.
   */
  const downloadIndividualCard = useCallback(
    async (
      cardId: 1 | 2 | 3,
      data: InvitationData,
      customization?: CardGuestNameCustomization
    ) => {
      try {
        let blob: Blob | null = null;
        if (cardId === 2 && !customization?.hasCustomPosition) {
          const cardElement = document.getElementById('wedding-invitation-card');
          if (cardElement) {
            blob = await getInvitationBlob(cardElement, { pixelRatio: 2.5, quality: 0.98 });
          }
        }

        if (!blob) {
          blob = await generateIndividualCardBlob(cardId, {
            guestName: data.guestName,
            guestTitle: data.guestTitle,
            familyMode: data.familyMode,
            customization,
          });
        }

        const namePart = formatGuestDisplayName(data.guestName, data.guestTitle, data.familyMode)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const filename = `wedding-invitation-card-${cardId}-${namePart || 'guest'}.png`;
        downloadCardBlob(blob, filename);

        triggerCelebration();
        showToast('Invitation Saved', `Invitation ${cardId} downloaded successfully.`, 'success');
      } catch (err) {
        console.error(`Error downloading card ${cardId}:`, err);
        showToast('Download Issue', `Unable to download card ${cardId}. Please try again.`, 'error');
      }
    },
    [showToast, triggerCelebration]
  );

  const handleWhatsApp = useCallback(
    (data: InvitationData) => {
      shareViaWhatsApp(data);
      showToast(
        'WhatsApp Opened',
        'Pre-filled invitation message ready! Make sure to attach the invitation image.',
        'info'
      );
    },
    [showToast]
  );

  const handleWhatsAppDirect = useCallback(() => {
    openWhatsAppDirectly();
    showToast(
      'WhatsApp Opened',
      'Open your chat and press Ctrl+V (or long press and tap Paste) to share the copied card.',
      'info'
    );
  }, [showToast]);

  const handleCopy = useCallback(
    async (data: InvitationData) => {
      const ok = await copyInvitationText(data);
      if (ok) {
        showToast('Message Copied', 'Invitation text copied to clipboard, ready to paste!');
      } else {
        showToast('Copy Failed', 'Please select and copy manually.', 'error');
      }
    },
    [showToast]
  );

  const downloadCard = useCallback(
    async (element: HTMLElement | null, guestName?: string) => {
      if (!element) return;
      try {
        setIsExporting(true);
        await exportInvitationAsPng(element, guestName, { pixelRatio: 2.5, quality: 0.98 });
        triggerCelebration();
        showToast(
          'Invitation Ready & Saved',
          'Your personalized invitation card has been exported in ultra-high resolution.'
        );
      } catch (error) {
        console.error('Export failed', error);
        showToast('Export Issue', 'Unable to generate image. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
    },
    [showToast, triggerCelebration]
  );

  const shareCard = useCallback(
    async (element: HTMLElement | null, data: InvitationData) => {
      try {
        setIsSharing(true);
        const result = await shareInvitationNative(element, data);
        if (result.success) {
          showToast(
            'Invitation Shared',
            result.sharedFiles
              ? 'Shared with personalized invitation image!'
              : 'Invitation details shared successfully.'
          );
        } else if (result.message && result.message !== 'Share was dismissed.') {
          showToast('Sharing Note', result.message, 'info');
        }
      } catch (error) {
        console.error('Share error', error);
        showToast('Share Notice', 'Sharing could not be completed on this device.', 'info');
      } finally {
        setIsSharing(false);
      }
    },
    [showToast]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
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
  };
};
