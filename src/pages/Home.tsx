import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Star } from "lucide-react";
import { toast } from "sonner";
import GuidedCamera from "@/components/GuidedCamera";
import PubSelectModal from "@/components/PubSelectModal";

const Home = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPubModal, setShowPubModal] = useState(false);
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

  const handlePubModalSave = (place: any, username: string | null) => {
    if (place) {
      // Store place data in sessionStorage
      sessionStorage.setItem('selectedPub', JSON.stringify(place));
      if (username) {
        sessionStorage.setItem('gsplit_username', username);
      }
      toast.success(`Pub selected: ${place.name}`);
    } else {
      // Clear pub data if skipped
      sessionStorage.removeItem('selectedPub');
      sessionStorage.removeItem('gsplit_username');
    }

    setShowPubModal(false);

    // Execute pending action after modal closes
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
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-2 tracking-wide">
            The Stout Standard
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            The digital barman never lies.
          </p>
        </div>

        {!selectedImage ? (
          <div className="space-y-6">
            <div className="group relative bg-card border-2 border-border hover:border-success p-6 md:p-8 rounded-xl transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <div className="relative text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
                  Split the G
                </h2>

                <p className="text-lg text-muted-foreground max-w-xl mx-auto italic">
                  G'wan Then...
                </p>

                <div className="flex flex-row gap-4 justify-center w-full max-w-[300px] mx-auto pt-4">
                  <Button
                    variant="default"
                    className="gap-2 w-full"
                    onClick={() => {
                      setPendingAction('camera');
                      setShowPubModal(true);
                    }}
                  >
                    📷 Live Camera
                  </Button>

                  <Button
                    variant="secondary"
                    className="gap-2 w-full"
                    onClick={() => {
                      setPendingAction('upload');
                      setShowPubModal(true);
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
          <div className="group bg-card border-2 border-border hover:border-gold p-6 rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-secondary/50 rounded-lg group-hover:bg-gold/20 transition-colors duration-300">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
                Rate Your Guinness
              </h2>
            </div>
            <p className="text-base text-muted-foreground mb-4">
              The full verdict
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

      {/* Pub Selection Modal */}
      <PubSelectModal
        isOpen={showPubModal}
        onClose={() => {
          setShowPubModal(false);
          setPendingAction(null);
        }}
        onSave={handlePubModalSave}
      />
    </div>
  );
};

export default Home;
