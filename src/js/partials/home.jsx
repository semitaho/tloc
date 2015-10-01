import React from 'react';
import $ from 'jquery';
import Weather from '../components/weather.jsx';
var ReactComponent = React.Component;

export default class Home extends ReactComponent {

  render() {
    return <div>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <Weather />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">

          <div className="caption">

            <h1 className="text-center question">What do you want to do?</h1>
            <a href="#/eat" className="btn btn-lg btn-info btn-block">Go to eat</a>
            <a href="#/bar" className="btn btn-lg btn-info btn-block">Go to bar</a>
            <a href="#/car" className="btn btn-lg btn-info btn-block">Find a car dealership nearby</a>
            <a href="#/bicycle" className="btn btn-lg btn-info btn-block">Go to fix the bike</a>
          </div>
        </div>
      </div>
    </div>

  }


}