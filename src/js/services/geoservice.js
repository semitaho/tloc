const locationOpts = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
class GeoService {
  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  getApiLocation(results) {
    var apiLocation = '';
    results.forEach(result => {
      if (result.types.indexOf('locality') > -1) {
        apiLocation = result.formatted_address;
      }
    });
    return apiLocation;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(location => resolve({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }), null, locationOpts);
    });
  }

  geocode(latlng) {
    return new Promise((resolve) => {
      this.geocoder.geocode(
        {'location': latlng}, ((result, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            if (result[0]) {
              var location = result[0].formatted_address;
              var apiLocation = this.getApiLocation(result);
              resolve({location: location, apiLocation: apiLocation, latlng: latlng});
            }
          }

        }));
    });

  }
}
export default new GeoService();