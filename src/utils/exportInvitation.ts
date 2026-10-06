import { toPng, toBlob } from 'html-to-image';

export interface ExportOptions {
  pixelRatio?: number;
  quality?: number;
}

export const generateFilename = (guestName?: string): string => {
  if (!guestName || !guestName.trim()) {
    return 'wedding-invitation.png';
  }
  const sanitized = guestName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `wedding-invitation-${sanitized || 'guest'}.png`;
};

export const exportInvitationAsPng = async (
  element: HTMLElement,
  guestName?: string,
  options: ExportOptions = { pixelRatio: 2.5, quality: 0.98 }
): Promise<string> => {
  // Wait for web fonts to finish loading for perfect typography
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // Brief pause for any image or reflow settling
  await new Promise((resolve) => setTimeout(resolve, 150));

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: options.pixelRatio || 2.5,
    quality: options.quality || 0.98,
    style: {
      transform: 'none',
      margin: '0',
    },
  });

  const filename = generateFilename(guestName);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();

  return dataUrl;
};

export const getInvitationBlob = async (
  element: HTMLElement,
  options: ExportOptions = { pixelRatio: 2, quality: 0.95 }
): Promise<Blob | null> => {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));

  return await toBlob(element, {
    cacheBust: true,
    pixelRatio: options.pixelRatio || 2,
    quality: options.quality || 0.95,
  });
};
