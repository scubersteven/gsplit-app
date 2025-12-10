import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
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

  console.log('[ShareImageV2] Starting generation with options:', { score, splitDetected, feedback, location, ranking, hasImage: !!pintImage });

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
      console.log('[ShareImageV2] Container created and added to DOM');

      // Create root and render ShareableResult
      const root = createRoot(container);
      console.log('[ShareImageV2] React root created');

      // Render the component
      try {
        root.render(
          createElement(ShareableResult, {
            score,
            splitDetected,
            comment: feedback,
            location: location || undefined,
            ranking: ranking || undefined,
            mode: 'share',
            pintImage: pintImage
          })
        );
        console.log('[ShareImageV2] Component rendered successfully');
      } catch (renderError) {
        console.error('[ShareImageV2] Render error:', renderError);
        root.unmount();
        document.body.removeChild(container);
        reject(new Error(`Failed to render component: ${renderError}`));
        return;
      }

      // Wait for render, then capture
      setTimeout(async () => {
        console.log('[ShareImageV2] Starting html2canvas capture after 2s delay');
        try {
          // Capture the rendered component as canvas
          console.log('[ShareImageV2] Calling html2canvas...');
          const canvas = await html2canvas(container, {
            width: 1080,
            height: 1920,
            scale: 1,
            backgroundColor: '#F5E6D3',
            logging: true, // Enable logging to see what's happening
            useCORS: true,
            allowTaint: true,
            imageTimeout: 15000 // Wait up to 15s for external images
          });
          console.log('[ShareImageV2] html2canvas completed, canvas size:', canvas.width, 'x', canvas.height);

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            console.log('[ShareImageV2] Canvas converted to blob, size:', blob?.size);
            // Cleanup
            root.unmount();
            document.body.removeChild(container);

            if (blob) {
              console.log('[ShareImageV2] Success! Resolving with blob');
              resolve(blob);
            } else {
              console.error('[ShareImageV2] Blob creation failed');
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/jpeg', 0.95);

        } catch (error) {
          console.error('[ShareImageV2] html2canvas error:', error);
          // Cleanup on error
          root.unmount();
          document.body.removeChild(container);
          reject(error);
        }
      }, 2000); // Wait 2s for fonts/images to load (baroque frame needs time)

    } catch (error) {
      console.error('[ShareImageV2] Outer catch error:', error);
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
  score: number,
  feedback?: string
): Promise<void> => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share) {
    try {
      const file = new File([imageBlob], 'gsplit-score.jpg', { type: 'image/jpeg' });

      const shareText = feedback
        ? `${score}%. ${feedback}\ngsplit.app`
        : `${score}%\ngsplit.app`;

      await navigator.share({
        files: [file],
        title: `Gsplit Score: ${score}%`,
        text: shareText
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
