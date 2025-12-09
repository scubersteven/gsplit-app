import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import RatingSlider from "@/components/RatingSlider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { savePint, getPintById } from "@/utils/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlaceData {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// Fallback roast generation (client-side, if API fails)
const getRandomRoastFallback = (rating: number): string => {
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
  const { splitScore, splitImage, pintLogId, pub: pubFromState } = location.state || {};

  const [taste, setTaste] = useState(3.0);
  const [temperature, setTemperature] = useState(3.0);
  const [head, setHead] = useState(3.0);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("$");
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [isGeneratingRoast, setIsGeneratingRoast] = useState(false);

  // Check sessionStorage and location state for pub data on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if pub was passed from previous page
    if (pubFromState) {
      setSelectedPlace(pubFromState);
    } else {
      // Check sessionStorage for pub selected during upload flow
      const storedPub = sessionStorage.getItem('selectedPub');
      if (storedPub) {
        try {
          const pubData = JSON.parse(storedPub);
          setSelectedPlace(pubData);
        } catch (error) {
          console.error('Failed to parse stored pub data:', error);
        }
      }
    }
  }, [pubFromState]);

  // Generate roast via API (with fallback)
  const generateRoast = async (rating: number): Promise<string> => {
    try {
      const response = await fetch('https://g-split-judge-production.up.railway.app/generate-pub-roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          taste,
          temperature,
          head,
          pub: selectedPlace?.name || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result.roast;
    } catch (error) {
      console.error('Failed to generate roast from API, using fallback:', error);
      return getRandomRoastFallback(rating);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlace) {
      toast.error("Where'd you drink it?");
      return;
    }

    const overallRating = Math.round(((taste + temperature + head) / 3) * 10) / 10;

    // DETECTION: Check if G-Split flow or Survey-only
    // If pintLogId exists, it's updating an existing pint (G-Split)
    const isGSplitFlow = pintLogId || (typeof splitImage === 'string' && splitImage.length > 0);

    setIsGeneratingRoast(true);

    try {
      // BOTH flows generate roast (attention to detail!)
      const roast = await generateRoast(overallRating);

      // CONDITIONAL: Only G-Split flow saves to IndexedDB
      if (isGSplitFlow) {
        if (pintLogId) {
          // Update existing pint
          const existingPint = await getPintById(pintLogId);
          if (existingPint) {
            await savePint({
              ...existingPint,
              taste,
              temperature,
              creaminess: head,
              price: price ? parseFloat(price) : null,
              location: selectedPlace.name,
              place_id: selectedPlace.place_id,
              pub_name: selectedPlace.name,
              pub_address: selectedPlace.address,
              pub_lat: selectedPlace.lat,
              pub_lng: selectedPlace.lng,
              overallRating,
              roast,
            });
          }
        } else {
          // Create new pint (G-Split)
          await savePint({
            id: Date.now(),
            date: new Date().toISOString(),
            splitScore: splitScore || 0,
            splitImage: splitImage || '',
            splitDetected: false,
            feedback: '',
            location: selectedPlace.name,
            place_id: selectedPlace.place_id,
            pub_name: selectedPlace.name,
            pub_address: selectedPlace.address,
            pub_lat: selectedPlace.lat,
            pub_lng: selectedPlace.lng,
            overallRating,
            taste,
            temperature,
            creaminess: head,
            price: price ? parseFloat(price) : null,
            roast,
          });
        }
      }
      // Survey-only: NO savePint() call

      // Save rating to backend API (both G-Split and survey-only flows)
      try {
        // Generate anonymous ID if not exists
        let anonymousId = localStorage.getItem('anonymous_id');
        if (!anonymousId) {
          anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('anonymous_id', anonymousId);
        }

        // POST rating to backend
        const apiResponse = await fetch(
          `https://g-split-judge-production.up.railway.app/api/pubs/${selectedPlace.place_id}/ratings`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              overall_rating: overallRating,
              taste: taste,
              temperature: temperature,
              head: head,
              price: price ? parseFloat(price) : null,
              roast: roast,
              anonymous_id: anonymousId,
              pub_name: selectedPlace.name,
              pub_address: selectedPlace.address,
              pub_lat: selectedPlace.lat,
              pub_lng: selectedPlace.lng,
            })
          }
        );

        if (apiResponse.ok) {
          console.log("✅ Rating synced to backend");
        }
      } catch (error) {
        console.error('Failed to sync rating to backend:', error);
        // Don't block user flow
      }

      toast.success("Rating saved!");

      // Redirect to pub detail page if place_id exists and is valid, otherwise to log
      if (selectedPlace.place_id &&
          selectedPlace.place_id !== 'null' &&
          selectedPlace.place_id !== 'undefined' &&
          selectedPlace.place_id !== '') {
        // Construct proper Pub object from selectedPlace
        const pubObject = {
          id: selectedPlace.place_id,
          name: selectedPlace.name,
          address: selectedPlace.address,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
          topSplit: null,
          qualityRating: null,
          pintsLogged: 0,
          avgPrice: null,
          leaderboard: [],
        };

        navigate(`/locals/${selectedPlace.place_id}`, {
          state: {
            splitScore: isGSplitFlow ? splitScore : null,
            splitImage: isGSplitFlow ? splitImage : null,
            overallRating,
            pub: pubObject,
            roast,
            isSurveyOnly: !isGSplitFlow,
          },
        });
      } else {
        // Always redirect to /log if no valid place_id
        navigate("/log", {
          state: {
            splitScore: isGSplitFlow ? splitScore : null,
            splitImage: isGSplitFlow ? splitImage : null,
            overallRating,
            pub: selectedPlace.name,
            roast,
            isSurveyOnly: !isGSplitFlow,
          },
        });
      }
    } catch (error) {
      console.error('Failed to save pint:', error);
      toast.error("Failed to save rating. Please try again.");
    } finally {
      setIsGeneratingRoast(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-6 pb-8 md:px-8">
      <div className="md:max-w-[480px] md:mx-auto">
        {/* Header */}
        <div className="mb-3">
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
            <div className="mt-2">
              <PlacesAutocomplete
                value={selectedPlace?.name || ''}
                onChange={setSelectedPlace}
                placeholder="e.g., The Temple Bar, Dublin"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isGeneratingRoast}
            className="w-full h-[52px] bg-foreground hover:bg-foreground/90 text-background font-semibold text-base rounded-lg mt-8 active:bg-foreground/80"
          >
            {isGeneratingRoast ? "Brewing roast..." : "Lock It In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PintSurvey;