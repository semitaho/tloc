import React from 'react';
import $ from 'jquery';
import Places from '../components/places.jsx';
import {Gmap} from 'tcomponents';
import {receiveLocationData} from './../actions/locationActions.js';
import {connect} from 'react-redux';

import {receiveDirection, fetchDirection, receiveMap} from './../actions/mapActions';
import {searchPlaces, fetchDetails, toggleDropdown, receiveSortByIndex} from './../actions/placesActions';
//import ga from 'react-google-analytics';

var ReactComponent = React.Component;

class Interest extends ReactComponent {


  render() {
    let {map, dispatch, places, types, title} = this.props;
    console.log('types', types);
    return <div>
      <h1 className="text-center answer page-header">{title}</h1>

      <div className="row">
        <div className="col-md-6 col-sm-12">

          <Gmap
            id="map"
            {...map}
            onMapCreated={map => {
              dispatch(receiveMap(map));
              dispatch(searchPlaces(types));

              }
            }
            onCenterChanged={() => dispatch(searchPlaces(types))}
            onMapClick={event => {
             let latLng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
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
              dispatch(fetchDetails(restaurant));
              if (!restaurant.details){
                dispatch(fetchDirection(restaurant));
              } else {
                dispatch(receiveDirection());
              }
            } }
          />

        </div>
      </div>
    </div>
  }

  componentDidMount() {
    console.log('INTEREST - DID MOUNT', this.props.types);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.types) !== JSON.stringify(this.props.types)) {
      this.refreshRoute(nextProps);
    }
  }

  componentWillUnmount() {
    console.log('UNMOUNT');
    let {types, dispatch} = this.props;
    dispatch(receiveMap(null));

  }


  refreshRoute(nextProps) {
    let {types, dispatch} = nextProps;
    dispatch(searchPlaces(types));
    dispatch(receiveDirection(null, null));

  }
}
/*
 const mapStateToProps = (state, props) => {
 let routeParams = {};

 switch (props.params.type) {
 case 'bicycle':
 routeParams = {title: 'Go to fix the bike', types: ['bicycle_store']};
 break;
 case 'car':
 routeParams = {title: 'Find a car dealership nearby', types: ['car_dealer', 'car_repair']};
 break;
 default:
 break;
 }
 let properties = Object.assign({}, {
 map: {
 marker: state.location.latlng,
 center: state.location.latlng,
 direction: state.map.direction
 },

 places: state.places
 }, routeParams);

 return properties;

 };
 */

export const mapStateToProps = state => {
  return {
    map: {
      marker: state.location.latlng,
      center: state.location.latlng,
      direction: state.map.direction
    },

    places: state.places
  };
};
export default Interest;