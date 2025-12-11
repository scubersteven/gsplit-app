// src/components/GuidedCamera.tsx
// Premium guided camera interface with manual capture and detection assist

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoboflowDetection } from '../hooks/useRoboflowDetection';

interface GuidedCameraProps {
  onCapture: (imageBlob: Blob) => void;
  onClose?: () => void;
}

type CameraState = 'loading' | 'no-pint' | 'no-g' | 'stabilizing' | 'capturing' | 'captured';
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
  const [guidanceText, setGuidanceText] = useState<string>('Show your pint');
  const stableFramesRef = useRef<number>(0);
  const [stableFrameCount, setStableFrameCount] = useState<number>(0); // For UI rendering
  const FRAMES_TO_SNAP = 10; // ~1 second at 10 FPS
  const [debugText, setDebugText] = useState<string>('Starting...');

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
            setCameraState('no-pint');
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

    const runDetection = async () => {
      if (videoRef.current) {
        try {
          const detections = await detectFrame(videoRef.current);

          // CRITICAL: Skip state updates when throttled (null = no new data)
          if (detections === null) {
            animationFrameId = requestAnimationFrame(runDetection);
            return;
          }

          // Log all detections to see what model returns
          console.log('🎯 ALL DETECTIONS:', detections.map(d => ({
            class: d.class,
            confidence: (d.confidence * 100).toFixed(1) + '%',
            bbox: d.bbox
          })));

          // Multi-class auto-snap logic
          const pint = detections.find(d => d.class === 'pint' && d.confidence > 0.4);
          const gLogo = detections.find(d => d.class === 'g-logo' && d.confidence > 0.4);

          // Update debug overlay
          setDebugText(`pint: ${pint ? 'YES' : 'NO'} | g: ${gLogo ? (gLogo.confidence * 100).toFixed(0) + '%' : 'NO'} | frames: ${stableFramesRef.current}`);

          // Guidance logic with auto-snap
          if (!pint) {
            // No pint in frame
            setGuidanceText("Show your pint");
            setCameraState('no-pint');
            stableFramesRef.current = 0;
            setStableFrameCount(0);
            console.log('⏳ No pint detected');
          } else if (!gLogo) {
            // Pint visible but G not visible
            setGuidanceText("Can't see the G");
            setCameraState('no-g');
            stableFramesRef.current = 0;
            setStableFrameCount(0);
            console.log('⚠️ Pint detected but no G logo');
          } else if (gLogo.confidence < 0.6) {
            // G visible but confidence too low
            setGuidanceText("Hold steady...");
            setCameraState('stabilizing');
            stableFramesRef.current = 0;
            setStableFrameCount(0);
            console.log(`📊 G detected but confidence too low: ${(gLogo.confidence * 100).toFixed(1)}%`);
          } else {
            // HIGH CONFIDENCE G DETECTED (>60%)
            stableFramesRef.current += 1;
            setStableFrameCount(stableFramesRef.current);
            setGuidanceText("Hold steady...");
            setCameraState('stabilizing');

            console.log(`✅ Stable frame ${stableFramesRef.current}/${FRAMES_TO_SNAP} - G confidence: ${(gLogo.confidence * 100).toFixed(1)}%`);

            if (stableFramesRef.current >= FRAMES_TO_SNAP) {
              console.log('📸 AUTO-SNAP TRIGGERED!');
              capturePhoto();
              return; // Stop detection loop
            }
          }

          // Simplified overlay - only pint guide (no ring)
          drawOverlay(null);
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

  // Draw overlay on canvas (pint guide only - no ring)
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

    // Draw pint guide outline ONLY (no ring)
    const guideWidth = canvas.width * 0.5;
    const guideHeight = canvas.height * 0.65;
    const guideX = (canvas.width - guideWidth) / 2;
    const guideY = (canvas.height - guideHeight) / 2;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(guideX, guideY, guideWidth, guideHeight);
    ctx.setLineDash([]);

    // NOTE: bbox parameter ignored - no ring drawing
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
        {/* Debug Overlay */}
        <div className="absolute top-20 left-0 right-0 text-center text-xs text-white bg-black/70 py-1 z-50">
          {debugText}
        </div>

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
            {cameraState === 'capturing' && 'Capturing...'}
            {cameraState === 'captured' && 'Captured!'}
            {(cameraState === 'no-pint' || cameraState === 'no-g' || cameraState === 'stabilizing') && guidanceText}
          </div>
        </div>
        
        {/* Center instruction text */}
        <AnimatePresence mode="wait">
          {(cameraState === 'no-pint' || cameraState === 'no-g') && (
            <motion.div
              key={cameraState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-8">
                <p className="text-white text-2xl font-bold uppercase tracking-wider mb-2">
                  {guidanceText}
                </p>
                {cameraState === 'no-pint' && (
                  <p className="text-white text-sm opacity-60">
                    Position your pint in the frame
                  </p>
                )}
                {cameraState === 'no-g' && (
                  <p className="text-white text-sm opacity-60">
                    Rotate the glass to show the harp logo
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {cameraState === 'stabilizing' && (
            <motion.div
              key="stabilizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-8">
                <p className="text-white text-2xl font-bold uppercase tracking-wider mb-4">
                  {guidanceText}
                </p>
                {/* Progress dots indicator */}
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: FRAMES_TO_SNAP }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i < stableFrameCount
                          ? 'bg-[#00FF87] scale-125'
                          : 'bg-white opacity-30'
                      }`}
                    />
                  ))}
                </div>
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

        {/* Manual Capture Button - De-emphasized */}
        <motion.button
          onClick={capturePhoto}
          className="absolute bottom-10 pointer-events-auto"
          style={{
            left: '50%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#00FF87',
            border: '3px solid white',
            boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)',
            opacity: 0.7,
          }}
          initial={{ x: '-50%' }}
          whileTap={{ scale: 0.9, x: '-50%' }}
          whileHover={{ opacity: 1 }}
        >
          <svg
            width="28"
            height="28"
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