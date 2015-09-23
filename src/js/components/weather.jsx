import React from 'react';
import ApiLoader from './apiloader.jsx';
import $ from 'jquery';
import geoStore from '../services/model.js';

export default class Weather extends React.Component {
  constructor() {
    super();
    this.state = {location: null, city: null};
  }

  render() {
    if (this.state.location === undefined || this.state.location === null) {
      return <ApiLoader name="Weather"/>
    }

    var color = "#00aaff";
    var url = 'http://forecast.io/embed/#lat=' + this.state.location.lat + '&lon=' + this.state.location.lng + '&name=' + this.state.city + '&color=' + color + '&units=' + this.props.unit;
    return (
      <iframe type='text/html' className="fe_container" height={this.props.height} width={this.props.width}
              frameBorder='0' src={url}/>
    );
  }

  componentDidMount() {
    geoStore.addListener('location-update', this.onLocationChange.bind(this));

  }

  onLocationChange() {
    console.log('flux succeeded', geoStore.getLocation());
    this.setState({location: geoStore.getLocation(), city: geoStore.getApiLocation()});
  }
}

Weather.defaultProps = {width: '100%', height: 200, unit: 'si'};
