import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import './Display.css';

function Display(props){
    const google = useSelector(state => state.google);
    const mapLoaded = useSelector(state => state.mapLoaded);

    useEffect(() => {
        let map;
        if(mapLoaded){
            console.log(mapLoaded);
            map = new google.maps.Map(document.getElementById("display"), {center: {lat: -34.397, lng: 150.644}, zoom: 8});
        }
    }, [mapLoaded]);

    return(
        <div id="display" className="display">
        </div>
    )
}

export default Display;