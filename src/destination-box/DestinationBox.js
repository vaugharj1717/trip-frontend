import React from 'react'
import './DestinationBox.css';

function DestinationBox(props){
    const destination = props.destination;

    return(
        <div className="destination-box">
            <div className="destination-box-name">{destination.name}</div>
        </div>
    )
}

export default DestinationBox;