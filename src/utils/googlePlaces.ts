import { Pub } from '../type/locals';

export interface FetchNearbyOptions {
  location: { lat: number; lng: number };
  radius: number; // meters
}

export async function fetchNearbyPlaces(
  options: FetchNearbyOptions
): Promise<Pub[]> {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is loaded
    if (!window.google?.maps?.places) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    // Create hidden div for PlacesService (required by API)
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv);
    const service = new google.maps.places.PlacesService(map);

    const request = {
      location: new google.maps.LatLng(options.location.lat, options.location.lng),
      radius: options.radius,
      keyword: 'bar pub restaurant' // Broad keyword, no type restriction
    };

    // Debug logging
    console.log('🍺 Fetching nearby pubs:', {
      location: options.location,
      radius: options.radius,
      radiusMiles: (options.radius / 1609.34).toFixed(1)
    });

    service.nearbySearch(request, (results, status) => {
      console.log('🍺 Google Places API response:', {
        status,
        resultCount: results?.length || 0,
        results: results?.slice(0, 5).map(p => ({ // Log first 5 for debugging
          name: p.name,
          types: p.types,
          vicinity: p.vicinity
        }))
      });

      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const pubs = results.map(transformGooglePlaceToPub);
        console.log(`✅ Returning ${pubs.length} nearby pubs`);
        resolve(pubs);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        console.log('⚠️ No nearby pubs found');
        resolve([]); // No nearby pubs - not an error
      } else {
        console.error('❌ Places API error:', status);
        reject(new Error(`Places API error: ${status}`));
      }
    });
  });
}

function transformGooglePlaceToPub(place: google.maps.places.PlaceResult): Pub {
  return {
    id: place.place_id || '',
    place_id: place.place_id || '',
    name: place.name || 'Unknown Pub',
    address: place.vicinity || '',
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
    // "Uncharted" state - no data yet
    topSplit: null,
    qualityRating: null,
    pintsLogged: 0,
    avgPrice: null,
    leaderboard: []
  };
}
