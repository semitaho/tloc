import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import GoogleMap from '../components/googlemap.jsx';
import dispatcher  from '../services/tlocDispatcher.js';

var ReactComponent = React.Component;

export default class Eat extends ReactComponent {


  render() {
    return <div>
      <h1 className="text-center answer page-header">Go to eat</h1>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <GoogleMap />
        </div>
        <div className="col-md-6 col-sm-12 desc">
          <Places type="food"/>
        </div>
      </div>
    </div>
  }

  componentDidMount() {

  }


}