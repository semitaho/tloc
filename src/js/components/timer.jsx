import React from 'react';
import $ from 'jquery';
import Weather from './weather.jsx';

export default class Timer extends React.Component {

  constructor() {
    super();
    this.state ={elapsed: 0};
  }

  componentDidMount() {
    this.timer = setInterval(this.tick.bind(this), 100);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  tick() {
    this.setState({elapsed: this.state.elapsed + 100})
  }

  render() {

    return <div>{(this.state.elapsed / 1000).toFixed(1) } s</div>;

  }
}