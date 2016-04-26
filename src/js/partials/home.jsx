import React from 'react';
import $ from 'jquery';
import Weather from '../components/weather.jsx';
import {connect} from 'react-redux'
import { Link, browserHistory } from 'react-router'

class Home extends React.Component {

  render() {
    let {weather} = this.props;
    return <div>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          {weather && weather.location && weather.location.latlng ? <Weather {...weather} /> : <div />}

        </div>
      </div>
      <div className="row">
        <div className="col-md-12">

          <div className="caption">

            <h1 className="text-center question">What do you want to do?</h1>
            <Link to="/eat" className="btn btn-lg btn-info btn-block">Go to eat</Link>
            <Link to="/bar" className="btn btn-lg btn-info btn-block">Go to bar</Link>
            <Link to="/interest/car" className="btn btn-lg btn-info btn-block">Find a car dealership nearby</Link>
            <Link to="/interest/bicycle" className="btn btn-lg btn-info btn-block">Go to fix the bike</Link>
          </div>
        </div>
      </div>
    </div>

  }

}
const mapStateToProps = (state) => {
  return {
    weather: {
      location: state.location
    }
  }

};

const HomeWrapper = connect(mapStateToProps)(Home);

export default HomeWrapper;