import React, { useRef, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

interface PlaceData {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (place: PlaceData | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search for a pub...",
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '',
    libraries
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize autocomplete with bar/restaurant focus
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['bar', 'restaurant', 'night_club', 'cafe'],
        fields: ['place_id', 'name', 'formatted_address', 'geometry']
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.place_id && place.geometry?.location) {
          const placeData: PlaceData = {
            place_id: place.place_id,
            name: place.name || '',
            address: place.formatted_address || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          setInputValue(place.name || '');
          onChange(placeData);
        }
      });
    }
  }, [isLoaded, onChange]);

  // Sync value prop to inputValue state when value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear selection if user modifies the input
    if (newValue !== value) {
      onChange(null);
    }
  };

  if (loadError) {
    return (
      <div className="w-full bg-[#121212] border border-red-500 text-red-500 text-sm rounded-lg py-4 px-4">
        Error loading Google Places API
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-[#121212] border border-[#2a2a2a] text-[#525252] text-base rounded-lg py-4 px-4">
        Loading...
      </div>
    );
  }

  if (!import.meta.env.VITE_GOOGLE_PLACES_API_KEY) {
    return (
      <div className="w-full bg-[#121212] border border-yellow-500 text-yellow-500 text-sm rounded-lg py-4 px-4">
        Google Places API key not configured
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#525252] group-focus-within:text-[#DDC9B4] transition-colors duration-300">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent border-b border-[#2a2a2a] text-[#DDC9B4] text-base py-3 pl-8 pr-4 placeholder-[#525252] focus:outline-none focus:border-[#DDC9B4] transition-all duration-300 rounded-none"
      />
    </div>
  );
};

export default PlacesAutocomplete;
