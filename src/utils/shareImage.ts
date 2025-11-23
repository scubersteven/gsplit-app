/**
 * Generate shareable Instagram Story image for GSplit scores
 * Follows gsplit-design-guide: Premium Irish pub aesthetic
 */

interface ShareImageOptions {
  pintImage: string; // Data URL of pint photo
  score: number;
  feedback: string;
  pubName?: string;
}

/**
 * Get score color based on thresholds
 * 85%+ = green, 60-84% = amber, <60% = red
 */
const getScoreColor = (score: number): string => {
  if (score >= 85) return '#10B981'; // precision green
  if (score >= 60) return '#f59e0b'; // warm amber
  return '#ef4444'; // deep red
};

/**
 * Get score glow color (30% opacity for shadow effect)
 */
const getScoreGlow = (score: number): string => {
  if (score >= 85) return 'rgba(16, 185, 129, 0.3)'; // green glow
  if (score >= 60) return 'rgba(245, 158, 11, 0.3)'; // amber glow
  return 'rgba(239, 68, 68, 0.3)'; // red glow
};

/**
 * Generate shareable image canvas
 * Returns blob for download/sharing
 */
export const generateShareImage = async (
  options: ShareImageOptions
): Promise<Blob> => {
  const { pintImage, score, feedback, pubName } = options;

  return new Promise((resolve, reject) => {
    // Create canvas (Instagram Story dimensions: 1080x1920)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Load pint image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Fill background with gradient (near-black to rich-black)
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#0A0A0A'); // near-black
        bgGradient.addColorStop(1, '#1a1a1a'); // rich-black
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image area (top 55% with 20px padding)
        const imagePadding = 20;
        const imageAreaHeight = canvas.height * 0.55;
        const imageWidth = canvas.width - (imagePadding * 2);
        const imageHeight = imageAreaHeight - (imagePadding * 2);

        // Draw pint image container with gold border and glow
        const imageX = imagePadding;
        const imageY = imagePadding;
        const borderRadius = 16;

        // Save context for clipping
        ctx.save();

        // Create rounded rectangle clip path for image
        ctx.beginPath();
        ctx.moveTo(imageX + borderRadius, imageY);
        ctx.lineTo(imageX + imageWidth - borderRadius, imageY);
        ctx.quadraticCurveTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + borderRadius);
        ctx.lineTo(imageX + imageWidth, imageY + imageHeight - borderRadius);
        ctx.quadraticCurveTo(imageX + imageWidth, imageY + imageHeight, imageX + imageWidth - borderRadius, imageY + imageHeight);
        ctx.lineTo(imageX + borderRadius, imageY + imageHeight);
        ctx.quadraticCurveTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - borderRadius);
        ctx.lineTo(imageX, imageY + borderRadius);
        ctx.quadraticCurveTo(imageX, imageY, imageX + borderRadius, imageY);
        ctx.closePath();
        ctx.clip();

        // Draw pint image (cover fit)
        const imgAspect = img.width / img.height;
        const containerAspect = imageWidth / imageHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > containerAspect) {
          // Image is wider - fit to height
          drawHeight = imageHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = imageX - (drawWidth - imageWidth) / 2;
          offsetY = imageY;
        } else {
          // Image is taller - fit to width
          drawWidth = imageWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = imageX;
          offsetY = imageY - (drawHeight - imageHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Restore context
        ctx.restore();

        // Draw gold border with glow
        ctx.save();
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)'; // satin-gold glow
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#D4AF37'; // satin-gold
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(imageX + borderRadius, imageY);
        ctx.lineTo(imageX + imageWidth - borderRadius, imageY);
        ctx.quadraticCurveTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + borderRadius);
        ctx.lineTo(imageX + imageWidth, imageY + imageHeight - borderRadius);
        ctx.quadraticCurveTo(imageX + imageWidth, imageY + imageHeight, imageX + imageWidth - borderRadius, imageY + imageHeight);
        ctx.lineTo(imageX + borderRadius, imageY + imageHeight);
        ctx.quadraticCurveTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - borderRadius);
        ctx.lineTo(imageX, imageY + borderRadius);
        ctx.quadraticCurveTo(imageX, imageY, imageX + borderRadius, imageY);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Calculate overlay starting position (bottom 45%)
        const overlayY = imageAreaHeight;

        // Text setup
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // "GSPLIT" branding (satin gold, bold, letter-spaced)
        ctx.fillStyle = '#D4AF37'; // satin-gold
        ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillText('GSPLIT', canvas.width / 2, overlayY + 100);
        ctx.letterSpacing = '0px'; // Reset

        // Score (HUGE, color-coded with glow)
        const scoreColor = getScoreColor(score);
        const scoreGlow = getScoreGlow(score);

        ctx.save();
        ctx.shadowColor = scoreGlow;
        ctx.shadowBlur = 30;
        ctx.fillStyle = scoreColor;
        ctx.font = 'bold 120px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${score}%`, canvas.width / 2, overlayY + 240);
        ctx.restore();

        // Feedback quote (warm white, italic, wrapped)
        ctx.fillStyle = '#F5F5F0'; // warm-white
        ctx.font = 'italic 36px system-ui, -apple-system, sans-serif';

        // Wrap feedback text if too long (max 2 lines)
        const maxWidth = canvas.width - 120;
        const words = feedback.split(' ');
        let line = '';
        let y = overlayY + 380;
        let lineCount = 0;

        for (let i = 0; i < words.length && lineCount < 2; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(`"${line.trim()}"`, canvas.width / 2, y);
            line = words[i] + ' ';
            y += 50;
            lineCount++;
          } else {
            line = testLine;
          }
        }

        if (lineCount < 2 && line.trim()) {
          ctx.fillText(`"${line.trim()}"`, canvas.width / 2, y);
        }

        // Pub name if provided (with location pin)
        if (pubName) {
          ctx.fillStyle = '#E8E8DD'; // soft-cream
          ctx.font = '32px system-ui, -apple-system, sans-serif';
          ctx.fillText(`📍 ${pubName}`, canvas.width / 2, overlayY + 540);
        }

        // Gold divider line above footer
        const dividerY = canvas.height - 120;
        ctx.strokeStyle = '#D4AF37'; // satin-gold
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 150, dividerY);
        ctx.lineTo(canvas.width / 2 + 150, dividerY);
        ctx.stroke();

        // Footer "gsplit.app" (muted grey, small, bottom)
        ctx.fillStyle = '#9CA3AF'; // muted-grey
        ctx.font = '22px system-ui, -apple-system, sans-serif';
        ctx.fillText('gsplit.app', canvas.width / 2, canvas.height - 70);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.95);

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = pintImage;
  });
};

/**
 * Share to Instagram Stories (mobile only)
 * Falls back to download on desktop
 */
export const shareToInstagram = async (
  imageBlob: Blob,
  score: number
): Promise<void> => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share) {
    // Mobile: Try native share to Instagram Stories
    try {
      const file = new File([imageBlob], 'gsplit-score.jpg', { type: 'image/jpeg' });

      await navigator.share({
        files: [file],
        title: `GSplit Score: ${score}%`,
        text: `I scored ${score}% on GSplit! 🍺`
      });
    } catch (error) {
      // User cancelled or share failed - fall back to download
      console.log('Share cancelled or failed:', error);
      downloadImage(imageBlob);
    }
  } else {
    // Desktop: Download image
    downloadImage(imageBlob);
  }
};

/**
 * Download image blob as file
 */
const downloadImage = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gsplit-${Date.now()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
