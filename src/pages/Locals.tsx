import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PubCard from '../components/PubCard';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
import { MOCK_PUBS } from '../constants';
import { Pub } from '../type/locals';
import { requestUserLocation, calculateDistance } from '@/utils/geolocation';
import { fetchNearbyPlaces } from '../utils/googlePlaces';

interface PlaceData {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const Locals: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyGooglePubs, setNearbyGooglePubs] = useState<Pub[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

  // Request location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const coords = await requestUserLocation();
        setUserLocation(coords);
      } catch (error) {
        console.error('Failed to get user location:', error);
        setLocationError('Location access denied');
      }
    };

    getLocation();
  }, []);

  // Fetch pubs from API
  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch('https://g-split-judge-production.up.railway.app/api/pubs');
        if (!response.ok) {
          throw new Error('Failed to fetch pubs');
        }
        const data = await response.json();
        setPubs(data);
      } catch (error) {
        console.error('Failed to fetch pubs:', error);
        // Fallback to MOCK_PUBS if API fails
        setPubs(MOCK_PUBS);
      } finally {
        setLoading(false);
      }
    };

    fetchPubs();
  }, []);

  // Fetch nearby pubs from Google Places
  useEffect(() => {
    // Wait for user location and Google Maps to be loaded
    if (!userLocation || !window.google?.maps?.places) return;

    const fetchNearby = async () => {
      setLoadingNearby(true);
      try {
        const googlePubs = await fetchNearbyPlaces({
          location: userLocation,
          radius: 8047 // 5 miles in meters
        });
        setNearbyGooglePubs(googlePubs);
      } catch (error) {
        console.error('Failed to fetch nearby places:', error);
        // Don't show error to user - gracefully degrade to database pubs only
        setNearbyGooglePubs([]);
      } finally {
        setLoadingNearby(false);
      }
    };

    fetchNearby();
  }, [userLocation]);

  // Merge database pubs with Google Places results
  const mergedPubs = React.useMemo(() => {
    const pubMap = new Map<string, Pub>();

    // Priority 1: Database pubs (have real scores/ratings)
    pubs.forEach(pub => {
      pubMap.set(pub.place_id, pub);
    });

    // Priority 2: Google Places pubs (only if not already in database)
    nearbyGooglePubs.forEach(googlePub => {
      if (!pubMap.has(googlePub.place_id)) {
        pubMap.set(googlePub.place_id, googlePub);
      }
    });

    return Array.from(pubMap.values());
  }, [pubs, nearbyGooglePubs]);

  // Calculate distances for all pubs
  const pubsWithDistance = mergedPubs.map(pub => ({
    ...pub,
    distance: userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, pub.lat, pub.lng)
      : null,
  }));

  // Sort by distance (closest first)
  const sortedPubs = userLocation
    ? pubsWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    : pubsWithDistance;

  // Handle place selection
  const handlePlaceSelect = (place: PlaceData | null) => {
    setSelectedPlace(place);
  };

  // Apply place-based filter
  const filteredPubs = React.useMemo(() => {
    if (!selectedPlace) return sortedPubs;

    return sortedPubs.filter(pub =>
      pub.place_id === selectedPlace.place_id ||
      pub.name.toLowerCase().includes(selectedPlace.name.toLowerCase())
    );
  }, [sortedPubs, selectedPlace]);

  return (
    <div className="pb-32 px-4 pt-10 md:pt-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-2 text-center">
          The Local Hunt
        </h1>
        <p className="text-[#E8E8DD] text-sm mb-6 font-light tracking-wide text-center">Find where the black stuff flows best.</p>

        {/* Google Places Search Bar */}
        <div className="mb-8">
          <PlacesAutocomplete
            value={selectedPlace?.name || ''}
            onChange={handlePlaceSelect}
            placeholder="Search pubs"
          />
        </div>

        {/* Section Label */}
        <div className="flex items-center justify-between mb-6 px-1 mt-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#525252] font-bold">
            ROUND THE CORNER
          </div>
          <span className="text-[10px] text-[#525252] font-mono opacity-50">{filteredPubs.length} Nearby</span>
        </div>

        {/* List - Increased vertical gap */}
        <div className="space-y-6 text-left">
          {loading || loadingNearby ? (
            <div className="text-center py-10">
              <p className="text-[#9CA3AF] text-sm">
                {loadingNearby ? 'Finding nearby pubs...' : 'Loading...'}
              </p>
            </div>
          ) : filteredPubs.length > 0 ? (
            filteredPubs.map(pub => (
              <PubCard key={pub.place_id} pub={pub} />
            ))
          ) : (
             <div className="text-center py-20 px-4">
               <p className="text-[#9CA3AF] font-serif italic text-xl mb-2">Dry as a bone.</p>
               <p className="text-[#525252] text-xs uppercase tracking-wide">No pubs match your search.</p>
               <button
                 onClick={() => setSelectedPlace(null)}
                 className="mt-6 text-[#DDC9B4] text-sm hover:underline"
               >
                 Clear search
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locals;