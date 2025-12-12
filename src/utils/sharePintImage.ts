/**
 * Generate shareable pint card image for social media
 * Instagram Story dimensions: 1080x1920
 */

import { getScoreColor } from './scoreColors';

export interface PintShareData {
  pintImage: string;
  score: number;
  rating: number;
  feedback: string;
  location: string;
  date: string;
}

/**
 * Draw star rating (filled, half, empty stars)
 */
const drawStars = (
  ctx: CanvasRenderingContext2D,
  rating: number,
  x: number,
  y: number,
  size: number = 40
): void => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  let currentX = x;

  // Draw filled stars
  for (let i = 0; i < fullStars; i++) {
    ctx.fillStyle = '#D4AF37'; // harp-gold
    ctx.fillText('★', currentX, y);
    currentX += size;
  }

  // Draw half star if needed
  if (hasHalfStar) {
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('★', currentX, y);
    currentX += size;
  }

  // Draw empty stars
  ctx.fillStyle = 'rgba(212, 175, 55, 0.3)'; // harp-gold/30
  for (let i = 0; i < emptyStars; i++) {
    ctx.fillText('★', currentX, y);
    currentX += size;
  }
};

/**
 * Wrap text to fit within max width
 * Returns array of lines
 */
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

/**
 * Generate pint card share image
 */
export async function generatePintShareImage(
  data: PintShareData
): Promise<Blob> {
  const { pintImage, score, rating, feedback, location, date } = data;

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
        // 1. Draw gradient background (deep-black to dark gray)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0A0A0A'); // deep-black
        gradient.addColorStop(1, '#1A1A1A'); // dark gray
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw "GSPLIT" header (harp-gold, top)
        ctx.fillStyle = '#D4AF37'; // harp-gold
        ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GSPLIT', canvas.width / 2, 120);

        // 3. Draw pint image (centered, 600x900px with rounded corners effect)
        const imgWidth = 600;
        const imgHeight = 900;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = 220;

        // Calculate aspect ratio and draw image
        const imgAspect = img.width / img.height;
        const targetAspect = imgWidth / imgHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > targetAspect) {
          // Image is wider - fit to height
          drawHeight = imgHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = imgX - (drawWidth - imgWidth) / 2;
          offsetY = imgY;
        } else {
          // Image is taller - fit to width
          drawWidth = imgWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = imgX;
          offsetY = imgY - (drawHeight - imgHeight) / 2;
        }

        // Clip to rounded rectangle
        ctx.save();
        ctx.beginPath();
        const radius = 24;
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, radius);
        ctx.clip();
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        // Add border to image
        ctx.strokeStyle = '#D4AF37'; // harp-gold
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, radius);
        ctx.stroke();

        // 4. Draw score (large, color-coded)
        let currentY = imgY + imgHeight + 80;
        const scoreColor = getScoreColor(score);
        ctx.fillStyle = scoreColor;
        ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${score}%`, canvas.width / 2, currentY);

        // 5. Draw star rating
        if (rating > 0) {
          currentY += 80;
          ctx.font = '48px system-ui, -apple-system, sans-serif';
          // Calculate starting X to center the stars
          const starWidth = 48;
          const totalStarWidth = starWidth * 5;
          const startX = (canvas.width - totalStarWidth) / 2;
          drawStars(ctx, rating, startX, currentY, starWidth);
        }

        // 6. Draw feedback quote (white, italic, wrapped)
        if (feedback) {
          currentY += 80;
          ctx.fillStyle = '#F5F5F0'; // foam-cream
          ctx.font = 'italic 42px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';

          const maxWidth = canvas.width - 160;
          const lines = wrapText(ctx, feedback, maxWidth);
          const maxLines = 2;

          for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
            const line = i === maxLines - 1 && lines.length > maxLines
              ? lines[i] + '...'
              : lines[i];
            ctx.fillText(`"${line}"`, canvas.width / 2, currentY);
            currentY += 56;
          }
        }

        // 7. Draw location (with pin icon)
        if (location) {
          currentY += 40;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.7)'; // foreground/70
          ctx.font = '36px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`📍 ${location}`, canvas.width / 2, currentY);
        }

        // 8. Draw date (with clock icon)
        if (date) {
          currentY += 50;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.6)'; // foreground/60
          ctx.font = '32px system-ui, -apple-system, sans-serif';
          ctx.fillText(`🕐 ${date}`, canvas.width / 2, currentY);
        }

        // 9. Draw app branding footer
        ctx.fillStyle = '#D4AF37'; // harp-gold
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.fillText('GSPLIT', canvas.width / 2, canvas.height - 120);

        ctx.fillStyle = 'rgba(245, 245, 240, 0.6)';
        ctx.font = '28px system-ui, -apple-system, sans-serif';
        ctx.fillText('#SplitTheG', canvas.width / 2, canvas.height - 70);

        // 10. Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load pint image'));
    };

    img.src = pintImage;
  });
}
