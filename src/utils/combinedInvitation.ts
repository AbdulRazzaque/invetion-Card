/**
 * Utility for combining all 3 invitation cards into a single vertical high-resolution PNG
 * and copying/downloading it.
 */

export const INVITATION_CARD_URLS = [
  '/invitations/card-1.jpg',
  '/invitations/card-2.jpg',
  '/invitations/card-3.jpg',
];

export interface CombineCardsOptions {
  targetWidth?: number;
  gap?: number;
  backgroundColor?: string;
}

/**
 * Combines 3 invitation card images into a single high-resolution vertical PNG Blob.
 * Preserves the exact aspect ratio of each card without distortion or cropping.
 */
export const combineThreeInvitationCards = async (
  imageUrls: string[] = INVITATION_CARD_URLS,
  options: CombineCardsOptions = {}
): Promise<Blob> => {
  const { targetWidth = 1200, gap = 20, backgroundColor = '#FAF7F2' } = options;

  // Load all images in parallel
  const loadedImages = await Promise.all(
    imageUrls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image from: ${url}`));
          img.src = url;
        })
    )
  );

  // Calculate scaled dimensions strictly preserving each image's native aspect ratio
  const dimensions = loadedImages.map((img) => {
    const scale = targetWidth / img.naturalWidth;
    const height = Math.round(img.naturalHeight * scale);
    return { width: targetWidth, height };
  });

  const totalHeight =
    dimensions.reduce((acc, curr) => acc + curr.height, 0) +
    gap * (loadedImages.length - 1);

  // Create canvas for high-quality composition
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Smooth rendering settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, targetWidth, totalHeight);

  // Draw each card image vertically with consistent spacing
  let currentY = 0;
  for (let i = 0; i < loadedImages.length; i++) {
    const img = loadedImages[i];
    const { width, height } = dimensions[i];
    ctx.drawImage(img, 0, currentY, width, height);
    currentY += height + gap;
  }

  // Export as PNG Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob from canvas'));
        }
      },
      'image/png',
      1.0
    );
  });
};

/**
 * Copies a PNG Blob directly to the system clipboard using the standard Clipboard API.
 * Throws an error if clipboard permissions or browser support are not available.
 */
export const copyImageBlobToClipboard = async (blob: Blob): Promise<void> => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard ||
    !navigator.clipboard.write ||
    typeof ClipboardItem === 'undefined'
  ) {
    throw new Error('Clipboard API with image support is not available in this browser.');
  }

  const clipboardItem = new ClipboardItem({
    'image/png': blob,
  });

  await navigator.clipboard.write([clipboardItem]);
};

/**
 * Downloads a combined image blob as a PNG file.
 */
export const downloadCombinedImageBlob = (
  blob: Blob,
  filename = 'wedding-invitation-combined-3pages.png'
): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Opens WhatsApp safely on mobile or desktop web without pretending to auto-attach files.
 */
export const openWhatsAppDirectly = (): void => {
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const url = isMobile
    ? 'https://api.whatsapp.com/send'
    : 'https://web.whatsapp.com';

  window.open(url, '_blank', 'noopener,noreferrer');
};
