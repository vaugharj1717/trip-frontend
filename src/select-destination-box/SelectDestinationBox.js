import React, {useEffect, useState} from 'react';
import './SelectDestinationBox.css';
import {useSelector, useDispatch} from 'react-redux';
import {startAutoCompleteSession, startAutoCompleting, clearGuesses} from '../actions.js'
import {debounce} from '../helpers.js';



let handleSearch;

function SelectDestinationBox(props){
    const isFirst = props.isFirst;
    const index = props.index;
    const currentTrip = useSelector(state => state.currentTrip);
    const googleToken = useSelector(state => state.googleToken);
    const user = useSelector(state => state.user);
    const gettingToken = useSelector(state => state.gettingGoogleToken);
    const guesses = useSelector(state => state.guesses);
    const [text, setText] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useDispatch();
    console.log(`Token: ${googleToken}, GettingToken: ${gettingToken}`);


    const handleSelect = async value => {
       
    };

    useEffect(() => {
        const doAutocomplete = debounce((text, googleToken) => {
            if(text.length >= 3 && googleToken !== null){
                dispatch(startAutoCompleting(text, googleToken));
            }
            else{
                dispatch(clearGuesses());
            }
        }, 1000, false);

        handleSearch = function handleSearch(text, googleToken){
            setText(text);
            if(googleToken === null && gettingToken === false){
                dispatch(startAutoCompleteSession(user.id));
            }
            doAutocomplete(text, googleToken);
        }
    }, []);
    

    function handleCreate(){

    }


    if (true) return(
        <div value={text}className="select-destination-box" onClick={(e)=>e.stopPropagation()}>
            <div className="stem stem-first">

            </div>
            <div className="box box-first">
                <input className="autocomplete-textbox" type="text" placeholder="Type destination" onChange={(e) => handleSearch(e.target.value, googleToken)}>
                </input>
                <div className="autocomplete-guess-container">
                    {guesses.map(guess => 
                        <div key={guess.id} className="autocomplete-guess" onClick={()=>handleSelect(guess.id, guess.name)}>{guess.name}</div>
                    )}
                    </div>
                <button onClick={handleCreate}>Select</button>
            </div>
        </div>    
    )
    
}

export default SelectDestinationBox