import React, {useEffect, useState} from 'react';
import './SelectDestinationBox.css';
import {startCreatingDestination, Action} from '../actions.js';
import {useSelector, useDispatch} from 'react-redux';
import {startAutoCompleteSession} from '../actions'
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';



const searchOptions = {
    type: ['(cites)'],
    fields: ["place_id", "name"],
}

function SelectDestinationBox(props){
    const isFirst = props.isFirst;
    const index = props.index;
    const currentTrip = useSelector(state => state.currentTrip);
    const googleToken = useSelector(state => state.googleToken);
    const user = useSelector(state => state.user);
    const gettingToken = useSelector(state => state.gettingGoogleToken);
    const [text, setText] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useDispatch();


    const handleSelect = async value => {
        setAddress(value);
        const address = await geocodeByAddress(value)
        const place_id = address[0].place_id;
        console.log(address);
    };

    function handleSearch(text){
        setText(text);
        console.log(`Token: ${googleToken}, GettingToken: ${gettingToken}`);
        if(googleToken === null && gettingToken === false){
            dispatch(startAutoCompleteSession(user.id));
        }
        //set timeout for token refresh
        const tokenSnapshot = googleToken;
        setTimeout(() => {
            if(tokenSnapshot !== null && tokenSnapshot === googleToken){
                dispatch(startAutoCompleteSession(user.id));
            }
        }, 1000 * 60 * 2);
        //debouce and query google API
    }

    function handleCreate(){

    }


    if (true) return(
        <div value={text}className="select-destination-box" onClick={(e)=>e.stopPropagation()}>
            <div className="stem stem-first">

            </div>
            <div className="box box-first">
                <input type="text" placeholder="Type destination" onChange={(e) => handleSearch(e.target.text)}></input>
                <button onClick={handleCreate}>Select</button>
            </div>
        </div>    
    )
    
}

export default SelectDestinationBox