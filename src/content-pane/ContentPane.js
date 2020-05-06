import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import './ContentPane.css';
import Slider from '../slider/Slider.js';
import Display from '../display/Display.js';
import {actions} from '../actions.js';

function ContentPane(props){
    const destinations = useSelector(state => state.destinations);
    const currentDestination = useSelector(state => state.currentDestination);

    return(
        <div className="content-pane">
            <Slider destinations={destinations}/>
            <Display currentDestination={currentDestination}/>
        </div>
    )
}

export default ContentPane;