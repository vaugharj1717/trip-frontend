import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import './ContentPane.css';
import Slider from '../slider/Slider.js';
import Display from '../display/Display.js';
import { setShowDestinationSelector } from '../actions';

function ContentPane(){
    const dispatch = useDispatch();
    const currentTrip = useSelector(state => state.currentTrip);
    const destinations = useSelector(state => state.destinations);
    const currentDestination = useSelector(state => state.currentDestination);

    function handleClick(){
        console.log("Content pane clicked");
        dispatch(setShowDestinationSelector(false));
    }

    return(
        <div className="content-pane" onClick={handleClick}>
            <Slider destinations={destinations}/>
            <Display currentDestination={currentDestination} currentTrip={currentTrip}/>
        </div>
    )
}

export default ContentPane;