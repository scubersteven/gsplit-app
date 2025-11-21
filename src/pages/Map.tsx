import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 200px)",
};

const defaultCenter = {
  lat: 53.3498,
  lng: -6.2603, // Dublin, Ireland
};

interface Pub {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  rating: number;
  address: string;
}

const Map = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState(defaultCenter);
  const [apiKey, setApiKey] = useState("");
  const [initialApiKey, setInitialApiKey] = useState<string>("");
  const [selectedPub, setSelectedPub] = useState<Pub | null>(null);
  const [pubs, setPubs] = useState<Pub[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Only initialize loader if we have an API key set
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: initialApiKey,
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setInitialApiKey(apiKey);
      toast.success("API key set! Loading map...");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const searchNearbyPubs = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    
    const request = {
      location: center,
      radius: 5000,
      keyword: "pub bar guinness irish",
      type: "bar",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const pubsList: Pub[] = results.slice(0, 10).map((place, index) => ({
          id: place.place_id || `pub-${index}`,
          name: place.name || "Unknown Pub",
          position: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          },
          rating: place.rating || 0,
          address: place.vicinity || "",
        }));
        setPubs(pubsList);
      }
    });
  }, [center]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          toast.success("Location found!");
        },
        () => {
          toast.error("Unable to get your location");
        }
      );
    }
  }, []);

  // Show map only if API key is set and loaded
  const showMap = initialApiKey && isLoaded;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Find the Best Guinness Near You
        </h1>
        <p className="text-base text-muted-foreground">
          Discover top-rated pubs and bars serving proper pints
        </p>
      </div>

      {!initialApiKey && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-3">
            Enter Your Google Maps API Key
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            To use the map features, you'll need a Google Maps API key.{" "}
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success hover:underline"
            >
              Get your free API key here
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your Google Maps API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApiKeySubmit()}
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit} className="gap-2">
              <Search className="w-4 h-4" />
              Load Map
            </Button>
          </div>
        </div>
      )}

      {!showMap && initialApiKey && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="text-center text-muted-foreground">Loading map...</div>
        </div>
      )}

      {showMap && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Use My Location
            </Button>
            <Button
              variant="outline"
              onClick={searchNearbyPubs}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Search Pubs
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border border-border">
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry",
                  stylers: [{ color: "#1a1a1a" }],
                },
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#e6d5bd" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#0f0f0f" }],
                },
              ],
            }}
          >
            {pubs.map((pub) => (
              <Marker
                key={pub.id}
                position={pub.position}
                onClick={() => setSelectedPub(pub)}
              />
            ))}

            {selectedPub && (
              <InfoWindow
                position={selectedPub.position}
                onCloseClick={() => setSelectedPub(null)}
              >
                <div className="p-2 bg-card text-foreground">
                  <h3 className="font-bold mb-1">{selectedPub.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm">{selectedPub.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedPub.address}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          </div>

          {pubs.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success" />
              Nearby Pubs ({pubs.length})
            </h3>
            <div className="space-y-3">
              {pubs.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => setSelectedPub(pub)}
                >
                  <div>
                    <h4 className="font-medium text-foreground">{pub.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {pub.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-medium">{pub.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Map;
