import React, {useState} from 'react';
import './SliderNameplate.css';
import {useSelector, useDispatch} from 'react-redux';
import {toggleEditingTrips, startEditingTrip, startDeletingTrip} from '../actions.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash, faCaretLeft} from '@fortawesome/free-solid-svg-icons';

function SliderNameplate(props){
    const dispatch = useDispatch();
    const tripid = props.trip.id;
    const tripName = props.trip.name;
    const [name, setName] = useState(tripName);
    const isEditing = useSelector(state => state.isEditingTrip);
    
    function toggleEdit(){
        dispatch(toggleEditingTrips(!isEditing));
    }
    function onTripEdit(){
        dispatch(startEditingTrip(tripid, name));
    }

    function onTripDelete(){
        dispatch(startDeletingTrip(tripid));
    }

    return (
        <div className = "slider-nameplate">
        {isEditing && 
            <div className = "change-name-container">
                <input type="text" placeholder={tripName} maxLength={40} onChange={(e) => setName(e.target.value)}></input>
                <button className="cancel-button" onClick={toggleEdit}><FontAwesomeIcon icon={faCaretLeft}/></button>
                <button className="save-button" onClick={onTripEdit}><FontAwesomeIcon icon={faSave}/></button>
                <button className="delete-button" onClick={onTripDelete}><FontAwesomeIcon icon={faTrash}/></button>
            </div>
        }
        {!isEditing &&
            <div className = "show-name-container">
                <div className="trip-name">{tripName}</div>
                <button className="edit-name-button" onClick={toggleEdit}><FontAwesomeIcon icon={faEdit}/></button>
                
            </div>
        }
        </div>
    )
}

export default SliderNameplate