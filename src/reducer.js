import { Action } from "./actions";


const initialState = {
    //Scene info
    atRegistration: false,
    atLogin: false,
    isDropdown: false,
    isEditingTrip: false,
    showDestinationSelector: false,

    //Loading info
    loginLoading: false,
    registerLoading: false,
    dateLoading: false,
    noteLoading: false,
    tripLoading: false,
    destinationLoading: false,


    //User info
    user: {isLoggedIn: false},

    //Trip info
    trips: [{id: 1, name: "Big Trip"}, {id: 2, name: "Little Trip"}],
    currentTrip: null,

    //Destination info
    destinations: [],
    currentDestination: null,    //pertains to observing already created destinations
    selectedDestination: null,   //pertains to google searching
    
    //Place info
    places: [],

    //Google API
    googleToken: null,
    gettingGoogleToken: false,
    guesses: [],
};

function reducer(state = initialState, action){
    switch (action.type) {
        case Action.GoToMainPage:
            return{
                ...state,
                atRegistration: false,
                atLogin: false
            }

        case Action.FinishLoggingIn:
            return{
                ...state,
                user: {id: action.payload.userid, username: action.payload.username, isLoggedIn: true},
                atLogin: false,
                trips: action.payload.trips,
                destinations: [],
                currentTrip: null,
                showDestinationSelector: false,
                guesses: [],
            }
        
        case Action.FinishLoggingOut:
            return{
                ...state,
                user: {isLoggedIn: false},
                destinations: [],
                trips: [],
                currentTrip: null,
                currentDestination: null,
            }

        case Action.GoToRegistration:
            return{
                ...state,
                atRegistration: true,
                atLogin: false,
            }

        case Action.GoToLogin:
            return{
                ...state,
                atLogin: true,
                atRegistration: false,
            }
        
        case Action.FinishRegistering:
            return{
                ...state,
                user: {...action.payload, isLoggedIn: true},
                trips: [],
                currentTrip: null,
                atRegistration: false,
                destinations: [],
                showDestinationSelector: false,
                guesses: [],
                currentDestination: null,
            }
        

        case Action.FinishCreatingTrip:
            return{
                ...state,
                currentTrip: {id: action.payload, name: "New Trip"},
                trips: [...state.trips, {id: action.payload, name: "New Trip"}],
                destinations: [],
                isEditingTrip: true,
                showDestinationSelector: false,
                guesses: [],
                currentDestination: null,
            }
        



        case Action.FinishEditingTrip:
            return{
                ...state,
                isEditingTrip: false,
                trips: state.trips.map(trip => {
                    if(trip.id === action.payload.id){
                        return ({id: trip.id, name: action.payload.newName })   
                    }
                    else return trip;
                }),
                currentTrip: {id: state.currentTrip.id, name: action.payload.newName}
                }

        case Action.FinishDeletingTrip:
                return{
                    ...state,
                    currentTrip: null,
                    trips: state.trips.filter(trip => trip.id !== action.payload),
                    destinations: [],
                    currentDestination: null,
                }

        case Action.FinishSelectingTrip:
            return{
                ...state,
                isEditingTrip: false,
                currentTrip: action.payload.trip,
                destinations: action.payload.destinations,
                selectedDestination: null,
                currentDestination: null,
                showDestinationSelector: false,
            }

        case Action.ToggleEditingTrips:
            return{
                ...state,
                isEditingTrip: action.payload
            }

        case Action.DoDropdown:
            return{
                ...state,
                isDropdown: true,
            }

        case Action.StopDropdown:
            return{
                ...state,
                isDropdown: false,
            }
        case Action.SetGoogleToken:
            return{
                ...state,
                googleToken: action.payload,
                gettingGoogleToken: false,
            }
        case Action.SetGettingGoogleToken:
            return{
                ...state,
                gettingGoogleToken: action.payload
            }
        case Action.FinishAutoCompleting:
            return{
                ...state,
                guesses: action.payload,
            }
        case Action.ClearGuesses:
            return{
                ...state,
                guesses: [],
            }
        case Action.SelectDestination:
            return{
                ...state,
                selectedDestination: action.payload,
            }
        case Action.UnselectDestination:
            return{
                ...state,
                selectedDestination: null,
            };

        case Action.LoginLoading:
            return{
                ...state,
                loginLoading: action.payload,
            }

        case Action.RegisterLoading:
            return{
                ...state,
                registerLoading: action.payload,
            }

        case Action.DestinationLoading:
            return{
                ...state,
                destinationLoading: action.payload,
            }

        case Action.TripLoading:
            return{
                ...state,
                tripLoading: action.payload,
            }

        case Action.NoteLoading:
            return{
                ...state,
                noteLoading: action.payload,
            }

        case Action.DateLoading:
            return{
                ...state,
                dateLoading: action.payload,
            }

        case Action.FinishCreatingDestination:
            const newDestination = {id: action.payload.id, url: action.payload.url, fetchphotourl: action.payload.fetchphotourl, dindex: action.payload.dindex, tripid: action.payload.tripid, placeid: action.payload.placeid, name: action.payload.name, dur: action.payload.durdist2.dur, dist: action.payload.durdist2.dist, utcoffset: action.payload.utcoffset, arrival: action.payload.arrival, departure: action.payload.departure};
            console.log("new index: " + action.payload.dindex);
            return{
                ...state,
                destinations: [...state.destinations.map(d => {
                    console.log(d.dindex);
                    //bump up destinations one index that are after new one
                    if(d.dindex >= action.payload.dindex){
                        return {...d, dindex: d.dindex + 1}
                    }
                    //update duration and distance of destination before new one
                    else if(d.dindex === action.payload.dindex - 1){
                        return {...d, dur: action.payload.durdist1.dur, dist: action.payload.durdist1.dist}
                    }
                    //otherwise do nothing
                    else{
                        return d;
                    }
                }), newDestination],
                currentDestination: newDestination,
                showDestinationSelector: false,
                guesses: [],
            };

        case Action.FinishDeletingDestination:
            const filteredDestinations = state.destinations.filter(d => d.id !== action.payload.id);
            const newDestinations = filteredDestinations.map(d => {
                if(d.dindex > action.payload.dindex) return {...d, dindex: d.dindex - 1}
                else if(d.dindex == action.payload.dindex - 1) return {...d, dur: action.payload.durdist.dur, dist: action.payload.durdist.dist}
            })
            return{
                ...state,
                destinations: newDestinations,
                currentDestination: null
            };

        case Action.SetShowDestinationSelector:
            return{
                ...state,
                showDestinationSelector: action.payload,
                guesses: [],
            };

        case Action.FocusDestination:
            console.log(action.payload);
            return{
                ...state,
                currentDestination: action.payload,
                showDestinationSelector: false,
            }

        case Action.FinishSavingNote:
            return{
                ...state,
                destinations: state.destinations.map(d => {
                    if(d.id === action.payload.id) return {...d, text: action.payload.text}
                    else return d;
                })
            }
        
        case Action.FinishChangingDate:
            return{
                ...state,
                destinations: state.destinations.map(d => {
                    if(d.id === action.payload.id) return {...d, arrival: action.payload.arrival}
                    else return d;
                })
            }

        case Action.FinishChangingDepDate:
            return{
                ...state,
                destinations: state.destinations.map(d => {
                    if(d.id === action.payload.id) return {...d, departure: action.payload.departure}
                    else return d;
                })
            }

        
        


        default:
            return state;
    }
    
}

export default reducer;