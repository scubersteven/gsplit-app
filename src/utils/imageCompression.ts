/**
 * Compress image to target size using Canvas API
 * @param dataUrl - Base64 data URL of the image
 * @param maxSizeKB - Target size in kilobytes (default: 200 KB)
 * @returns Promise<string> - Compressed base64 data URL
 */
export const compressImage = async (
  dataUrl: string,
  maxSizeKB: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');

      // Calculate new dimensions (max 800px width, maintain aspect ratio)
      const maxWidth = 800;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;

      // Scale down if necessary
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Binary search for optimal quality
      let quality = 0.8;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      const targetSize = maxSizeKB * 1024 * (4/3); // Account for base64 overhead

      // Reduce quality until under target size (minimum 0.1)
      while (compressed.length > targetSize && quality > 0.1) {
        quality -= 0.05;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      console.log(`📸 Compressed image: ${(compressed.length / 1024).toFixed(1)} KB (quality: ${(quality * 100).toFixed(0)}%)`);
      resolve(compressed);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = dataUrl;
  });
};

/**
 * Get estimated storage size of pintLog in MB
 */
export const getStorageSize = (): number => {
  try {
    const log = localStorage.getItem('pintLog');
    if (!log) return 0;
    return (log.length * 2) / (1024 * 1024); // UTF-16 = 2 bytes per char
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
};
