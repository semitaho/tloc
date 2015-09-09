import React from 'react';

export default class ApiLoader extends React.Component {
    constructor(){
        super();
    }

    render(){
        return <div className="apiloader">Loading Api <strong>{this.props.name}</strong></div>;
    }

}
