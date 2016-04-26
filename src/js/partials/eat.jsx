import React from 'react';
import {connect} from 'react-redux';
import {default as Interest, mapStateToProps} from './interest.jsx';

class Eat extends Interest {
  constructor() {
    super();
  }
}
Eat.defaultProps = {title: 'Go to eat', types: ['food', 'cafe']};
export default connect(mapStateToProps)(Eat);