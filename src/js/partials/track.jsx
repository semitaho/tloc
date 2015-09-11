import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js';
import GoogleMap from '../components/googlemap.jsx';
var ReactComponent = React.Component;

export default class Track extends ReactComponent {

  constructor() {
    super();
    this.state = {tracking: false, route: []};
  }

  render() {
    var button = <button className="btn btn-block btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Start tracking</button>;
    if (this.state.tracking) {
      button = <button className="btn btn-block btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Stop tracking</button>;
    }
    return <div className="text-center">
      <div className="page-header">
        <h1>Track your route</h1>
        <GoogleMap marker={{latlng: dataModel.latlng, label: "Start"}} route={this.state.route}/>
        {button}
      </div>
    </div>
  }

  handleClick(event) {
    if (this.state.tracking) {
      this.setState({tracking: false});
      navigator.geolocation.clearWatch(this.watcher);
    } else {
      this.setState({tracking: true});
      this.watcher = navigator.geolocation.watchPosition(this.onNewPosition.bind(this),undefined, this.props.geOptions);

    }
  }

  onNewPosition(pos) {
    console.log('on new pos', pos);
    var position = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    var currentRoute = this.state.route;
    currentRoute.push(position);
    this.setState({route: currentRoute});

  }

}

Track.defaultProps = {geoOptions: {enableHighAccuracy: true}};