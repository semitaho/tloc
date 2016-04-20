import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import {Gmap} from 'tcomponents';
import {fetchDirection} from './../actions/mapActions';
import {searchPlaces, fetchDetails} from './../actions/placesActions';
//import ga from 'react-google-analytics';
import {connect} from 'react-redux';

var ReactComponent = React.Component;

class Eat extends ReactComponent {


  render() {
    let {map, dispatch, places} = this.props;
    return <div>
      <h1 className="text-center answer page-header">Go to eat</h1>

      <div className="row">
        <div className="col-md-6 col-sm-12">

          <Gmap
            id="map"
            {...map}
            onUpdated={(map) =>  dispatch(searchPlaces(map, ['food', 'cafe']))}
          />
        </div>
        <div className="col-md-6 col-sm-12 desc">

          <Places
            {...places}
            onItemClick={(restaurant, index) => dispatch(fetchDirection(restaurant)) }
          />

        </div>
      </div>
    </div>
  }

  componentWillMount() {
    console.log('kokeillaas...');

  }

  componentDidMount() {
    //   ga('send', 'pageview', {page: '/eat', title: 'Go to eat'});

  }

}

const mapStateToProps = (state) => {
  console.log('state', state);
  return {
    map: {
      marker: state.location.latlng,
      center: state.location.latlng,
      direction: state.map.direction
    },

    places: state.places
  };

};

export default connect(mapStateToProps)(Eat);