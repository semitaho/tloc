import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import GoogleMap from '../components/googlemap.jsx';
import dispatcher  from '../services/tlocDispatcher.js';

var ReactComponent = React.Component;

export default class Car extends ReactComponent {


  render() {
    return <div>
      <h1 className="text-center answer page-header">Find a car dealership nearby</h1>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <GoogleMap />
        </div>
        <div className="col-md-6 col-sm-12 desc">
          <Places type={['car_dealer','car_repair']}/>
        </div>
      </div>
    </div>
  }

  componentDidMount() {
    ga('send', 'pageview', '/car');
  }
}
