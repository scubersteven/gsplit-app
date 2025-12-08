import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import ShareableResult from '@/pages/ShareableResult';

interface ShareImageV2Options {
  score: number;
  splitDetected: boolean;
  feedback: string;
  location?: string;
  ranking?: string;
  pintImage: string; // Data URL of the pint photo
}

/**
 * Generate Instagram Story image using ShareableResult component
 * Converts React component to image using html2canvas
 */
export const generateShareImageV2 = async (
  options: ShareImageV2Options
): Promise<Blob> => {
  const { score, splitDetected, feedback, location, ranking, pintImage } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create a temporary container off-screen
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '1080px';
      container.style.height = '1920px';
      document.body.appendChild(container);

      // Create root and render ShareableResult
      const root = createRoot(container);

      // Render the component
      root.render(
        ShareableResult({
          score,
          splitDetected,
          comment: feedback,
          location: location || undefined,
          ranking: ranking || undefined,
          mode: 'share',
          pintImage: pintImage
        })
      );

      // Wait for render, then capture
      setTimeout(async () => {
        try {
          // Capture the rendered component as canvas
          const canvas = await html2canvas(container, {
            width: 1080,
            height: 1920,
            scale: 1,
            backgroundColor: '#FFF8E7',
            logging: false,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 15000 // Wait up to 15s for external images
          });

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            // Cleanup
            root.unmount();
            document.body.removeChild(container);

            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/jpeg', 0.95);

        } catch (error) {
          // Cleanup on error
          root.unmount();
          document.body.removeChild(container);
          reject(error);
        }
      }, 2000); // Wait 2s for fonts/images to load (baroque frame needs time)

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Share to Instagram Stories (mobile) or download (desktop)
 * Same as original shareToInstagram function
 */
export const shareToInstagramV2 = async (
  imageBlob: Blob,
  score: number
): Promise<void> => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share) {
    try {
      const file = new File([imageBlob], 'gsplit-score.jpg', { type: 'image/jpeg' });

      await navigator.share({
        files: [file],
        title: `Gsplit Score: ${score}%`,
        text: `I scored ${score}% on Gsplit! 🍺`
      });
    } catch (error) {
      console.log('Share cancelled or failed:', error);
      downloadImage(imageBlob);
    }
  } else {
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
