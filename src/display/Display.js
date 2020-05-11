import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {startSavingNote, startChangingDate} from '../actions.js';
import {debounce} from '../helpers.js';
import './Display.css';

let handleNoteChange;
let handleDateChange;

function Display(props){
    const dispatch = useDispatch();
    const destination = props.currentDestination;
    const showDestinationSelector = useSelector(state => state.showDestinationSelector);
    const initArrival = {month: "01", day: "01", year: "2020", hour: "12", min: "00", half: "AM"}
    const [arrival, setArrival] = useState(initArrival);
    if(destination && destination.arrival){
        setArrival(destination.arrival);
    }

    useEffect(() => {
        const doNoteSave = debounce((text, id, tripid) => {
            dispatch(startSavingNote(text, id, tripid));
        }, 1000, false);

        const doDateChange = debounce((day, month, year, hour, min, half) => {
            if(!(isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(min)) && (half.toUpperCase() === "PM" || half.toUpperCase() === "AM")){
                dispatch(startChangingDate(day, month, year, hour, min, half));
            }
        }
        , 500, false);

        handleNoteChange = function(text, id, tripid){
            doNoteSave(text, id, tripid);
        }

        handleDateChange = function(day, month, year, hour, min, half){
            doDateChange(day, month, year, hour, min, half);
        }
    }, []);

    if(!showDestinationSelector && destination) return(
        <div id="display" className="display">
            <div className="destination-name">{destination.name}</div>
            <div className="arrival">Arrival: 
            <div className="date">
                    <input type="text" maxLength={2} className="date-input" placeholder="01"></input>/
                    <input type="text" maxLength={2} className="date-input" placeholder="01"></input>/
                    <input type="text" maxLength={4} className="date-input year" placeholder="2020"></input>&nbsp;
                    <input type="text" maxLength={2} className="date-input" placeholder="01"></input>:
                    <input type="text" maxLength={2} className="date-input" placeholder="00"></input>&nbsp;
                    <input type="text" maxLength={2} className="date-input half" placeholder="PM"></input>
                </div>
            </div>
            <div  className="note-header">Notes</div>
            <textarea  rows="11"  cols="11" maxLength="500" background-attachment="local" className="note-box"></textarea>
        </div>
    )

    else if(destination) return(
        <div id="display" className="display-z">
            <div className="destination-name">{destination.name}</div>
            <div className="note-header">Notes</div>
            <textarea rows="11"  cols="11" maxLength="500" background-attachment="local" className="note-box"></textarea>
        </div>
    )

    else return(
        <div className="display-z"></div>
    )
}

export default Display;