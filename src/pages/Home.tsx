import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Camera, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import GuidedCamera from "@/components/GuidedCamera";

const Home = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pubName, setPubName] = useState("");
  const [pendingAction, setPendingAction] = useState<'camera' | 'upload' | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(blob);
    setShowCamera(false);
  };

  // Show location modal when user first interacts with upload/camera
  const handleShowLocationModal = () => {
    const hasSeenLocationModal = sessionStorage.getItem('locationModalSeen');
    if (!hasSeenLocationModal) {
      setShowLocationModal(true);
    }
  };

  const handleSavePub = () => {
    if (pubName.trim()) {
      localStorage.setItem('userPubName', pubName.trim());
      sessionStorage.setItem('locationModalSeen', 'true');
      toast.success(`Saved: ${pubName.trim()}`);
      setShowLocationModal(false);

      // Execute pending action after modal closes
      if (pendingAction === 'upload') {
        setTimeout(() => document.getElementById('upload-photo')?.click(), 100);
      } else if (pendingAction === 'camera') {
        setTimeout(() => setShowCamera(true), 100);
      }
      setPendingAction(null);
    } else {
      toast.error("Please enter your pub's name");
    }
  };

  const handleSkipLocation = () => {
    sessionStorage.setItem('locationModalSeen', 'true');
    setShowLocationModal(false);

    // Execute pending action after skipping
    if (pendingAction === 'upload') {
      setTimeout(() => document.getElementById('upload-photo')?.click(), 100);
    } else if (pendingAction === 'camera') {
      setTimeout(() => setShowCamera(true), 100);
    }
    setPendingAction(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedFile) {
      toast.error("Please upload a photo first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://g-split-judge-production.up.railway.app/analyze-split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
        setIsAnalyzing(false);
        return;
      }

      navigate("/split-result-v2", {
        state: {
          score: result.score,
          image: selectedImage,
          distance: result.distance_from_g_line_mm,
          feedback: result.feedback,
          splitDetected: result.g_line_detected
        }
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze image. Make sure the Flask server is running on port 5001.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Hero Upload Zone */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
            Master the Split
          </h1>
          <p className="text-lg text-muted-foreground">
            The art of the perfect Guinness divide
          </p>
        </div>

        {!selectedImage ? (
          <div className="space-y-6">
            <div className="group relative bg-card border-2 border-border hover:border-success p-8 md:p-12 rounded-xl transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <div className="relative text-center space-y-6">
                <div className="inline-block p-6 bg-secondary/50 rounded-lg mb-4 group-hover:bg-success/20 transition-colors duration-300">
                  <Camera className="w-16 h-16 text-primary" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  Split the G
                </h2>

                <p className="text-lg text-muted-foreground max-w-xl mx-auto italic">
                  Go on then.....
                </p>

                <div className="flex flex-col gap-4 justify-center w-full max-w-[300px] mx-auto pt-4">
                  <Button
                    variant="default"
                    className="gap-2 w-full"
                    onClick={() => {
                      const hasSeenLocationModal = sessionStorage.getItem('locationModalSeen');
                      if (!hasSeenLocationModal) {
                        setPendingAction('camera');
                        setShowLocationModal(true);
                      } else {
                        setShowCamera(true);
                      }
                    }}
                  >
                    📷 Live Camera
                  </Button>

                  <Button
                    variant="secondary"
                    className="gap-2 w-full"
                    onClick={() => {
                      const hasSeenLocationModal = sessionStorage.getItem('locationModalSeen');
                      if (!hasSeenLocationModal) {
                        setPendingAction('upload');
                        setShowLocationModal(true);
                      } else {
                        document.getElementById('upload-photo')?.click();
                      }
                    }}
                  >
                    📁 Upload Image
                  </Button>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-border hover:border-success rounded-lg p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure good lighting for accurate analysis</li>
                <li>• Make sure the G logo is clearly visible</li>
                <li>• Fill the frame with your pint</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="relative rounded-lg overflow-hidden border border-border bg-card max-w-md mx-auto">
              <img
                src={selectedImage}
                alt="Your pint"
                className="w-full h-auto"
              />
              {isAnalyzing && (
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
              )}
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedFile(null);
                }}
                className="flex-1"
                disabled={isAnalyzing}
              >
                Choose Different Photo
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 gap-2"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Split"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Feature */}
      <div className="max-w-3xl mx-auto">
        <Link to="/survey">
          <div className="group bg-card border-2 border-border hover:border-gold p-8 rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-secondary/50 rounded-lg group-hover:bg-gold/20 transition-colors duration-300">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Rate Your Guinness
              </h2>
            </div>
            <p className="text-base text-muted-foreground mb-4">
              Comprehensive evaluation of taste, pour technique, and presentation
            </p>
            <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
              Begin Evaluation →
            </div>
          </div>
        </Link>
      </div>

      {/* GuidedCamera Modal */}
      {showCamera && (
        <GuidedCamera
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              📍 What's Your Pub?
            </DialogTitle>
            <DialogDescription className="text-base pt-2" style={{ color: 'hsl(32, 35%, 88%)' }}>
              See who's beating you at your local
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="e.g., Temple Bar, O'Donoghue's"
              value={pubName}
              onChange={(e) => setPubName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSavePub()}
              className="w-full"
              autoFocus
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="ghost"
              onClick={handleSkipLocation}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleSavePub}
              className="w-full sm:w-auto bg-cream-dark hover:bg-cream text-[#1C1410] order-1 sm:order-2"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
