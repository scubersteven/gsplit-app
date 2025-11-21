import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

const getScoreLabel = (score: number) => {
  if (score >= 95) return "legendary split";
  if (score >= 85) return "masterful pour";
  if (score >= 75) return "quality split";
  if (score >= 65) return "decent attempt";
  return "practice makes perfect";
};

const GSplitResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, image, feedback } = location.state || { score: 0, image: null, feedback: "That's a pour" };

  if (!image) {
    navigate("/split");
    return null;
  }

  const handleShare = async () => {
    const shareText = `I just scored ${score}% on my G-Split! ${feedback} 🍺`;
    const shareUrl = window.location.href;

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My G-Split Score",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            The Official G-Split Score
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pint Image */}
          <div className="relative rounded-lg overflow-hidden border border-border bg-card max-w-sm mx-auto md:mx-0">
            <img
              src={image}
              alt="Your pint split"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>

          {/* Score Card */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                G-Split
              </div>
              <div className="text-7xl font-bold text-success mb-4">
                {score}%
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                "{feedback || 'No feedback available'}"
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Evaluation
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">
                {getScoreLabel(score)}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Accuracy</span>
                  <span className="text-foreground font-medium">{score}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision</span>
                  <span className="text-foreground font-medium">{score >= 85 ? "High" : score >= 65 ? "Moderate" : "Developing"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => navigate("/survey", { state: { splitScore: score, splitImage: image } })}
            size="lg"
            className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:scale-[1.02] transition-transform"
          >
            Rate Your Guinness
          </Button>
          <Button
            onClick={handleShare}
            size="lg"
            variant="secondary"
            className="w-full py-6 text-lg font-semibold hover:scale-[1.02] transition-transform gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share My Score
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/split")}
            size="lg"
            className="w-full py-6 text-lg font-semibold border-2 hover:scale-[1.02] transition-transform"
          >
            Attempt Another Split
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GSplitResult;
