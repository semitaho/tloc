import React from 'react';
import $ from 'jquery';
var ReactComponent = React.Component;

export default class Location extends ReactComponent {

  render() {
    return <div><span>Your current location </span>
      <b>
        <a title="show in map" href="#" target="_blank">{this.props.data}
        </a>
      </b></div>
  }


}