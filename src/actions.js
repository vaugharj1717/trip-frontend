export const Action = Object.freeze({
    //Navigation
    DoDropdown: "DoDropdown",
    StopDropdown: "StopDrodown",
    GoToRegistration: "GoToRegistration",
    GoToMainPage: "GoToMainPage",
    GoToLogin: "GoToLogin",

    //Loading
    LoginLoading: "LoginLoading",
    RegisterLoading: "RegisterLoading",
    TripLoading: "TripLoading",
    DateLoading: "DateLoading",
    NoteLoading: "NoteLoading",
    DestinationLoading: "DestinationLoading",
    ShowDestinationSelect: "ShowDestinationSelect",
    HideDestinationSelect: "HideDestinationSelect",
    AutocompleteLoading: "AutocompleteLoading",

    //User
    FinishLoggingIn: "FinishLoggingIn",
    FinishLoggingOut: "FinishLoggingOut",
    FinishRegistering: "FinishRegistering",

    //Trips
    FinishCreatingTrip: "FinishCreatingTrip",
    FinishEditingTrip: "FinishEditingTrip",
    FinishDeletingTrip: "FinishDeletingTrip",
    FinishSelectingTrip: "FinishSelectingTrip",
    ToggleEditingTrips: "ToggleEditingTrips",

    //Destination
    SelectDestination: "SelectDestination",
    UnselectDestination: "UnselectDestination",
    FinishCreatingDestination: "FinishCreatingDestination",
    FinishDeletingDestination: "FinishDeletingDestination",
    SetShowDestinationSelector: "SetShowDestinationSelector",
    FocusDestination: "FocusDestination",
    FinishSavingNote: "FinishSavingNote",
    FinishChangingDate: "FinishChangingDate",
    FinishChangingDepDate: "FinishChangingDepDate",

    //Google Session Mgmt
    SetGoogleToken: "SetGoogleToken",
    SetGettingGoogleToken: "SetGettingGoogleToken",
    FinishAutoCompleting: "FinishAutoCompleting",
    ClearGuesses: "ClearGuesses",

    //Error Cases
    LoginError: "LoginError",
    RegisterError: "RegisterError",
});

const host = "https://tripservice.duckdns.org:8442";

function checkForErrors(response){
    if(!response.ok){
        throw Error(`${response.status}: ${response.statusText}`)
    }
    return response;
}

//Navigation
export function doDropdown(){
    return {
        type: Action.DoDropdown
    }
}

export function stopDropdown(){
    return {
        type: Action.StopDropdown
    }
}

export function goToRegistration(){
    return {
        type: Action.GoToRegistration
    }
}

export function goToMainPage(){
    return {
        type: Action.GoToMainPage
    }
}

export function goToLogin(){
    return {
        type: Action.GoToLogin
    }
}

//User
export function startLoggingIn(username, password){
    return dispatch => {
        dispatch({type: Action.LoginLoading, payload: true});
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password})
        }
        fetch(`${host}/login`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok && data.success){
                dispatch(finishLoggingIn(data.userid, data.username, data.trips));
            }
            else{
                dispatch({type: Action.LoginError});
            }
        })
        .catch(err => {
            dispatch({type: Action.LoginError});
        })
        .finally(() => dispatch({type: Action.LoginLoading, payload: false}));
    }
}



export function finishLoggingIn(userid, username, trips){
    return {
        type: Action.FinishLoggingIn,
        payload: {userid, username, trips}
    }
}

export function startLoggingOut(username, password){
    return dispatch => {
        fetch(`${host}/logout`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishLoggingOut())
            }
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function finishLoggingOut(){
    return{
        type: Action.FinishLoggingOut,
    }
}

export function startRegistering(username, password, email){
    return dispatch => {
        dispatch({type: Action.RegisterLoading, payload: true});
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password, email})
        }

        fetch(`${host}/register`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishRegistering(username, data.id));
            }
            else{
                dispatch({type: Action.RegisterError});
            }
        })
        .finally(() => {
            dispatch({type: Action.RegisterLoading, payload: false});
        })
    }
}

export function finishRegistering(username, id){
    return {
        type: Action.FinishRegistering,
        payload: {id, username}
    }
}


//Trips

export function startCreatingTrip(userid){
    return dispatch => {
        dispatch({type: Action.TripLoading, payload: true});
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({userid})
        }
        fetch(`${host}/trip`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch({type: Action.TripLoading, payload: false});
                dispatch(finishCreatingTrip(data.id));
            }
        })
        .catch(err => {
            dispatch({type: Action.TripLoading, payload: false});
            console.error(err);
        })
    }
}



export function finishCreatingTrip(id){
    return {
        type: Action.FinishCreatingTrip,
        payload: id,
    }
}

export function startEditingTrip(tripid, newName){
    return dispatch => {
        dispatch({type: Action.DestinationLoading, payload: true});
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: tripid, name: newName})
        }
        fetch(`${host}/trip`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if (data.ok){
                dispatch({type: Action.DestinationLoading, payload: false});
                dispatch(finishEditingTrip(tripid, newName));
            }
            else{
                dispatch({type: Action.DestinationLoading, payload: false});
            }
        })
    }
}

export function finishEditingTrip(id, newName){
    return {
        type: Action.FinishEditingTrip,
        payload: {id, newName}
    }
}

export function startDeletingTrip(tripid){
    return dispatch => {
        dispatch({type: Action.TripLoading, payload: true});
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: tripid})
        }
        fetch(`${host}/trip`, options)
        .then(checkForErrors)
        .then(result => result.json())
        .then(data => {
            if(data.ok){
                dispatch({type: Action.TripLoading, payload: false});
                dispatch(finishDeletingTrip(tripid));
            }
            else{
                dispatch({type: Action.TripLoading, payload: false});
                console.error("Error deleting trip");
            }
        })
    }
}

export function finishDeletingTrip(tripid){
    return{
        type: Action.FinishDeletingTrip,
        payload: tripid
    }
}

export function startSelectingTrip(trip){
    return dispatch => {
        dispatch({type: Action.TripLoading, payload: true});
        fetch(`${host}/trip/${trip.id}/destination`)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishSelectingTrip(trip, data.destinations));
            }
            else{
                console.error("Error selecting trip.");
            }
        })
        .finally(() => dispatch({type: Action.TripLoading, payload: false}))
    }
}

export function toggleEditingTrips(state){
    return {
        type: Action.ToggleEditingTrips,
        payload: state
    }
}

export function finishSelectingTrip(trip, destinations){
    return {
        type: Action.FinishSelectingTrip,
        payload: {trip, destinations}
    }
}

//Google Session Mgmt
export function startAutoCompleteSession(userid){
    return dispatch =>{
        dispatch({
            type: Action.SetGettingGoogleToken,
            payload: true,
        })
        fetch(`${host}/sessiontoken/${userid}`)
        .then(checkForErrors)
        .then(result => result.json())
        .then(data => {
            if(data.ok){
                const token = data.token
                dispatch({
                    type: Action.SetGoogleToken,
                    payload: token,
                })                
            }
            else{
                dispatch({
                    type: Action.SetGettingGoogleToken,
                    payload: false,
                });
                console.error("Error getting session token")
            }
        })
    }
}

export function endAutoCompleteSession(){
    return {
        type: Action.EndAutoCompleteSession
    }
}

export function startAutoCompleting(text, token){
    return dispatch => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({text, token})
        }
        fetch(`${host}/autocomplete`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishAutoCompleting(data.guesses));
            }
            else{
                console.error("Could not autocomplete.")
            }
        })
        .finally(() => {
            dispatch({type: Action.AutocompleteLoading, payload: false});
        })
    }
}

export function finishAutoCompleting(guesses){
    return{
        type: Action.FinishAutoCompleting,
        payload: guesses,
    }
}

export function clearGuesses(){
    return{
        type: Action.ClearGuesses,
    }
}

//Destination

export function selectDestination(id, name){
    return{
        type: Action.SelectDestination,
        payload: {id, name}
    }
}

export function unselectDestination(){
    return{
        type: Action.UnselectDestination
    }
};

export function createDestination(index, token, tripid, placeid, name){
    return dispatch => {
        dispatch({type: Action.DestinationLoading, payload: true});
        const newName = name.substring(0, name.length - 5);
        const newToken = token;
        dispatch({type: Action.SetGoogleToken, payload: null});
        const options = {
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({index, newName, token: newToken, placeid}),
        }
        fetch(`${host}/trip/${tripid}/destination`, options)
        .then(checkForErrors)
        .then(result => result.json())
        .then(data => {
            if(data.ok){
                dispatch({type: Action.DestinationLoading, payload: false});
                dispatch(finishCreatingDestination(data.id, data.url, data.fetchphotourl, index, tripid, placeid, newName, data.durdist1, data.durdist2, data.utcoffset, data.arrival, data.departure));
            }
            else{
                dispatch({type: Action.DestinationLoading, payload: false});
                console.error("Error adding destination");
            }
        })
    };
};

export function finishCreatingDestination(id, url, fetchphotourl, index, tripid, placeid, name, durdist1, durdist2, utcoffset, arrival, departure){
    return{
        type: Action.FinishCreatingDestination,
        payload: {id, url, fetchphotourl, dindex: index, tripid, placeid, name, durdist1, durdist2, utcoffset, arrival, departure}
    }
}

export function startDeletingDestination(id, dindex, tripid){
    return dispatch => {
        dispatch({type: Action.DestinationLoading, payload: true});
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({dindex})
        }
        fetch(`${host}/trip/${tripid}/destination/${id}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                console.log("Server has responded to trip delete");
                dispatch(finishDeletingDestination(id, dindex, data.durdist));
            }
            else{
                console.error("Could not delete destination");
            }
        })
        .catch(err => console.error(err))
        .finally(() => dispatch({type: Action.DestinationLoading, payload: false}))
    }
}

export function finishDeletingDestination(id, dindex, durdist){
    return{
        type: Action.FinishDeletingDestination,
        payload: {id, dindex, durdist},

    }
}

export function setShowDestinationSelector(state){
    return{
        type: Action.SetShowDestinationSelector,
        payload: state
    }
}

export function focusDestination(destination){
    return{
        type: Action.FocusDestination,
        payload: destination
    }
}

export function startSavingNote(text, id, tripid){
    return dispatch => {
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({text})
        }
        fetch(`${host}/trip/${tripid}/destination/${id}`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishSavingNote(text, id));
            }
            else{
                console.error("Could not save note");
            }
        })
        .finally(() => dispatch({type: Action.NoteLoading, payload: false}))
    }
}

export function startChangingDate(month, day, year, hour, min, half, tripid, id){
    return dispatch => {
        setTimeout( () => {
            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({month, day, year, hour, min, half})
            }
            fetch(`${host}/trip/${tripid}/destination/${id}/arrival`, options)
            .then(checkForErrors)
            .then(response => response.json())
            .then(data => {
                if(data.ok){
                    dispatch(finishChangingDate(month, day, year, hour, min, half, id));
                }
                else{
                    console.error("Problem saving date");
                }
            })
            .finally(() => dispatch({type: Action.DateLoading, payload: false}));
        }, 1000);
    }
}

export function startChangingDepDate(month, day, year, hour, min, half, tripid, id){
    return dispatch => {
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({month, day, year, hour, min, half})
        }
        fetch(`${host}/trip/${tripid}/destination/${id}/departure`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                dispatch(finishChangingDepDate(month, day, year, hour, min, half, id));
            }
            else{
                console.error("Problem saving date");
            }
        })
        .finally(() => dispatch({type: Action.DateLoading, payload: false}));
    }
}

export function finishChangingDepDate(month, day, year, hour, min, half, id){
    return {
        type: Action.FinishChangingDepDate,
        payload: {id, departure: {month, day, year, hour, min, half}}
    }
}

export function finishChangingDate(month, day, year, hour, min, half, id){
    return {
        type: Action.FinishChangingDate,
        payload: {id, arrival: {month, day, year, hour, min, half}}
    }
}

export function finishSavingNote(text, id){
    return{
        type: Action.FinishSavingNote,
        payload: {text, id}
    }
}



