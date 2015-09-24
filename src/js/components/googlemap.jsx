import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js'
import geoStore from '../services/model.js';
import dispatcher from '../services/tlocDispatcher.js';
import mapStore from '../services/mapstore.js';
import geoService from '../services/geoservice.js';

export default class GoogleMap extends React.Component {
  constructor() {
    super();
    this.state = {marker: {}, direction: null};
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setOptions({draggable: false, suppressMarkers: false});


  }

  centerChanged(event) {
    if (event.latLng) {
      var latLng = {lat: event.latLng.H, lng: event.latLng.L};
      geoService.geocode(latLng, function (done) {
        dispatcher.dispatch({
          actionType: 'location-update',
          location: done.latlng,
          apiLocation: done.apiLocation,
          city: done.location
        });
      });

    }
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

  onMapCreated() {
    console.log('cukkoa');
    this.createCurrentMarker();


  }

  componentDidMount() {
    mapStore.addListener('map-created', this.onMapCreated.bind(this));

    dispatcher.dispatch({
      actionType: 'map-create'
    });
    console.log('did mount');
    console.log('latlng: ' + this.state.latlng);

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
      this.directionsRenderer.setMap(this.map);
      this.directionsRenderer.setDirections(nextProps.direction);
    } else {
      this.directionsRenderer.setMap(null);
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

  createCurrentMarker() {
    var marker = new MarkerWithLabel({
      position: dataModel.getLocation(), map: mapStore.getMap(),
      draggable: true,
      raiseOnDrag: false,
      labelAnchor: new google.maps.Point(15, 0),
      labelContent: '<b>You</b>'
    });

     marker.addListener('mouseup', function (event) {
     mapStore.getMap().setCenter(event.latLng);
     this.centerChanged(event);


     }.bind(this));


  }


}