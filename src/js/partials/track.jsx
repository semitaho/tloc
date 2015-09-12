import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js';
import GoogleMap from '../components/googlemap.jsx';
import Timer from '../components/timer.jsx';

var ReactComponent = React.Component;

export default class Track extends ReactComponent {

  constructor() {
    super();
    this.state = {tracking: false, route: [], distance: 0.0};
  }

  render() {
    var button = <button className="btn btn-block btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Start
      tracking</button>;
    var panel = '';
    if (this.state.tracking) {
      button = <button className="btn btn-block btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Stop
        tracking</button>;
      panel = <div className="panel">
        <div className="panel-body">
          <div className="list-group-item-text">current: {this.state.distance.fixed(2)} km</div>
          <div className="list-group-item-text">tracking time: <Timer /></div>
        </div>
      </div>;

    }

    return <div className="text-center">
      <div className="page-header">
        <h1>Track your route</h1>
      </div>
      {button}
      <GoogleMap marker={{latlng: dataModel.latlng, label: "Start"}} route={this.state.route}/>
      {panel}
    </div>

  }

  handleClick(event) {
    if (this.state.tracking) {
      this.setState({tracking: false});
      navigator.geolocation.clearWatch(this.watcher);
    } else {
      this.setState({tracking: true});
      this.watcher = navigator.geolocation.watchPosition(this.onNewPosition.bind(this), undefined, this.props.geOptions);

    }
  }

  onNewPosition(pos) {
    var position = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    var currentRoute = this.state.route;
    currentRoute.push(position);
    var distance = this.calculateDistance(currentRoute);

    this.setState({distance: distance, route: currentRoute});

  }

  calculateDistance(route) {
    var latLngRoute = route.map(latlng => {
      return new google.maps.LatLng(latlng.lat, latlng.lng);
    });
    var length = google.maps.geometry.spherical.computeLength(latLngRoute);
    return length;

  }

}

Track.defaultProps = {geoOptions: {enableHighAccuracy: true}};