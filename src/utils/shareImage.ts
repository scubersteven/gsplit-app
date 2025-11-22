/**
 * Generate shareable Instagram Story image for GSplit scores
 * Follows gsplit-brand-voice: Direct, clean, premium dark theme
 */

interface ShareImageOptions {
  pintImage: string; // Data URL of pint photo
  score: number;
  feedback: string;
  pubName?: string;
}

/**
 * Get score color based on thresholds
 * 80%+ = green, 60-80% = amber, <60% = red
 */
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10B981'; // precision green
  if (score >= 60) return '#f59e0b'; // amber
  return '#ef4444'; // red
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
        // Fill background with near-black
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image dimensions (top 60% of canvas)
        const imageHeight = canvas.height * 0.6;
        const imageWidth = canvas.width;

        // Draw pint image (cover fit)
        const imgAspect = img.width / img.height;
        const canvasAspect = imageWidth / imageHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          // Image is wider - fit to height
          drawHeight = imageHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = -(drawWidth - imageWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit to width
          drawWidth = imageWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = -(drawHeight - imageHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Dark overlay gradient (bottom 40%)
        const overlayY = imageHeight;
        const overlayHeight = canvas.height - imageHeight;

        const gradient = ctx.createLinearGradient(0, overlayY, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0.95)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, overlayY, canvas.width, overlayHeight);

        // Text setup
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // "GSPLIT" branding (warm white, bold)
        ctx.fillStyle = '#F5F5F0';
        ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
        ctx.fillText('GSPLIT', canvas.width / 2, overlayY + 80);

        // Score (large, color-coded)
        const scoreColor = getScoreColor(score);
        ctx.fillStyle = scoreColor;
        ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${score}%`, canvas.width / 2, overlayY + 200);

        // Feedback quote (warm white, italic, wrapped)
        ctx.fillStyle = '#F5F5F0';
        ctx.font = 'italic 32px system-ui, -apple-system, sans-serif';

        // Wrap feedback text if too long (max 2 lines)
        const maxWidth = canvas.width - 120;
        const words = feedback.split(' ');
        let line = '';
        let y = overlayY + 320;
        let lineCount = 0;

        for (let i = 0; i < words.length && lineCount < 2; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(`"${line.trim()}"`, canvas.width / 2, y);
            line = words[i] + ' ';
            y += 45;
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
          ctx.fillStyle = '#F5F5F0';
          ctx.font = '28px system-ui, -apple-system, sans-serif';
          ctx.fillText(`📍 ${pubName}`, canvas.width / 2, overlayY + 450);
        }

        // Footer "gsplit.app" (warm white, small, bottom)
        ctx.fillStyle = '#F5F5F0';
        ctx.font = '24px system-ui, -apple-system, sans-serif';
        ctx.fillText('gsplit.app', canvas.width / 2, canvas.height - 60);

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
