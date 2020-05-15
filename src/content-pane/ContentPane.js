import React from 'react'
import {useSelector} from 'react-redux';
import './ContentPane.css';
import Slider from '../slider/Slider.js';
import Display from '../display/Display.js';

function ContentPane(){
    const currentTrip = useSelector(state => state.currentTrip);
    const destinations = useSelector(state => state.destinations);
    const currentDestination = useSelector(state => state.currentDestination);

    return(
        <div className="content-pane">
            <Slider destinations={destinations}/>
            <Display currentDestination={currentDestination} currentTrip={currentTrip}/>
        </div>
    )
}

export default ContentPane;