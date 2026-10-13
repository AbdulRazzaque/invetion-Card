/**
 * High-resolution canvas rendering and clipboard/download export for individual invitation cards.
 * Uses a single source of truth configuration (GUEST_NAME_CONFIG) for both preview and export.
 */

export interface CardGuestNameConfig {
  topPercent: number;
  leftPercent: number;
  maxWidthPercent: number;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: string;
  fontWeight: number;
  color: string;
  rotationDeg?: number;
  baseFontSizePx: number;
  previewFontSizeRem: string;
  hasLabel?: boolean;
  labelPrefix?: string;
  labelColor?: string;
}

/**
 * Dedicated positioning and styling configuration for each template card.
 * Uses relative percentages for seamless responsive scaling across desktop, mobile, and export.
 */
export const GUEST_NAME_CONFIG: Record<1 | 2 | 3, CardGuestNameConfig> = {
  1: {
    // Card 1: Royal Blue Arabic Card (1024 x 558)
    // Placed beside "اسم الضيف الكريم :" across the dotted line area
    topPercent: 33.5, // Calibrated default Y position
    leftPercent: 45.3, // Calibrated default X position
    maxWidthPercent: 26.0,
    textAlign: 'center',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 600,
    color: '#F5E6C8', // Calibrated default Champagne color
    rotationDeg: -10.0, // Calibrated default tilt angle (-10°)
    baseFontSizePx: 23.0, // Calibrated default font size (23px)
    previewFontSizeRem: 'clamp(0.75rem, 1.9vw, 1.1rem)',
  },
  2: {
    // Card 2: Reception Ceremony Floral Card (460 x 610 / 2x: 920 x 1220)
    // Placed in the dedicated blank whitespace between "With the blessings of Allah Almighty" and "You are cordially invited..."
    topPercent: 38.20, // 233 / 610 * 100 (466 / 1220 * 100)
    leftPercent: 50.0, // Centered
    maxWidthPercent: 65.0,
    textAlign: 'center',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 600,
    color: '#4A361C', // Rich antique sepia / bronze
    rotationDeg: 0,
    baseFontSizePx: 22,
    previewFontSizeRem: 'clamp(0.85rem, 2vw, 1.1rem)',
    hasLabel: true,
    labelPrefix: 'Guest Name: ',
    labelColor: '#91773E',
  },
  3: {
    // Card 3: Royal Blue English Invitation & Programs (1024 x 558)
    // Sitting directly on the printed baseline underline right after "Guest Name: "
    topPercent: 30.7, // Calibrated default Y position (30.7%)
    leftPercent: 34.6, // Calibrated default X position (34.6%)
    maxWidthPercent: 26.0,
    textAlign: 'left',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 600,
    color: '#13213F', // Calibrated default deep royal navy color (#13213F)
    rotationDeg: -4.8, // Calibrated default tilt angle (-4.8°)
    baseFontSizePx: 18.0, // Calibrated default font size (18px)
    previewFontSizeRem: 'clamp(0.65rem, 1.6vw, 0.9rem)',
  },
};

export interface CardGuestNameCustomization {
  topPercent?: number;
  leftPercent?: number;
  maxWidthPercent?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  rotationDeg?: number;
  baseFontSizePx?: number;
  hasCustomPosition?: boolean;
}

export interface ExportCardOptions {
  guestName?: string;
  guestTitle?: string;
  familyMode?: boolean;
  customization?: CardGuestNameCustomization;
}

export const formatGuestDisplayName = (
  guestName = '',
  guestTitle = '',
  familyMode = false
): string => {
  const trimmed = guestName.trim();
  if (!trimmed) return '';

  if (familyMode) {
    return trimmed.toLowerCase().includes('family') ? trimmed : `${trimmed} Family`;
  }

  // If user already typed an honorific/title in the name input (e.g., "Mr.", "Mrs.", "Dr.", "Mr. & Mrs.")
  const hasExistingTitle = /^(mr\.|mrs\.|ms\.|miss|dr\.|prof\.|shaikh|shaykh|janab|engr\.|mr\s*&\s*mrs\.?)/i.test(
    trimmed
  );

  if (hasExistingTitle) {
    return trimmed;
  }

  if (guestTitle && guestTitle !== 'None') {
    // Avoid repeating if the name starts with the selected guestTitle
    if (trimmed.toLowerCase().startsWith(guestTitle.toLowerCase())) {
      return trimmed;
    }
    return `${guestTitle} ${trimmed}`;
  }

  return trimmed;
};

/**
 * Loads an image with CORS handling.
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Generates an Ultra HD PNG Blob for a specific invitation card (1, 2, or 3)
 * with the guest name drawn cleanly at its exact design coordinates from GUEST_NAME_CONFIG.
 */
export const generateIndividualCardBlob = async (
  cardId: 1 | 2 | 3,
  options: ExportCardOptions = {}
): Promise<Blob> => {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const displayName = formatGuestDisplayName(
    options.guestName,
    options.guestTitle,
    options.familyMode
  );

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const baseCfg = GUEST_NAME_CONFIG[cardId];
  const cfg: CardGuestNameConfig = {
    ...baseCfg,
    ...(options.customization || {}),
  };

  if (cardId === 1) {
    // Card 1: Royal Blue Arabic Wedding Invitation (1024 x 558)
    const img = await loadImage('/invitations/card-1.jpg');
    canvas.width = 1024;
    canvas.height = 558;
    ctx.drawImage(img, 0, 0, 1024, 558);

    if (displayName) {
      const targetX = (cfg.leftPercent / 100) * 1024;
      const targetY = (cfg.topPercent / 100) * 558;

      let fontSize = cfg.baseFontSizePx;
      if (!options.customization?.hasCustomPosition) {
        if (displayName.length > 20) fontSize = cfg.baseFontSizePx * 0.88;
        if (displayName.length > 26) fontSize = cfg.baseFontSizePx * 0.78;
      }

      ctx.save();
      ctx.translate(targetX, targetY);
      if (cfg.rotationDeg) {
        ctx.rotate((cfg.rotationDeg * Math.PI) / 180);
      }
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.font = `600 ${fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = cfg.textAlign || 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, 0, 0);
      ctx.restore();
    }
  } else if (cardId === 2) {
    // Card 2: Pastel Floral Reception Ceremony Card (460 x 610 / 2x canvas: 920 x 1220)
    const img = await loadImage('/invitations/card-2.jpg');
    canvas.width = 920;
    canvas.height = 1220;
    ctx.drawImage(img, 0, 0, 920, 1220);

    if (displayName) {
      const targetX = (cfg.leftPercent / 100) * 920;
      const targetY = (cfg.topPercent / 100) * 1220;

      let fontSize = cfg.baseFontSizePx;
      if (!options.customization?.hasCustomPosition) {
        if (displayName.length > 20) fontSize = cfg.baseFontSizePx * 0.88;
        if (displayName.length > 26) fontSize = cfg.baseFontSizePx * 0.78;
      }

      ctx.save();
      ctx.translate(targetX, targetY);
      if (cfg.rotationDeg) {
        ctx.rotate((cfg.rotationDeg * Math.PI) / 180);
      }

      const labelText = cfg.labelPrefix || 'Guest Name: ';
      ctx.font = `italic 500 ${fontSize}px ${cfg.fontFamily}`;
      const labelWidth = ctx.measureText(labelText).width;

      ctx.font = `600 ${fontSize}px ${cfg.fontFamily}`;
      const nameWidth = ctx.measureText(displayName).width;
      const totalWidth = labelWidth + nameWidth;

      const startX = -totalWidth / 2;

      // Draw label in soft antique gold
      ctx.font = `italic 500 ${fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.labelColor || '#91773E';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, startX, 0);

      // Draw name in deep sepia / bronze
      ctx.font = `600 ${fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.fillText(displayName, startX + labelWidth, 0);

      ctx.restore();
    }
  } else {
    // Card 3: Royal Blue English Wedding Invitation with Other Programs (1024 x 558)
    const img = await loadImage('/invitations/card-3.jpg');
    canvas.width = 1024;
    canvas.height = 558;
    ctx.drawImage(img, 0, 0, 1024, 558);

    if (displayName) {
      const targetX = (cfg.leftPercent / 100) * 1024;
      const targetY = (cfg.topPercent / 100) * 558;

      let fontSize = cfg.baseFontSizePx;
      if (!options.customization?.hasCustomPosition) {
        if (displayName.length > 18) fontSize = cfg.baseFontSizePx * 0.88;
        if (displayName.length > 24) fontSize = cfg.baseFontSizePx * 0.78;
      }

      ctx.save();
      ctx.translate(targetX, targetY);
      if (cfg.rotationDeg) {
        ctx.rotate((cfg.rotationDeg * Math.PI) / 180);
      }
      ctx.font = `600 ${fontSize}px ${cfg.fontFamily}`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = cfg.textAlign || 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(displayName, 0, -2);
      ctx.restore();
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create PNG blob from canvas'));
      },
      'image/png',
      1.0
    );
  });
};

/**
 * Copies a card PNG Blob directly to the system clipboard using the standard Clipboard API.
 */
export const copyCardBlobToClipboard = async (blob: Blob): Promise<void> => {
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
 * Triggers a download of the card PNG blob.
 */
export const downloadCardBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
