var dispatcher = require('./tlocDispatcher.js');
import $ from 'jquery';
import BaseStore from './basemodel.js';
import geoStore from './model.js';

class MapStore extends BaseStore {

  constructor() {
    super();
    var self = this;
    dispatcher.register(payload => {
      if (payload.actionType === 'map-create') {
        console.log('token', geoStore.getToken());
        dispatcher.waitFor([geoStore.getToken()]);
        console.log('jejejeee', geoStore.getLocation());

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
      }
    });


  }

  getMap() {
    return this.map;
  }

}

export default new MapStore();