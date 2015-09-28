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


  onMapCreated() {
    this.createCurrentMarker();


  }

  componentDidMount() {
    this.registerCallbacks();
    dispatcher.dispatch({
      actionType: 'map-create'
    });
    console.log('did mount');
  }

  registerCallbacks() {
    mapStore.addListener('map-created', this.onMapCreated.bind(this));
    mapStore.addListener('direction-updated', this.onDirectionUpdated.bind(this));
    dataModel.addListener('location-updated', this.onLocationUpdated.bind(this));

  }

  onDirectionUpdated() {
    var direction = mapStore.getDirection();
    if (direction !== undefined && direction !== null) {
      this.directionsRenderer.setMap(mapStore.getMap());
      this.directionsRenderer.setDirections(direction);
    } else {
      this.directionsRenderer.setMap(null);
    }
  }

  onLocationUpdated() {
    var direction = mapStore.getDirection();
    if (direction !== undefined && direction !== null) {
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
      mapStore.getMap().panTo(event.latLng);
      this.centerChanged(event);


    }.bind(this));


  }


}