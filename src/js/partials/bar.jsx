import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import GoogleMap from '../components/googlemap.jsx';
import ga from 'react-google-analytics';

var ReactComponent = React.Component;

export default class Eat extends ReactComponent {


  render() {
    return <div>
      <h1 className="text-center answer page-header">Go to have a drink somewhere</h1>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <GoogleMap />
        </div>
        <div className="col-md-6 col-sm-12 desc">
          <Places type={['bar','night_club']}/>
        </div>
      </div>
    </div>
  }

  componentDidMount() {
    ga('send', 'pageview', {page: '/bar', title: 'Go to have a drink somewhere'});

  }


}