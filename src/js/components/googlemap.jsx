import React from 'react';
import $ from 'jquery';

export default class GoogleMap extends React.Component {
  constructor() {
    super();
    this.state = {marker: {}};

  }


  render() {
    console.log('googlemap - on render');
    return <div id="map"></div>
  }


  componentWillReceiveProps(nextProps) {
    this.clearMarker();
    this.createMarker(nextProps.marker.latlng, nextProps.marker.label, nextProps.marker.icon);

    if (nextProps.route && nextProps.route.length > 0) {
      this.drawRoute(nextProps.route);
    }

  }

  drawRoute(route) {
    var line = new google.maps.Polyline({path: route, strokeColor: '#FF0000'});
    line.setMap(this.map);
    var lastLoc = route[route.length - 1];
    this.map.setCenter(lastLoc);
    this.clearMarker();
    this.createMarker(lastLoc, 'Current');
  }

  componentDidMount() {
    var latlng = this.props.marker.latlng;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      zoom: 14,
      linksControl: false,
      scrollwheel: false,
      zoomControl: false
    });

    if (this.props.onready) {
      this.props.onready(this.map);
    }

    this.createMarker(latlng, this.props.marker.label, this.props.marker.icon);

  }



  clearMarker() {
    if (this.origin) {
      this.origin.setMap(null);
    }
  }

  createMarker(latlng, label, color) {
    if (this.origin) {

    }
    var infowindow = new google.maps.InfoWindow({
      content: '<h1>' + label + '</h1>'
    });
    var marker = new MarkerWithLabel({
      position: latlng, map: this.map,
      labelAnchor: new google.maps.Point(15, 0),
      labelContent: '<b>' + label + '</b>'
    });
    if (color !== undefined) {
      marker.setIcon(color);

    }
    this.origin = marker;
  }


}