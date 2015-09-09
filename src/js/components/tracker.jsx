/**
 * Created by taho on 18.8.2015.
 */
import React from 'react';
import $ from 'jquery';
import Weather from './weather.jsx';
var ReactComponent = React.Component;

export default class Tracker extends React.Component {


  constructor() {
    super();
    this.onNewPosition = this.onNewPosition.bind(this);
    this.onError = this.onError.bind(this);
    this.onSuccessGeocoder = this.onSuccessGeocoder.bind(this);
    this.state = {coords: {}}
    this.geoOptions = {enableHighAccuracy: true};
    this.apiKey = 'ef4a3DUIqVmshrkjhj6Q4N3nqMWfp1cHSWcjsnlvYb0lWbHPUE';
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.onNewPosition, this.onError, this.geoOptions);
    }

  }

  onNewPosition(location) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
    this.setState({latlng: latlng});

    geocoder.geocode(
      {'location': latlng}, this.onSuccessGeocoder);

  }



  onError(error) {
    this.setState({error: true});
  }

  getApiLocation(results) {
    var apiLocation = '';
    results.forEach(function (result) {
      if (result.types.indexOf('locality') > -1) {
        apiLocation = result.formatted_address;
      }

    });
    return apiLocation;

  }

  onSuccessGeocoder(result, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (result[0]) {
        var location = result[0].formatted_address;
        var apiLocation = this.getApiLocation(result);

        this.setState({location: location, apilocation: apiLocation});
      }
    }
  }

  render() {
    if (this.state.error) {
      return <div className="row tracker horizontal-center">
        <div className="col-md-12">Tracking not available</div>
      </div>
    } else if (this.state.location && this.state.latlng) {
      var propsData = {latlng: this.state.latlng, location: this.state.apilocation};
      var data = <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <span>Your current location </span>
              <b>
                <a title="show in map" href="#" target="_blank">{this.state.location}
                </a>
              </b>

            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <Weather data={propsData}/>

            </div>
          </div>
        </div>
      </div>;
      return data;
    } else {
      return <div />
    }

  }
}
