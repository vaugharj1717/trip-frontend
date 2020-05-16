import React, {useEffect, useState} from 'react';
import './SelectDestinationBox.css';
import Spinner from '../spinner/Spinner.js';
import {useSelector, useDispatch} from 'react-redux';
import {Action, startAutoCompleteSession, startAutoCompleting, clearGuesses, selectDestination, unselectDestination, createDestination} from '../actions.js'
import {debounce} from '../helpers.js';



let handleSearch;

function SelectDestinationBox(props){
    const isFirst = props.isFirst;
    const index = props.index;

    //global state info
    const currentTrip = useSelector(state => state.currentTrip);
    const selectedDestination = useSelector(state => state.selectedDestination);
    const googleToken = useSelector(state => state.googleToken);            //unique session token retrieved from server
    const gettingToken = useSelector(state => state.gettingGoogleToken);    //flag whether or not token is being retrieved
    const guesses = useSelector(state => state.guesses);                    //guesses returned from autocomplete google service
    const user = useSelector(state => state.user);
    const autocompleteLoading = useSelector(state => state.autocompleteLoading);

    const [text, setText] = useState("");
    const [isSelection, setIsSelection] = useState(false);
    const dispatch = useDispatch();

    //Handle when user selects a destination from dropdown of autocomplete guesses
    function handleSelect(id, name){
        setIsSelection(true);
        dispatch(selectDestination(id, name));
        setText(name);      //set input field to text of selected destination
    }

    //
    useEffect(() => {
        //debounced method to get autocomplete contents
        const doAutocomplete = debounce((text, googleToken) => {
            dispatch(unselectDestination);                    //User has typed again, so any user autocomplete selection is no longer valid
            if(text.length >= 3 && googleToken !== null){     //If we have session token and enough characters in input, get autocomplete guesses
                dispatch(startAutoCompleting(text, googleToken));
            }
            else{
                dispatch({type: Action.AutocompleteLoading, payload: false});   //no longer retrieving results
                dispatch(clearGuesses());                     //If no token or not enough characters in input, clear dropdown contents
            }
        }, 600, false);

        //handle user input into text field
        handleSearch = function handleSearch(text, googleToken){
            setText(text);
            if(text.length >= 3){
                dispatch({type: Action.AutocompleteLoading, payload: true});   //show user that results will start being retrieved
            } 
            setIsSelection(false);      //user has typed, any selection made is now invalid
            if(googleToken === null && gettingToken === false){     //if no google token has been acquired, get one
                dispatch(startAutoCompleteSession(user.id));
            }
            doAutocomplete(text, googleToken);                      //call autocomplete method
        }
    }, [dispatch, gettingToken, user]);

    //handle creation
    function handleCreate(index, token, tripid, placeid, name){
        dispatch(createDestination(index, token, tripid, placeid, name));
    }
    
    //If origin destination is being chosen
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
                    {autocompleteLoading &&
                    <div className="select-dest-spinner-container">
                        <Spinner small={true}/>
                    </div>
                    }
                    {isSelection &&
                    <button className="create-button" onClick={() => handleCreate(index, googleToken, currentTrip.id, selectedDestination.id, selectedDestination.name)}>Select</button>
                    }
                    {!isSelection &&
                    <button className="create-button-disabled" disabled>Select</button>
                    }
                </div>
            </div>
        </div>    
    )

    //if non-origin destination is being selected
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
                        
                    {autocompleteLoading &&
                    <div className="select-dest-spinner-container">
                        <Spinner small={true}/>
                    </div>
                    }
                    {isSelection &&
                    <button className="create-button" onClick={() => handleCreate(index, googleToken, currentTrip.id, selectedDestination.id, selectedDestination.name)}>Select</button>
                    }
                    {!isSelection &&
                    <button className="create-button-disabled" disabled>Select</button>
                    }
                </div>
            </div>
        </div>    
    )
    
}

export default SelectDestinationBox