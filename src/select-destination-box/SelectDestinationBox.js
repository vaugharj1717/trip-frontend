import React, {useEffect, useState} from 'react';
import './SelectDestinationBox.css';
import {startCreatingDestination} from '../actions.js';
import {useSelector, useDispatch} from 'react-redux';
import {} from '../actions'
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';



const searchOptions = {
    type: ['(cites)'],
    fields: ["place_id", "name"],
}

function SelectDestinationBox(props){
    const isFirst = props.isFirst;
    const index = props.index;
    const currentTrip = useSelector(state => state.currentTrip);
    const [address, setAddress] = useState("");
    const dispatch = useDispatch();


    const handleSelect = async value => {
        setAddress(value);
        const address = await geocodeByAddress(value)
        const place_id = address[0].place_id;
        console.log(address);
    };


    if (true) return(
        <div className="select-destination-box" onClick={(e)=>e.stopPropagation()}>
            <div className="stem stem-first">

            </div>
            <div className="box box-first">
                <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    searchOptions={searchOptions}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <input className="place-searcher" {...getInputProps({placeholder: "Type address"})}/>
                            <div>
                                {loading ? <div>Loading...</div> : null}
                                {suggestions.map((suggestion) => {
                                    const style = {
                                        backgroundColor: suggestion.active ? "#ffb4f9" : "#ffffff",
                                    }
                                    return <div className="suggestion" {...getSuggestionItemProps(suggestion, {style})}>{suggestion.description}</div>
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>

                
            </div>
        </div>    
    )
    
}

export default SelectDestinationBox