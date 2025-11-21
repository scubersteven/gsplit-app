// src/components/GuidedCamera.tsx
// Premium guided camera interface with manual capture and detection assist

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoboflowDetection } from '../hooks/useRoboflowDetection';

interface GuidedCameraProps {
  onCapture: (imageBlob: Blob) => void;
  onClose?: () => void;
}

type CameraState = 'loading' | 'searching' | 'detected' | 'capturing' | 'captured';
const GuidedCamera: React.FC<GuidedCameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const { detectFrame, isProcessing } = useRoboflowDetection({
    apiKey: 'bYmwUIskucEFjoL01NF5', // Your Roboflow API key
    model: 'guinness-g-split-etp2p',  // Your Model 1 project name
    version: '7'  // Your model version (adjust if different)
  });
  
  const [cameraState, setCameraState] = useState<CameraState>('loading');
  const [detectionBox, setDetectionBox] = useState<[number, number, number, number] | null>(null);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraState('searching');
          };
        }
      } catch (error) {
        console.error('❌ Camera access denied:', error);
        alert('Please allow camera access to use G-Split');
      }
    };

    startCamera();

    return () => {
      // Cleanup camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
     }, []);

  // Real-time detection loop (visual feedback only)
  useEffect(() => {
    if (cameraState === 'loading' || cameraState === 'capturing') {
      return;
    }

    let animationFrameId: number;
    let lastDetectionTime = 0;
    const DETECTION_FPS = 3; // 3 FPS for API calls (avoid rate limits)
    const DETECTION_INTERVAL = 1000 / DETECTION_FPS;

    const runDetection = async () => {
      const now = Date.now();

      if (now - lastDetectionTime >= DETECTION_INTERVAL && videoRef.current) {
        lastDetectionTime = now;

        try {
          const detections = await detectFrame(videoRef.current);

          console.log('🎯 Detections received:', {
            count: detections.length,
            allClasses: detections.map(d => `${d.class} (${(d.confidence * 100).toFixed(1)}%)`),
            timestamp: new Date().toISOString()
          });

          // Find G-logo detection (visual feedback only)
          const gLogo = detections.find(d => d.class === 'g-logo' && d.confidence > 0.4);

          console.log('🔍 G-logo search result:', {
            found: !!gLogo,
            confidence: gLogo ? (gLogo.confidence * 100).toFixed(1) + '%' : 'N/A',
            bbox: gLogo?.bbox,
            cameraState
          });

          if (gLogo) {
            // Show detection ring
            setDetectionBox(gLogo.bbox);
            setCameraState('detected');
          } else {
            // No G-logo detected
            setDetectionBox(null);
            setCameraState('searching');
          }

          // Draw overlay
          drawOverlay(gLogo ? gLogo.bbox : null);
        } catch (error) {
          console.error('Detection error:', error);
        }
      }

      animationFrameId = requestAnimationFrame(runDetection);
    };

    runDetection();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraState, detectFrame]);

  // Capture photo
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCameraState('capturing');
    
    // Heavy success haptic
    haptic([100, 50, 100]);
    
    // Play shutter sound
    playSound('shutter');
    
    // Capture to canvas
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      // Flash effect (handled by CSS animation)
      setTimeout(() => {
        setCameraState('captured');
      }, 200);
      
      // Convert to blob and send
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Draw overlay on canvas
  const drawOverlay = (bbox: [number, number, number, number] | null) => {
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pint guide outline
    const guideWidth = canvas.width * 0.5;
    const guideHeight = canvas.height * 0.65;
    const guideX = (canvas.width - guideWidth) / 2;
    const guideY = (canvas.height - guideHeight) / 2;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(guideX, guideY, guideWidth, guideHeight);
    ctx.setLineDash([]);
    
    // Draw detection ring if G-logo found
    if (bbox) {
      const [x, y, w, h] = bbox;
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const baseRadius = Math.max(w, h) / 2 + 30;

      // Pulse animation when detected
      const pulseAmount = cameraState === 'detected'
        ? Math.sin(Date.now() / 500) * 5 + 5 // Pulse between +0 and +10 pixels
        : 0;
      const radius = baseRadius + pulseAmount;

      // Ring color - bright green when detected
      const baseOpacity = cameraState === 'detected'
        ? 0.6 + Math.sin(Date.now() / 500) * 0.2 // Pulse opacity between 0.4 and 0.8
        : 0.6;
      const color = `rgba(0, 255, 135, ${baseOpacity})`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 5;

      // Draw main circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw outer glow circle when detected
      if (cameraState === 'detected') {
        ctx.strokeStyle = `rgba(0, 255, 135, ${baseOpacity * 0.3})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  // Helper: Play sound
  const playSound = (name: 'tick' | 'shutter') => {
    try {
      const audio = new Audio(`/sounds/${name}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
      // Silently fail if sounds not available
    }
  };

  // Helper: Haptic feedback
  const haptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Hidden capture canvas */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      {/* Overlay canvas for guides */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="pointer-events-auto text-white text-sm uppercase tracking-wider bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            Cancel
          </button>
          
          <div className="text-white text-xs uppercase tracking-wider bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {cameraState === 'loading' && 'Loading...'}
            {cameraState === 'searching' && 'Looking for G...'}
            {cameraState === 'detected' && 'G detected - tap to capture'}
            {cameraState === 'capturing' && 'Capturing...'}
          </div>
        </div>
        
        {/* Center instruction text */}
        <AnimatePresence mode="wait">
          {cameraState === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-8">
                <p className="text-white text-lg uppercase tracking-wider mb-2">
                  Center the G in the frame
                </p>
                <p className="text-white text-sm opacity-60">
                  Position your pint so the Guinness harp is visible
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Shutter flash effect */}
        <AnimatePresence>
          {cameraState === 'capturing' && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white"
            />
          )}
        </AnimatePresence>

        {/* Manual Capture Button */}
        <motion.button
          onClick={capturePhoto}
          className="absolute bottom-10 pointer-events-auto"
          style={{
            left: '50%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#00FF87',
            border: '4px solid white',
            boxShadow: '0 4px 20px rgba(0, 255, 135, 0.5)',
          }}
          initial={{ x: '-50%' }}
          whileTap={{ scale: 0.9, x: '-50%' }}
          animate={
            cameraState === 'detected'
              ? {
                  x: '-50%',
                  boxShadow: [
                    '0 4px 20px rgba(0, 255, 135, 0.5)',
                    '0 4px 30px rgba(0, 255, 135, 0.8)',
                    '0 4px 20px rgba(0, 255, 135, 0.5)',
                  ],
                }
              : { x: '-50%' }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: 'auto' }}
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default GuidedCamera;