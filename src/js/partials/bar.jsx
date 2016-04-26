import React from 'react';
//import ga from 'react-google-analytics';
import {default as Interest, mapStateToProps} from './interest.jsx';
import {connect} from 'react-redux';

class Bar extends Interest {

  constructor() {
    super();
  }

  componentDidMount() {
    console.log('BAR - component did mount');
  }

}

Bar.defaultProps = {title: 'Go to have a drink somewhere', types: ['bar', 'night_club']};
export default connect(mapStateToProps)(Bar);