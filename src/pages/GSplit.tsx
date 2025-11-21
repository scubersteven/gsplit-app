import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowLeft, Video } from "lucide-react";
import { toast } from "sonner";
import GuidedCamera from "@/components/GuidedCamera";

const GSplit = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the actual file for API upload
      setSelectedFile(file);

      // Create preview for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (blob: Blob) => {
    // Convert Blob to File for API upload
    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
    setSelectedFile(file);

    // Create preview for display
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(blob);

    // Close camera
    setShowCamera(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedFile) {
      toast.error("Please upload a photo first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call your Flask API
      const response = await fetch('https://g-split-judge-production.up.railway.app/analyze-split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Check for error in response
      if (result.error) {
        toast.error(result.error);
        setIsAnalyzing(false);
        return;
      }

      // Navigate to results with real score
      navigate("/split-result", { 
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            The G-Split Challenge
          </h1>
          <p className="text-base text-muted-foreground">
            Upload your attempt and discover your precision score
          </p>
        </div>

        {!selectedImage ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-xl p-12 md:p-16 text-center hover:border-success transition-colors duration-300 bg-card">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-lg text-muted-foreground mb-8">
                Capture or upload your Guinness split
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label htmlFor="upload-photo">
                  <Button variant="default" className="gap-2 cursor-pointer" asChild>
                    <span>
                      <Upload className="w-5 h-5" />
                      Upload Image
                    </span>
                  </Button>
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <label htmlFor="take-photo">
                  <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                    <span>
                      <Camera className="w-5 h-5" />
                      Take Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="take-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setShowCamera(true)}
                >
                  <Video className="w-5 h-5" />
                  Use Live Camera
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure good lighting for accurate analysis</li>
                <li>• Keep camera level with the glass</li>
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
                    {/* Scanner animation */}
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

      {/* GuidedCamera Full Screen Modal */}
      {showCamera && (
        <GuidedCamera
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default GSplit;