import React from 'react';
import $ from 'jquery';
//import geoStore from '../services/model.js';
var ReactComponent = React.Component;

export default class Location extends ReactComponent {
  constructor() {
    super();
  }


  render() {
    return <div><span>Your current location </span>
      <b>
        <a title="show in map" href="#" target="_blank">{this.props.location}
        </a>
      </b></div>
  }

}