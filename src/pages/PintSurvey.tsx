import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SurveyData {
  taste: number;
  temperature: number;
  creaminess: number;
  twoPart: boolean;
  settled: boolean;
  tilted: boolean;
  authentic: boolean;
  headSize: number;
  price: string;
  location: string;
}

const PintSurvey = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { splitScore, splitImage, pintLogId } = location.state || {};

  const [surveyData, setSurveyData] = useState<SurveyData>({
    taste: 3,
    temperature: 3,
    creaminess: 3,
    twoPart: false,
    settled: false,
    tilted: false,
    authentic: false,
    headSize: 3,
    price: "",
    location: "",
  });

  const handleSubmit = () => {
    if (!surveyData.location) {
      toast.error("Please enter the pub location.");
      return;
    }

    // Calculate overall rating (simplified algorithm)
    const scaleAvg = (surveyData.taste + surveyData.temperature + surveyData.creaminess) / 3;
    const checklistScore = [surveyData.twoPart, surveyData.settled, surveyData.tilted, surveyData.authentic].filter(Boolean).length;
    const headScore = surveyData.headSize;
    
    const overallRating = Math.min(5, Math.round((scaleAvg + checklistScore + headScore) / 3));

    navigate("/results", {
      state: {
        splitScore,
        splitImage,
        surveyData,
        overallRating,
        pintLogId,
      },
    });
  };

  const sliderLabels = {
    taste: { low: "Bath Water", high: "Arctic Crisp" },
    temperature: { low: "Lukewarm Swill", high: "Cellar Perfect" },
    creaminess: { low: "Flat Dishwater", high: "Velvet Dream" },
    headSize: { low: "Bald as a Coot", high: "Cloud Nine" },
  };

  return (
    <div className="min-h-screen bg-background pb-12">
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
          <h1 className="text-4xl font-playfair font-bold text-white mb-2 tracking-tight">
            Rate Your Guinness
          </h1>
          <p className="text-base text-muted-foreground">
            Comprehensive pint evaluation
          </p>
        </div>

        <div className="max-w-3xl mx-auto">

          <div className="bg-card border border-border rounded-lg p-8 space-y-8">
            {/* Slider Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">Taste Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-lg mb-3 block">
                    Taste: {surveyData.taste}/5
                  </Label>
                  <Slider
                    value={[surveyData.taste]}
                    onValueChange={([val]) => setSurveyData({ ...surveyData, taste: val })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span className="italic">{sliderLabels.taste.low}</span>
                    <span className="italic">{sliderLabels.taste.high}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-lg mb-3 block">
                    Temperature: {surveyData.temperature}/5
                  </Label>
                  <Slider
                    value={[surveyData.temperature]}
                    onValueChange={([val]) => setSurveyData({ ...surveyData, temperature: val })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span className="italic">{sliderLabels.temperature.low}</span>
                    <span className="italic">{sliderLabels.temperature.high}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-lg mb-3 block">
                    Creaminess: {surveyData.creaminess}/5
                  </Label>
                  <Slider
                    value={[surveyData.creaminess]}
                    onValueChange={([val]) => setSurveyData({ ...surveyData, creaminess: val })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span className="italic">{sliderLabels.creaminess.low}</span>
                    <span className="italic">{sliderLabels.creaminess.high}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pour Technique Checklist */}
            <div className="space-y-6 pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">Pour Technique</h2>
              
              <div className="space-y-4">
                {[
                  { key: "twoPart", label: "Two-part pour" },
                  { key: "settled", label: "Allowed to settle" },
                  { key: "tilted", label: "Glass tilted at 45° angle" },
                  { key: "authentic", label: "Authentic Guinness glass" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.key}
                      checked={surveyData[item.key as keyof typeof surveyData] as boolean}
                      onCheckedChange={(checked) =>
                        setSurveyData({ ...surveyData, [item.key]: checked })
                      }
                    />
                    <Label htmlFor={item.key} className="text-lg cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Head Size Slider */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">Head Quality</h2>
              <div>
                <Label className="text-lg mb-3 block">
                  Head Size: {surveyData.headSize}/5
                </Label>
                <Slider
                  value={[surveyData.headSize]}
                  onValueChange={([val]) => setSurveyData({ ...surveyData, headSize: val })}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span className="italic">{sliderLabels.headSize.low}</span>
                  <span className="italic">{sliderLabels.headSize.high}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-lg mb-2 block">
                    Price (optional)
                  </Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="e.g., €5.50"
                    value={surveyData.price}
                    onChange={(e) => setSurveyData({ ...surveyData, price: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-lg mb-2 block">
                    Pub Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., The Temple Bar, Dublin"
                    value={surveyData.location}
                    onChange={(e) => setSurveyData({ ...surveyData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full"
              >
                Complete Evaluation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PintSurvey;
