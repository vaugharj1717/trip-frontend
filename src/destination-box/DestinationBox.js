import React from 'react';
import {useDispatch} from 'react-redux';
import {startDeletingDestination, focusDestination} from '../actions.js'
import './DestinationBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function DestinationBox(props){
    const destination = props.destination;
    const dispatch = useDispatch();

    function handleDelete(id, dindex){
        dispatch(startDeletingDestination(id, dindex, destination.tripid));
    }

    function handleSelect(){
        dispatch(focusDestination(destination));
    }


    return(
        <div className="destination-box" onClick={()=> handleSelect()}>
            <button className="delete" onClick={(e) => {handleDelete(destination.id, destination.dindex, destination.tripid); e.stopPropagation()}}><FontAwesomeIcon color="white" icon={faTimes}/></button>
            <div className="destination-contents">
                <div className="destination-box-name">{destination.name}</div>
                <div className="destination-box-arrival">{destination.arrival.month}/{destination.arrival.day}/{destination.arrival.year} {destination.arrival.hour}:{destination.arrival.min} {destination.arrival.half}</div>
                {destination.dur !== null && destination.dist !== null && 
                <div>
                    <div className="dist">{destination.dur} ({destination.dist})</div>
                    <div className="durdist">To Next Destination</div>
                </div>
                }
                {(destination.dur === null || destination.dist === null) &&
                <div>
                    <div className="dist"></div>
                    <div className="durdist">Final Destination</div>
                </div>
                }
            </div>
        </div>
    )
}

export default DestinationBox;