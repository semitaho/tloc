import React from 'react';
import $ from 'jquery';
var ReactComponent = React.Component;

export default class Home extends ReactComponent {

  render() {
    return <div className="caption">
      <h1 className="text-center question">What do you want to do?</h1>
      <a href="#/eat" className="btn btn-lg btn-info btn-block">Go to eat</a>
      <button type="button" className="btn btn-lg btn-info btn-block">Check your friends</button>

    </div>
  }


}