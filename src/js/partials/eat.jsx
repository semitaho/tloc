import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import {Gmap} from 'tcomponents';
import {receiveLocationData} from './../actions/locationActions.js';

import {receiveDirection, fetchDirection, receiveMap} from './../actions/mapActions';
import {searchPlaces, fetchDetails, toggleDropdown,receiveSortByIndex} from './../actions/placesActions';
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
            onMapCreated={map => dispatch(receiveMap(map))}
            onUpdated={(map) =>  dispatch(searchPlaces(['food', 'cafe']))}
            onMapClick={event => {
             let latLng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
             console.log('lat l', latLng);
             dispatch(receiveDirection(latLng, null));
             dispatch(receiveLocationData(event.latLng))
           
            }}
          />
        </div>
        <div className="col-md-6 col-sm-12 desc">

          <Places
            {...places}
            toggleDropdown={value => dispatch(toggleDropdown(value))}
            onSort={sortByIndex => dispatch(receiveSortByIndex(sortByIndex))}
            onItemClick={(restaurant) => {
            dispatch(fetchDirection(restaurant));
            dispatch(fetchDetails(restaurant))
            } }
          />

        </div>
      </div>
    </div>
  }

  componentWillMount() {

  }

  componentDidMount() {
    //   ga('send', 'pageview', {page: '/eat', title: 'Go to eat'});

  }

}

const mapStateToProps = (state) => {
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