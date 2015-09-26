var dispatcher = require('./tlocDispatcher.js');
import $ from 'jquery';
import BaseStore from './basemodel.js';
import geoStore from './model.js';
import geoService from '../services/geoservice.js';

class MapStore extends BaseStore {

  constructor() {
    super();
    var self = this;
    this.direction = null;
    dispatcher.register(payload => {
      if (payload.actionType === 'map-create') {
        dispatcher.waitFor([geoStore.getToken()]);
        self.map = new google.maps.Map(document.getElementById('map'), {
          center: geoStore.getLocation(),
          draggable: false,
          disableDefaultUI: true,
          zoom: 14,
          linksControl: false,
          scrollwheel: false,
          zoomControl: false
        });

        self.emitChange('map-created');
      } else if (payload.actionType === 'direction-update') {
        self.direction = payload.direction;
        self.emitChange('direction-updated');

      }
    });


  }

  getDirection() {
    return this.direction;
  }

  getMap() {
    return this.map;
  }

}

export default new MapStore();