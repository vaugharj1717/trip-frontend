import React from 'react';
import {useDispatch} from 'react-redux';
import {startDeletingDestination, focusDestination} from '../actions.js'
import './DestinationBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function DestinationBox(props){
    const destination = props.destination;
    const i = props.i;
    const dispatch = useDispatch();

    function handleDelete(id, dindex){
        dispatch(startDeletingDestination(id, dindex, destination.tripid));
    }

    function handleSelect(){
        dispatch(focusDestination(destination));
    }


    return(
        <div className="destination-box" onClick={()=> handleSelect()}>
            <button className="delete" onClick={
                    (e) => {handleDelete(destination.id, destination.dindex, destination.tripid); e.stopPropagation()}}>
                <FontAwesomeIcon color="white" icon={faTimes}/>
            </button>

            <div className="destination-contents">
                <div className="destination-box-name">{destination.name}</div>

                {i !== 0 &&     //If this is first destination, don't show arrival
                <div className="destination-box-arrival">
                    Arrival:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {destination.arrival.month}/{destination.arrival.day}/{destination.arrival.year} &nbsp;{destination.arrival.hour}:{destination.arrival.min} {destination.arrival.half}
                </div>
                }
                <div className={i !== 0 ? "destination-box-departure" : "destination-box-departure-first"}>
                    Departure:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {destination.departure.month}/{destination.departure.day}/{destination.departure.year} &nbsp;{destination.departure.hour}:{destination.departure.min} {destination.departure.half}
                </div>

                
                {destination.dur !== null && destination.dist !== null &&       //If there is a duration/distance to next destination, display it
                <div>
                    <div className="dist">{destination.dist} ({destination.dur})</div>
                    <div className="durdist">To Next Destination</div>
                </div>

                }
                {(destination.dur === null || destination.dist === null) &&     //If there is no duration/distance to next, it is last destination
                <div>
                    <div className="dist"></div>
                    {(i !== 0) &&
                        <div className="durdist">Final Destination</div>
                    } 
                </div>
                }
            </div>
        </div>
    )
}

export default DestinationBox;