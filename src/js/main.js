var React = require('react');
var app = require('./app.jsx');
var map = require('./components/googlemap.jsx');
//require('bootstrap');
React.render(React.createElement(app),document.getElementById('location'));
React.render(React.createElement(map),document.getElementById('mapsinterests'));