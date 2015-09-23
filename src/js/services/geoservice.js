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

  geocode(latlng, success) {
    var self = this;
    this.geocoder.geocode(
      {'location': latlng}, ((result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (result[0]) {
            var location = result[0].formatted_address;
            var apiLocation = self.getApiLocation(result);
            success({location: location, apiLocation: apiLocation, latlng: latlng});
          }
        }

      }));
  }
}
export default new GeoService();