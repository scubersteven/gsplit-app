/**
 * Generate shareable Instagram Story image for GSplit scores
 * Clean, data-focused design with emoji labels
 */

interface ShareImageOptions {
  pintImage: string; // Data URL of pint photo
  score: number;
  feedback: string;
  splitDetected: boolean;
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
  const { pintImage, score, feedback, splitDetected, pubName } = options;

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
        // Fill background with pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate pint photo area (top 60% = 1152px)
        const photoAreaHeight = canvas.height * 0.6; // 1152px
        const photoPadding = 16;
        const photoWidth = canvas.width - (photoPadding * 2);
        const photoHeight = photoAreaHeight - (photoPadding * 2);
        const photoX = photoPadding;
        const photoY = photoPadding;

        // Draw pint image (cover fit, centered)
        const imgAspect = img.width / img.height;
        const containerAspect = photoWidth / photoHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > containerAspect) {
          // Image is wider - fit to height
          drawHeight = photoHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = photoX - (drawWidth - photoWidth) / 2;
          offsetY = photoY;
        } else {
          // Image is taller - fit to width
          drawWidth = photoWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = photoX;
          offsetY = photoY - (drawHeight - photoHeight) / 2;
        }

        // Clip to photo area
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoWidth, photoHeight);
        ctx.clip();
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        // Draw gold frame (2px border)
        ctx.strokeStyle = '#D4AF37'; // satin-gold
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

        // Calculate score announcement area (bottom 40% = 768px)
        const scoreAreaY = photoAreaHeight;
        const scoreAreaHeight = canvas.height - photoAreaHeight;

        // Text setup - centered for all content
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = canvas.width / 2;
        let currentY = scoreAreaY + 100;

        // 1. GIANT SCORE with glow
        const scoreColor = getScoreColor(score);
        const scoreGlow = getScoreGlow(score);

        ctx.save();
        ctx.shadowColor = scoreGlow;
        ctx.shadowBlur = 40;
        ctx.fillStyle = scoreColor;
        ctx.font = '900 120px -apple-system, system-ui, sans-serif';
        ctx.letterSpacing = '-2px';
        ctx.fillText(`${score}%`, centerX, currentY);
        ctx.restore();

        currentY += 100;

        // 2. FEEDBACK (directly under score)
        ctx.fillStyle = '#F5F5F0'; // warm-white
        ctx.font = 'italic 28px -apple-system, system-ui, sans-serif';
        ctx.letterSpacing = '0px';

        // Wrap feedback if needed (max 2 lines)
        const feedbackText = `"${feedback}"`;
        const maxFeedbackWidth = canvas.width - 100;
        const words = feedbackText.split(' ');
        let line = '';
        const feedbackLines: string[] = [];

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxFeedbackWidth && i > 0) {
            feedbackLines.push(line.trim());
            line = words[i] + ' ';
          } else {
            line = testLine;
          }
        }
        if (line.trim()) feedbackLines.push(line.trim());

        // Draw feedback lines (max 2)
        const feedbackStartY = currentY;
        for (let i = 0; i < Math.min(feedbackLines.length, 2); i++) {
          ctx.fillText(feedbackLines[i], centerX, feedbackStartY + (i * 36));
        }

        currentY += feedbackLines.length > 1 ? 80 : 50;

        // 3. GOLD DIVIDER LINE (60% width)
        const dividerWidth = canvas.width * 0.6;
        ctx.strokeStyle = '#D4AF37'; // satin-gold
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - dividerWidth / 2, currentY);
        ctx.lineTo(centerX + dividerWidth / 2, currentY);
        ctx.stroke();

        currentY += 40;

        // 4. COMPACT DATA ROWS (16px vertical gaps)

        // Row 1: 🔍 86.9%
        ctx.font = '24px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#F5F5F0';
        const emoji1Width = ctx.measureText('🔍 ').width;
        ctx.fillText('🔍', centerX - 60, currentY);

        ctx.font = '600 32px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#F5F5F0';
        ctx.fillText(`${score}%`, centerX + 10, currentY);

        currentY += 50;

        // Row 2: ✅ Split detected / ❌ No split detected
        ctx.font = '24px -apple-system, system-ui, sans-serif';
        ctx.fillText(splitDetected ? '✅' : '❌', centerX - 80, currentY);

        ctx.font = '600 20px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = splitDetected ? '#10B981' : '#ef4444'; // green or red
        ctx.fillText(splitDetected ? 'Split detected' : 'No split detected', centerX + 20, currentY);

        currentY += 50;

        // Row 3 (optional): 📍 Temple Bar
        if (pubName) {
          ctx.font = '20px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = '#F5F5F0';
          ctx.fillText('📍', centerX - 60, currentY);

          ctx.font = '600 20px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = '#E8E8DD'; // soft-cream
          ctx.fillText(pubName, centerX + 10, currentY);

          currentY += 50;
        }

        // 5. FOOTER: gsplit.app
        ctx.font = '16px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText('gsplit.app', centerX, canvas.height - 40);

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
