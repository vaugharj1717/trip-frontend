export const Action = Object.freeze({
    FinishCreatingTrip: "FinishCreatingTrip",
    FinishLoggingIn: "FinishLoggingIn",
    FinishLoggingOut: "FinishLoggingOut",
    FinishRegistering: "FinishRegistering",
    GoToRegistration: "GoToRegistration",
    GoToMainPage: "GoToMainPage",
    ShowDestinationSelect: "ShowDestinationSelect",
    HideDestinationSelect: "HideDestinationSelect",
    FinishCreatingDestination: "FinishCreatingDestination",
    GoToLogin: "GoToLogin",
    FinishEditingTrip: "FinishEditingTrip",
    FinishDeletingTrip: "FinishDeletingTrip",
    FinishSelectingTrip: "FinishSelectingTrip",
    ToggleEditingTrips: "ToggleEditingTrips",
    DoDropdown: "DoDropdown",
    StopDropdown: "StopDrodown"
});

const host = "http://localhost:3444";

function checkForErrors(response){
    if(!response.ok){
        throw Error(`${response.status}: ${response.statusText}`)
    }
    return response;
}

export function startLoggingIn(username, password){
    return dispatch => {
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
                console.log("Login request complete:" + data.userid);
                dispatch(finishLoggingIn(data.userid, data.username, data.trips))
            }
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function goToLogin(){
    return {
        type: Action.GoToLogin
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

export function startRegistering(username, password, email){
    return dispatch => {
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
            dispatch(finishRegistering(data.userID, data.username))
        });
    }
}

export function finishRegistering(userID, username){
    return {
        type: Action.FinishRegistering,
        payload: {userID, username}
    }
}


export function startCreatingTrip(userid){
    return dispatch => {
        console.log(userid);
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
                console.log("new trip id:" + data.resultId);
                dispatch(finishCreatingTrip(data.id));
            }
        })
        .catch(err => console.error(err));
    }
}

export function showDestinationSelect(index){
    return {
        type: Action.ShowDestinationSelect,
        payload: index,
    }
}

export function hideDestinationSelect(){
    return{
        type: hideDestinationSelect,
    }
}

export function finishCreatingTrip(id){
    return {
        type: Action.FinishCreatingTrip,
        payload: id,
    }
}

export function startCreatingDestination(index, id, currentTrip){
    return dispatch =>{
        const currentTripID = currentTrip.id;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({id, currentTripID, index})
        }

        fetch(`${host}/${currentTrip.id}/destinations`, options)
        .then(checkForErrors)
        .then(response => response.json())
        .then(data => {
            dispatch(finishCreatingDestination(index, data.newDestination));
        });
    }
}

export function finishCreatingDestination(index, newDestination){
    return{
        type: Action.FinishCreatingDestination,
        payload: {index, newDestination}
    }
}

export function startEditingTrip(tripid, newName){
    return dispatch => {
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
                dispatch(finishEditingTrip(tripid, newName));
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
                dispatch(finishDeletingTrip(tripid));
            }
            else{
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
        fetch(`${host}/trip/${trip.id}`)
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
