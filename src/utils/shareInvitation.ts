import { InvitationData } from '../types/invitation';
import { getInvitationBlob, generateFilename } from './exportInvitation';

export const buildInvitationMessage = (data: InvitationData): string => {
  const recipient = data.familyMode
    ? (data.guestName.trim() || 'Respected Family')
    : `${data.guestTitle && data.guestTitle !== 'None' ? data.guestTitle + ' ' : ''}${data.guestName.trim() || 'Honored Guest'}`;

  return `Assalamu Alaikum wa Rahmatullahi wa Barakatuh,

Dear ${recipient},

You are cordially invited to attend the ${data.eventTitle || 'Reception Ceremony'} of:
✨ ${data.groomName} & ${data.brideName} ✨

📅 Date: ${data.date}
⏰ Time: ${data.time}
🕌 Islamic Date: ${data.islamicDate}
📍 Venue: ${data.venue}

We would be deeply honored by your gracious presence and heartfelt prayers.

Compliments from:
${data.familyMessage} ${data.familySurname}

(Personalized invitation card attached)`;
};

export interface ShareResult {
  success: boolean;
  sharedFiles?: boolean;
  message?: string;
}

export const shareInvitationNative = async (
  element: HTMLElement | null,
  data: InvitationData
): Promise<ShareResult> => {
  const shareText = buildInvitationMessage(data);
  const title = `Wedding Invitation - ${data.groomName} & ${data.brideName}`;

  if (!navigator.share) {
    return {
      success: false,
      message: 'Native Web Share is not supported on this browser.',
    };
  }

  // Try file sharing if element exists
  if (element && navigator.canShare) {
    try {
      const blob = await getInvitationBlob(element);
      if (blob) {
        const filename = generateFilename(data.guestName);
        const file = new File([blob], filename, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text: `You are cordially invited to attend the Reception Ceremony of ${data.groomName} & ${data.brideName}.`,
            files: [file],
          });
          return { success: true, sharedFiles: true };
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, message: 'Share was dismissed.' };
      }
      console.warn('File share attempt failed, trying text fallback', err);
    }
  }

  // Fallback to text sharing
  try {
    await navigator.share({
      title,
      text: shareText,
    });
    return { success: true, sharedFiles: false };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, message: 'Share was dismissed.' };
    }
    return {
      success: false,
      message: 'Could not complete native sharing.',
    };
  }
};

export const shareViaWhatsApp = (data: InvitationData): void => {
  const text = encodeURIComponent(buildInvitationMessage(data));
  const url = `https://api.whatsapp.com/send?text=${text}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const copyInvitationText = async (data: InvitationData): Promise<boolean> => {
  const text = buildInvitationMessage(data);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
};
