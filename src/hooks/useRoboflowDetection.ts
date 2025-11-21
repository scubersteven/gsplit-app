// src/hooks/useRoboflowDetection.ts
// Real-time G-logo detection using Roboflow Hosted API

import { useState, useCallback, useRef } from 'react';

export interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  confidence: number;
}

interface RoboflowConfig {
  apiKey: string;
  model: string;
  version: string;
}

export const useRoboflowDetection = (config: RoboflowConfig) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const lastCallTime = useRef<number>(0);
  const THROTTLE_MS = 300; // Limit to ~3 FPS to avoid rate limits

  const detectFrame = useCallback(async (
    videoElement: HTMLVideoElement
  ): Promise<Detection[]> => {
    // Throttle API calls
    const now = Date.now();
    if (now - lastCallTime.current < THROTTLE_MS) {
      return [];
    }
    lastCallTime.current = now;

    if (isProcessing) {
      return [];
    }

    setIsProcessing(true);

    try {
      // Capture frame from video to canvas
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      ctx.drawImage(videoElement, 0, 0);
      
      // Convert to base64
      const base64Image = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];

      // Call Roboflow API
      console.log('🔍 Calling Roboflow API:', {
        url: `https://detect.roboflow.com/${config.model}/${config.version}`,
        timestamp: new Date().toISOString(),
        imageSize: Math.round(base64Image.length / 1024) + ' KB'
      });

      const response = await fetch(
        `https://detect.roboflow.com/${config.model}/${config.version}?api_key=${config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: base64Image,
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ API Response:', {
        status: response.status,
        predictionsCount: data.predictions?.length || 0,
        predictions: data.predictions
      });

      // Parse Roboflow response format
      const detections: Detection[] = [];

      if (data.predictions && Array.isArray(data.predictions)) {
        data.predictions.forEach((pred: any) => {
          detections.push({
            bbox: [
              pred.x - pred.width / 2,
              pred.y - pred.height / 2,
              pred.width,
              pred.height
            ],
            class: pred.class,
            confidence: pred.confidence
          });
        });
      }

      console.log('📦 Parsed detections:', detections.length, detections);

      setIsProcessing(false);
      return detections;
    } catch (error) {
      console.error('Detection error:', error);
      setIsProcessing(false);
      return [];
    }
  }, [config, isProcessing]);

  return {
    detectFrame,
    isProcessing
  };
};