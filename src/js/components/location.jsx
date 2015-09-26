import React from 'react';
import $ from 'jquery';
import geoStore from '../services/model.js';
var ReactComponent = React.Component;

export default class Location extends ReactComponent {

  constructor() {
    super();
    this.onApiLocation = this.onApiLocation.bind(this);
    this.state = {data: ''};

  }

  onApiLocation() {
    console.log('on api location', geoStore.getApiLocation());
    this.setState({data: geoStore.getCity()});
  }

  render() {
    return <div><span>Your current location </span>
      <b>
        <a title="show in map" href="#" target="_blank">{this.state.data}
        </a>
      </b></div>
  }

  componentDidMount() {
    geoStore.addListener('location-updated', this.onApiLocation.bind(this));

  }


}