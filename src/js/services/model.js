var dispatcher = require('./tlocDispatcher.js');
import $ from 'jquery';
import BaseStore from './basemodel.js';
let dataModel = null;


class DataModel extends BaseStore {

  constructor() {
    super();

    var self = this;
    self.dispatchToken = dispatcher.register(payload => {
      if (payload.actionType === 'location-update') {
        console.log('location changed...');
        self.location = payload.location;
        self.apiLocation = payload.apiLocation;
        self.city = payload.city;
        self.emitChange('location-update');
      }

    });
  }

  getLocation() {
    return this.location;
  }

  getCity() {
    return this.city;
  }

  getToken(){
    return this.dispatchToken;
  }

  getApiLocation() {
    return this.apiLocation;
  }


}


export default new DataModel();

