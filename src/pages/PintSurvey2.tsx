import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import RatingSlider from "@/components/RatingSlider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { savePint, getPintById } from "@/utils/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Roast generation helper
const getRandomRoast = (rating: number): string => {
  const roastsByTier = {
    top: [
      "Found your local",
      "Tell no one about this place",
      "This pub gets it",
      "Marry the barman",
      "Certified haunt 🏠",
    ],
    solid: [
      "Decent spot",
      "Would drink again",
      "No complaints",
      "Gets the job done",
      "Safe bet 👍",
    ],
    mid: [
      "It's a pub",
      "Meh",
      "Nothing to write home about",
      "You've had better",
      "Mid tier establishment",
    ],
    rough: [
      "Questionable choices were made",
      "Why did you stay",
      "Tourist trap energy",
      "Your standards have dropped",
      "That's on you",
    ],
    bottom: [
      "Never again",
      "Report this establishment",
      "A crime scene",
      "Who recommended this",
      "Arthur weeps",
    ],
  };

  let tier: keyof typeof roastsByTier;
  if (rating >= 4.5) tier = "top";
  else if (rating >= 3.5) tier = "solid";
  else if (rating >= 2.5) tier = "mid";
  else if (rating >= 1.5) tier = "rough";
  else tier = "bottom";

  const roasts = roastsByTier[tier];
  return roasts[Math.floor(Math.random() * roasts.length)];
};

const PintSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { splitScore, splitImage, pintLogId } = location.state || {};

  const [taste, setTaste] = useState(3.0);
  const [temperature, setTemperature] = useState(3.0);
  const [head, setHead] = useState(3.0);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("€");
  const [pub, setPub] = useState("");

  const handleSubmit = async () => {
    if (!pub.trim()) {
      toast.error("Where'd you drink it?");
      return;
    }

    const overallRating = Math.round(((taste + temperature + head) / 3) * 10) / 10;
    const roast = getRandomRoast(overallRating);

    try {
      // Save to IndexedDB before navigating
      if (pintLogId) {
        // Update existing pint entry
        const existingPint = await getPintById(pintLogId);
        if (existingPint) {
          await savePint({
            ...existingPint,
            taste,
            temperature,
            creaminess: head, // Map 'head' to 'creaminess' in DB
            price: price ? parseFloat(price) : null,
            location: pub.trim(),
            overallRating,
            roast,
          });
        }
      } else {
        // Create new pint entry
        await savePint({
          id: Date.now(),
          date: new Date().toISOString(),
          splitScore: splitScore || 0,
          splitImage: splitImage || '',
          splitDetected: false,
          feedback: '',
          location: pub.trim(),
          overallRating,
          taste,
          temperature,
          creaminess: head, // Map 'head' to 'creaminess' in DB
          price: price ? parseFloat(price) : null,
          roast,
        });
      }

      toast.success("Rating locked in");

      // Navigate to log with receipt data (will show as modal)
      navigate("/log", {
        state: {
          splitScore,
          splitImage,
          overallRating,
          pub: pub.trim(),
          roast,
        },
      });
    } catch (error) {
      console.error('Failed to save pint:', error);
      toast.error("Failed to save rating. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-6 pb-8 md:px-8">
      <div className="md:max-w-[480px] md:mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-3 text-foreground hover:bg-muted -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="font-display text-[32px] font-bold text-foreground tracking-tight">
            How Was She?
          </h1>
          <p className="text-sm text-foreground/85 mt-1">
            Give us the dirt
          </p>
        </div>

        {/* Card Container - only on tablet/desktop */}
        <div className="md:bg-card md:border md:border-border md:rounded-xl md:p-6">
          {/* Rating Sliders */}
          <div className="space-y-10">
            <RatingSlider
              label="Taste"
              lowLabel="Drain Pour"
              highLabel="Liquid Gold"
              value={taste}
              onChange={setTaste}
            />

            <RatingSlider
              label="Temperature"
              lowLabel="Lukewarm Swill"
              highLabel="Cellar Perfect"
              value={temperature}
              onChange={setTemperature}
            />

            <RatingSlider
              label="Head"
              lowLabel="Bald as a Coot"
              highLabel="Cloud Nine"
              value={head}
              onChange={setHead}
            />
          </div>

          {/* Price Input */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-foreground">
              Price{" "}
              <span className="font-normal text-foreground/50">(optional)</span>
            </label>
            <div className="flex gap-2 mt-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-16 h-12 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="€">€</SelectItem>
                  <SelectItem value="£">£</SelectItem>
                  <SelectItem value="$">$</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 h-12 bg-card border-border text-foreground placeholder:text-foreground/30 text-base"
              />
            </div>
          </div>

          {/* Pub Location Input */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-foreground">
              Pub <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., The Temple Bar, Dublin"
              value={pub}
              onChange={(e) => setPub(e.target.value)}
              className="mt-2 h-12 bg-card border-border text-foreground placeholder:text-foreground/30 text-base"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-[52px] bg-foreground hover:bg-foreground/90 text-background font-semibold text-base rounded-lg mt-8 active:bg-foreground/80"
          >
            Lock It In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PintSurvey;