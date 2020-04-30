import React, {useState} from 'react';
import './SliderNameplate.css';
import {useSelector, useDispatch} from 'react-redux';
import {toggleEditingTrips, startEditingTrip, startDeletingTrip} from '../actions.js'

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
                <input type="text" placeholder={tripName} onChange={(e) => setName(e.target.value)}></input>
                <button className="cancel-button" onClick={toggleEdit}>Cancel</button>
                <button className="delete-button" onClick={onTripDelete}>Delete</button>
                <button className="save-button" onClick={onTripEdit}>Save</button>
            </div>
        }
        {!isEditing &&
            <div className = "show-name-container">
                <div className="trip-name">{tripName}</div>
                <button className="edit-name-button" onClick={toggleEdit}>Edit</button>
                
            </div>
        }
        </div>
    )
}

export default SliderNameplate