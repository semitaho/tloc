import React from 'react';
import ApiLoader from './apiloader.jsx';

export default class Weather extends React.Component{
  constructor() {
    super();
  }

  render(){
    if (this.props.data === undefined){
      return <ApiLoader name="Weather" />
    }

    var color= "#00aaff";
    var url = 'http://forecast.io/embed/#lat=' + this.props.data.latlng.lat + '&lon=' + this.props.data.latlng.lng + '&name=' + this.props.data.location + '&color=' + color + '&units=' + this.props.unit;
    return (
      <iframe type='text/html' className="fe_container" height={this.props.height} width={this.props.width} frameBorder='0' src={url} />
    );
  }
}

Weather.defaultProps = {width: '100%', height: 200, unit: 'si'};
