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
      type: 'bar',
      keyword: 'pub guinness irish'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const pubs = results.map(transformGooglePlaceToPub);
        resolve(pubs);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]); // No nearby pubs - not an error
      } else {
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
