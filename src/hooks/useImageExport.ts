import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { exportInvitationAsPng } from '../utils/exportInvitation';
import { shareInvitationNative, shareViaWhatsApp, copyInvitationText } from '../utils/shareInvitation';
import { InvitationData } from '../types/invitation';

export interface ToastMessage {
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

export const useImageExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast((current) => (current?.title === title ? null : current));
    }, 4500);
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#EBD8B8', '#D49B9B', '#9EAF9B', '#FCFBF8'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

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

  const handleWhatsApp = useCallback(
    (data: InvitationData) => {
      shareViaWhatsApp(data);
      showToast(
        'WhatsApp Opened',
        'Pre-filled invitation message ready! Make sure to attach the downloaded invitation image.',
        'info'
      );
    },
    [showToast]
  );

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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
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
  };
};
