export default class BaseStore {
  constructor() {
    this.listeners = {};

  }

  addListener(EVENT, listener) {
    if (!this.listeners[EVENT]) {
      this.listeners[EVENT] = [];
    }
    this.listeners[EVENT].push(listener);
  }


  emitChange(EVENT) {
    if (!this.listeners[EVENT]) {
      throw 'Event not registered: ' + EVENT;
    }
    console.log('event', this.listeners[EVENT]);

    this.listeners[EVENT].forEach(cb => cb.apply());


  }

}