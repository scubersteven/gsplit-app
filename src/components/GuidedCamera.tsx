// src/components/GuidedCamera.tsx
// Premium guided camera interface with manual capture and detection assist

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoboflowDetection } from '../hooks/useRoboflowDetection';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GuidedCameraProps {
  onClose?: () => void;
}

type CameraState = 'loading' | 'no-g' | 'locked' | 'capturing' | 'frozen' | 'analyzing';
const GuidedCamera: React.FC<GuidedCameraProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const { detectFrame, isProcessing } = useRoboflowDetection({
    apiKey: 'bYmwUIskucEFjoL01NF5', // Your Roboflow API key
    model: 'guinness-g-split-etp2p',  // Your Model 1 project name
    version: '7'  // Your model version (adjust if different)
  });

  const [cameraState, setCameraState] = useState<CameraState>('loading');
  const navigate = useNavigate();
  const [frozenFrameUrl, setFrozenFrameUrl] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
            setCameraState('no-g');
          };
        }
      } catch (error) {
        console.error('❌ Camera access denied:', error);
        alert('Please allow camera access to use G-Split');
      }
    };

    startCamera();

    return () => {
      // Abort any pending API calls
      abortControllerRef.current?.abort();

      // Cleanup camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
     }, []);

  // Real-time detection loop (visual feedback only)
  useEffect(() => {
    // Exit early if not in scanning state - prevents unnecessary requestAnimationFrame calls
    if (cameraState !== 'no-g') {
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

          // G-logo only detection logic - lock feedback then snap
          const gLogo = detections.find(d => d.class === 'g-logo' && d.confidence > 0.6);

          if (!gLogo) {
            setCameraState('no-g');
            console.log('🔍 Scanning for G...');
          } else {
            // G DETECTED - trigger lock sequence
            console.log(`🎯 G locked at ${(gLogo.confidence * 100).toFixed(0)}% - triggering snap in 300ms`);
            setCameraState('locked');

            // Haptic buzz
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }

            // Wait 200ms then snap
            setTimeout(() => {
              captureAndAnalyze();
            }, 200);

            return;
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

  // Capture photo and analyze
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCameraState('capturing');

    // Haptic + sound
    haptic([100, 50, 100]);
    playSound('shutter');

    // Capture frame
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Stop camera stream immediately
    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }

    // Create frozen frame data URL
    const frozenDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setFrozenFrameUrl(frozenDataUrl);

    // Show frozen frame with flash
    setCameraState('frozen');
    await new Promise(resolve => setTimeout(resolve, 200));

    // Start API call with scan animation
    setCameraState('analyzing');

    canvas.toBlob(async (blob) => {
      if (!blob) {
        handleError('Failed to capture image');
        return;
      }

      try {
        const formData = new FormData();
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        formData.append('image', file);

        // Create AbortController for cleanup on unmount
        abortControllerRef.current = new AbortController();

        const response = await fetch(
          'https://g-split-judge-production.up.railway.app/analyze-split',
          {
            method: 'POST',
            body: formData,
            signal: abortControllerRef.current.signal
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          handleError(result.error);
          return;
        }

        // Navigate to results
        // IMPORTANT: Use closure variable frozenDataUrl, NOT state (frozenFrameUrl)
        // State might not be updated yet due to async setState
        navigate('/split-result-v2', {
          state: {
            score: result.score,
            image: frozenDataUrl,
            distance: result.distance_from_g_line_mm,
            feedback: result.feedback,
            splitDetected: result.g_line_detected
          }
        });

      } catch (error) {
        // Ignore AbortError (happens on unmount/cancel)
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('API call aborted');
          return;
        }
        console.error('Analysis error:', error);
        handleError('Failed to analyze image. Please try again.');
      }
    }, 'image/jpeg', 0.95);
  };

  const handleError = (message: string) => {
    toast.error(message);
    setCameraState('no-g');
    setFrozenFrameUrl(null);
    restartCamera();
  };

  const restartCamera = async () => {
    setCameraState('loading');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraState('no-g');
        };
      }
    } catch (error) {
      console.error('Camera restart failed:', error);
      toast.error('Camera access denied');
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
      {(cameraState === 'loading' || cameraState === 'no-g' || cameraState === 'locked' || cameraState === 'capturing') && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
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
          {(cameraState === 'loading' || cameraState === 'no-g' || cameraState === 'locked' || cameraState === 'capturing') && (
            <button
              onClick={onClose}
              className="pointer-events-auto text-white text-sm uppercase tracking-wider bg-black bg-opacity-50 px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          )}
          
          {(cameraState === 'loading' || cameraState === 'no-g' || cameraState === 'locked' || cameraState === 'capturing') && (
            <div className="text-white text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full font-mono">
              {cameraState === 'loading' && 'INITIALIZING...'}
              {cameraState === 'no-g' && 'SCANNING...'}
              {cameraState === 'locked' && 'LOCKED'}
              {cameraState === 'capturing' && 'CAPTURING...'}
            </div>
          )}
        </div>
        
        {/* Center instruction text - minimal tech scanner style */}
        <AnimatePresence mode="wait">
          {cameraState === 'no-g' && (
            <motion.div
              key="no-g"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="text-white text-sm uppercase tracking-widest font-mono opacity-70">
                Scanning for G...
              </p>
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

        {/* Contained layout with scan animation - natural scroll */}
        {(cameraState === 'frozen' || cameraState === 'analyzing') && frozenFrameUrl && (
          <div className="fixed inset-0 z-50 bg-background overflow-auto">
            <div className="px-4 py-6">

              {/* Header - tight */}
              <div className="mb-4 text-center">
                <h1 className="text-3xl font-playfair font-bold text-white mb-1 tracking-tight">
                  The Stout Standard
                </h1>
                <p className="text-sm text-muted-foreground">
                  The digital barman never lies
                </p>
              </div>

              {/* Image Container - no height constraint, natural size */}
              <div className="relative rounded-lg overflow-hidden border border-border bg-card max-w-sm mx-auto">
                <img
                  src={frozenFrameUrl}
                  alt="Your pint"
                  className="w-full h-auto"
                />
                {/* Scan Animation Overlay */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="absolute w-full h-1 bg-success shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-scan" />
                  </div>
                  <div className="absolute text-center">
                    <div className="text-lg font-medium text-foreground mb-2">
                      Analyzing Split...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Calculating precision
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Manual Capture Button - De-emphasized */}
        <motion.button
          onClick={captureAndAnalyze}
          disabled={cameraState !== 'no-g' && cameraState !== 'locked'}
          className="absolute bottom-10 pointer-events-auto"
          style={{
            left: '50%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#00FF87',
            border: '3px solid white',
            boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)',
            opacity: (cameraState === 'no-g' || cameraState === 'locked') ? 0.7 : 0.3,
            cursor: (cameraState === 'no-g' || cameraState === 'locked') ? 'pointer' : 'not-allowed',
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