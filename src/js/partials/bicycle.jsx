import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
var ReactComponent = React.Component;

export default class Eat extends ReactComponent {


  render() {
    return <div>
      <h1 className="text-center answer page-header">Go to fix the bike</h1>
      <Places type="bicycle_store"/>
    </div>
  }


}