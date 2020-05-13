import React, {useEffect, useState} from 'react';
import './SelectDestinationBox.css';
import {useSelector, useDispatch} from 'react-redux';
import {startAutoCompleteSession, startAutoCompleting, clearGuesses, selectDestination, unselectDestination, createDestination} from '../actions.js'
import {debounce} from '../helpers.js';



let handleSearch;

function SelectDestinationBox(props){
    const isFirst = props.isFirst;
    const index = props.index;
    const currentTrip = useSelector(state => state.currentTrip);
    const selectedDestination = useSelector(state => state.selectedDestination);
    const googleToken = useSelector(state => state.googleToken);
    const user = useSelector(state => state.user);
    const gettingToken = useSelector(state => state.gettingGoogleToken);
    const guesses = useSelector(state => state.guesses);
    const [text, setText] = useState("");
    const [isSelection, setIsSelection] = useState(false);
    const dispatch = useDispatch();

    function handleSelect(id, name){
        setIsSelection(true);
        dispatch(selectDestination(id, name));
        setText(name);
    }

    useEffect(() => {
        const doAutocomplete = debounce((text, googleToken) => {
            dispatch(unselectDestination);
            if(text.length >= 3 && googleToken !== null){
                dispatch(startAutoCompleting(text, googleToken));
            }
            else{
                dispatch(clearGuesses());
            }
        }, 1000, false);

        handleSearch = function handleSearch(text, googleToken){
            setText(text);
            setIsSelection(false);
            if(googleToken === null && gettingToken === false){
                dispatch(startAutoCompleteSession(user.id));
            }
            doAutocomplete(text, googleToken);
        }
    }, []);

    function handleCreate(index, token, tripid, placeid, name){
        dispatch(createDestination(index, token, tripid, placeid, name));
    }
    



    if (!isFirst) return(
        <div className="select-destination-box" onClick={(e)=>e.stopPropagation()}>
            <div className="stem">
                <div className="box">
                    <input value={text} className="autocomplete-textbox" type="text" placeholder="Type destination" onChange={(e) => handleSearch(e.target.value, googleToken)}>
                    </input>
                    <div className="autocomplete-guess-container">
                        {!isSelection && guesses.map(guess => 
                            <div key={guess.id} className="autocomplete-guess" onClick={()=>handleSelect(guess.id, guess.name)}>{guess.name}</div>
                        )}
                        </div>
                    {isSelection &&
                    <button className="create-button" onClick={() => handleCreate(index, googleToken, currentTrip.id, selectedDestination.id, selectedDestination.name)}>Select</button>
                    }
                    {!isSelection &&
                    <button className="create-button" disabled>Select</button>
                    }
                </div>
            </div>
        </div>    
    )
    else return(
        <div className="select-destination-box-first" onClick={(e)=>e.stopPropagation()}>
            <div className="stem-first">
                <div className="box-first">
                    <input value={text} className="autocomplete-textbox" type="text" placeholder="Type destination" onChange={(e) => handleSearch(e.target.value, googleToken)}>
                    </input>
                    <div className="autocomplete-guess-container">
                        {!isSelection && guesses.map(guess => 
                            <div key={guess.id} className="autocomplete-guess" onClick={()=>handleSelect(guess.id, guess.name)}>{guess.name}</div>
                        )}
                        </div>
                    {isSelection &&
                    <button className="create-button" onClick={() => handleCreate(index, googleToken, currentTrip.id, selectedDestination.id, selectedDestination.name)}>Select</button>
                    }
                    {!isSelection &&
                    <button className="create-button" disabled>Select</button>
                    }
                </div>
            </div>
        </div>    
    )
    
}

export default SelectDestinationBox