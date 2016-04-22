import React from 'react';
import ApiLoader from './apiloader.jsx';
import $ from 'jquery';

export default class Weather extends React.Component {

  constructor() {
    super();
  }

  render() {
    let {location} = this.props;
    var color = "#00aaff";
    var url = 'http://forecast.io/embed/#lat=' + location.latlng.lat + '&lon=' + location.latlng.lng + '&name=' + location.location + '&color=' + color + '&units=' + this.props.unit;
    return (
      <iframe type='text/html' className="fe_container" height={this.props.height} width={this.props.width}
              frameBorder='0' src={url}/>
    );
  }
}

Weather.defaultProps = {width: '100%', height: 200, unit: 'si'};
