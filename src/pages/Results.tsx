import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const getRatingDescription = (rating: number) => {
  if (rating === 5) return "an exceptional pint";
  if (rating === 4) return "a quality pour";
  if (rating === 3) return "a decent offering";
  if (rating === 2) return "a subpar pint";
  return "needs improvement";
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { splitScore, splitImage, surveyData, overallRating } = location.state || {};

  if (!surveyData) {
    navigate("/");
    return null;
  }

  const handleSaveToLog = () => {
    const existingLog = JSON.parse(localStorage.getItem("pintLog") || "[]");
    const pintLogId = location.state?.pintLogId;

    if (pintLogId) {
      // Update existing pint log entry
      const updatedLog = existingLog.map((entry: any) =>
        entry.id === pintLogId
          ? {
              ...entry,
              overallRating,
              location: surveyData.location,
              price: surveyData.price,
              taste: surveyData.taste,
              temperature: surveyData.temperature,
              creaminess: surveyData.creaminess,
              headSize: surveyData.headSize,
              twoPart: surveyData.twoPart,
              settled: surveyData.settled,
              tilted: surveyData.tilted,
              authentic: surveyData.authentic
            }
          : entry
      );
      localStorage.setItem("pintLog", JSON.stringify(updatedLog));
      toast.success("Pint rating updated!");
    } else {
      // Legacy flow: Create new entry (if coming from old route)
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        splitScore,
        splitImage,
        overallRating,
        location: surveyData.location,
        price: surveyData.price,
        taste: surveyData.taste,
        temperature: surveyData.temperature,
        creaminess: surveyData.creaminess,
        headSize: surveyData.headSize,
        twoPart: surveyData.twoPart,
        settled: surveyData.settled,
        tilted: surveyData.tilted,
        authentic: surveyData.authentic
      };
      localStorage.setItem("pintLog", JSON.stringify([newEntry, ...existingLog]));
      toast.success("Saved to pint log");
    }

    setTimeout(() => navigate("/log"), 1000);
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
            complete evaluation
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pint Image */}
          {splitImage && (
            <div className="relative rounded-lg overflow-hidden border border-border bg-card">
              <img
                src={splitImage}
                alt="Your pint"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          )}

          {/* Scores */}
          <div className="space-y-6">
            {/* G-Split Score */}
            {splitScore && (
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                  g-split
                </div>
                <div className="text-6xl font-bold text-success mb-2">
                  {splitScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  split accuracy
                </div>
              </div>
            )}

            {/* Overall Rating */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                overall pint rating
              </div>
              <div className="text-5xl font-bold text-foreground mb-3">
                {(overallRating * 20)}/100
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= overallRating ? "text-warning" : "text-muted/30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-base text-foreground font-medium">
                {getRatingDescription(overallRating)}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">location</span>
                  <span className="text-foreground font-medium">{surveyData.location}</span>
                </div>
                {surveyData.price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">price</span>
                    <span className="text-foreground font-medium">{surveyData.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wider">
            detailed breakdown
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Taste Profile */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                taste profile
              </h3>
              <div className="space-y-4">
                {[
                  { label: "taste", value: surveyData.taste },
                  { label: "temperature", value: surveyData.temperature },
                  { label: "creaminess", value: surveyData.creaminess },
                  { label: "head quality", value: surveyData.headSize },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-medium">{item.value}/5</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-destructive via-warning to-success"
                        style={{ width: `${(item.value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pour Technique */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                pour technique
              </h3>
              <div className="space-y-3">
                {[
                  { key: "twoPart", label: "two-part pour" },
                  { key: "settled", label: "proper settling" },
                  { key: "tilted", label: "45° angle" },
                  { key: "authentic", label: "authentic glass" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        surveyData[item.key as keyof typeof surveyData]
                          ? "border-success bg-success"
                          : "border-muted"
                      }`}
                    >
                      {surveyData[item.key as keyof typeof surveyData] && (
                        <div className="w-2 h-2 bg-background rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleSaveToLog}
            size="lg"
            className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:scale-[1.02] transition-transform"
          >
            Rate Your Guinness
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
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

export default Results;
