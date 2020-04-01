const mockPromiseResponse = jest.fn().mockReturnValue({
  asPromise: jest.fn().mockResolvedValue({})
});

export const GMapClient = {
  directions: mockPromiseResponse,
  distanceMatrix: mockPromiseResponse,
  elevation: mockPromiseResponse,
  elevationAlongPath: mockPromiseResponse,
  findPlace: mockPromiseResponse,
  geocode: mockPromiseResponse,
  reverseGeocode: mockPromiseResponse,
  geolocate: mockPromiseResponse,
  nearestRoads: mockPromiseResponse,
  place: mockPromiseResponse,
  places: mockPromiseResponse,
  placesAutoComplete: mockPromiseResponse,
  placesNearby: mockPromiseResponse,
  plaplacesPhotoes: mockPromiseResponse,
  placesQueryAutoComplete: mockPromiseResponse,
  snappedSpeedLimits: mockPromiseResponse,
  snapToRoads: mockPromiseResponse,
  speedLimits: mockPromiseResponse
};
