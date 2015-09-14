import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js'

export default class GoogleMap extends React.Component {
  constructor() {
    super();
    this.state = {marker: {}};
    this.directionsRenderer = new google.maps.DirectionsRenderer();

  }


  render() {
    console.log('googlemap - on render');
    return <div id="map"></div>
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
    console.log('did mount');
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: dataModel.latlng,
      draggable: false,
      disableDefaultUI: true,
      zoom: 14,
      linksControl: false,
      scrollwheel: false,
      zoomControl: false
    });

    if (this.props.onready) {
      this.props.onready(this.map);
    }

    this.createCurrentMarker(dataModel.latlng, this.props.marker.label, this.props.marker.icon);
    this.directionsRenderer.setMap(this.map);

  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('will receive props');
    this.clearMarker();

    if (nextProps.marker && nextProps.marker.latlng) {
      this.origin = this.createMarker(nextProps.marker.latlng, nextProps.marker.label, nextProps.marker.icon);
    }
    console.log('directions', nextProps.direction);
    if (nextProps.direction && nextProps.direction !== undefined) {
      console.log('got directions...');
      this.directionsRenderer.setDirections(nextProps.direction);

    } else {
   //   this.directionsRenderer.setDirections(null);
    }
  }


  clearMarker() {
    if (this.origin) {
      this.origin.setMap(null);
    }
  }

  createMarker(latlng, label, color) {
    var infowindow = new google.maps.InfoWindow({
      content: '<h1>' + label + '</h1>'
    });
    var marker = new MarkerWithLabel({
      position: latlng, map: this.map,
      draggable: false,
      labelAnchor: new google.maps.Point(15, 0),
      labelContent: '<b>' + label + '</b>'
    });
    if (color !== undefined) {
      marker.setIcon(color);
    }
    return marker;
  }

  createCurrentMarker(latlng) {
    var marker = new MarkerWithLabel({
      position: latlng, map: this.map,
      draggable: true,
      labelAnchor: new google.maps.Point(15, 0),
      labelContent: '<b>You</b>'
    });
    marker.addListener('mouseup', function (event) {
      console.log('on mouse up', event);
      this.map.setCenter(event.latLng);
      if (this.props.centerChanged) {
        this.props.centerChanged(event);
      }


    }.bind(this));


  }


}