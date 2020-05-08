import { Action } from "./actions";


const initialState = {
    //Scene info
    atRegistration: false,
    atLogin: false,
    isDropdown: false,
    isEditingTrip: false,
    showDestinationSelector: false,


    //User info
    user: {isLoggedIn: false},

    //Trip info
    tripLoading: false,
    trips: [{id: 1, name: "Big Trip"}, {id: 2, name: "Little Trip"}],
    currentTrip: {},

    //Destination info
    destinations: [],
    currentDestination: {},    //pertains to observing already created destinations
    selectedDestination: null, //pertains to google searching
    
    //Place info
    places: [],

    //Google API
    google: null,
    mapLoaded: false,
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
                currentTrip: {},
                showDestinationSelector: false,
                guesses: [],
            }
        
        case Action.FinishLoggingOut:
            return{
                ...state,
                user: {isLoggedIn: false},
                destinations: [],
                trips: [],
                currentTrip: {},
            }

        case Action.GoToRegistration:
            return{
                ...state,
                atRegistration: true
            }

        case Action.GoToLogin:
            return{
                ...state,
                atLogin: true,
            }
        
        case Action.FinishRegistering:
            return{
                ...state,
                user: {...action.payload, isLoggedIn: true},
                trips: [],
                currentTrip: {},
                atRegistration: false,
                destinations: [],
                showDestinationSelector: false,
                guesses: [],
            }
        

        case Action.FinishCreatingTrip:
            return{
                ...state,
                currentTrip: {id: action.payload, name: "New Trip"},
                trips: [...state.trips, {id: action.payload, name: "New Trip"}],
                destinations: [],
                isEditingTrip: true,
                showDestinationSelector: false,
                guesses: []
            }
        
            //DELETE?
        case Action.ShowDestinationSelect:
            return{
                ...state,
                atDestinationSelect: true,
                destinationSelectIndex: action.payload
            }

            //DELETE?
        case Action.HideDestinationSelect:
            return{
                ...state,
                atDestinationSelect: false
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
                    currentTrip: {},
                    trips: state.trips.filter(trip => trip.id !== action.payload),
                    destinations: [],
                }

        case Action.FinishSelectingTrip:
            return{
                ...state,
                isEditingTrip: false,
                currentTrip: action.payload.trip,
                destinations: action.payload.destinations,
                selectedDestination: null,
                currentDestination: {},
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
                selectedDestination: action.payload
            }
        case Action.UnselectDestination:
            return{
                ...state,
                selectedDestination: null,
            };

        case Action.FinishCreatingDestination:
            const newDestination = {id: action.payload.id, url: action.payload.url, fetchphotourl: action.payload.fetchphotourl, dindex: action.payload.dindex, tripid: action.payload.tripid, placeid: action.payload.placeid, name: action.payload.name, dur: action.payload.durdist2.dur, dist: action.payload.durdist2.dist};
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
            };

        case Action.SetShowDestinationSelector:
            return{
                ...state,
                showDestinationSelector: action.payload,
                guesses: [],
            };

        

        
        


        default:
            return state;
    }
    
}

export default reducer;