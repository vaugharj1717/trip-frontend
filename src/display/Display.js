import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import './Display.css';

function Display(props){
    const destination = props.currentDestination;
    let isPic;
    if(destination !== null) isPic = destination.fetchphotourl.match("nophoto") === null;
    else isPic = false;
    
    console.log(isPic);
    

    return(
        <div id="display" className="display">
            {destination !== null && isPic &&
            <img src={destination.fetchphotourl}></img>
            }
        </div>
    )
}

export default Display;