import React from 'react';
import {useDispatch} from 'react-redux';
import {startDeletingDestination} from '../actions.js'
import './DestinationBox.css';

function DestinationBox(props){
    const destination = props.destination;
    const dispatch = useDispatch();

    function handleDelete(id, dindex){
        dispatch(startDeletingDestination(id, dindex, destination.tripid));
    }

    return(
        <div className="destination-box">
            <div className="destination-box-name">{destination.name}</div>
            <button onClick={() => handleDelete(destination.id, destination.dindex, destination.tripid)}>Delete</button>
            <div>{destination.dist} {destination.dur}</div>
        </div>
    )
}

export default DestinationBox;