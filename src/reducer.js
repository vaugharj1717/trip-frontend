import { Action } from "./actions";


const initialState = {
    //Scene info
    atRegistration: false,
    atLogin: false,
    isDropdown: false,
    isEditingTrip: false,


    //User info
    user: {isLoggedIn: true},

    //Trip info
    tripLoading: false,
    trips: [{id: 1, name: "Big Trip"}, {id: 2, name: "Little Trip"}],
    currentTrip: {},

    //Destination info
    destinations: [{id: 1, name: "San Diego"}, {id: 2, name: "New York City"}, {id: 3, name: "Zion National Park"}],
    currentDestination: {},
    
    //Place info
    places: [],

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
            }
        

        case Action.FinishCreatingTrip:
            return{
                ...state,
                currentTrip: {id: action.payload, name: "New Trip"},
                trips: [...state.trips, {id: action.payload, name: "New Trip"}],
                destinations: [],
                isEditingTrip: true,
            }
        
        

        case Action.ShowDestinationSelect:
            return{
                ...state,
                atDestinationSelect: true,
                destinationSelectIndex: action.payload
            }

        case Action.HideDestinationSelect:
            return{
                ...state,
                atDestinationSelect: false
            }
        
        case Action.FinishCreatingDestination:
            return{
                ...state,
                destinations: state.destinations.reduce((totalArr, currVal, i) => {
                    if(action.payload.index === i){
                        totalArr.push(action.payload.newDestination);
                    }
                    totalArr.push(currVal);
                }, [])
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
                    trips: state.trips.filter(trip => trip.id !== action.payload)
                }

        case Action.FinishSelectingTrip:
            return{
                ...state,
                isEditingTrip: false,
                currentTrip: action.payload.trip,
                destinations: action.payload.destinations
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

        default:
            return state;
    }
    
}

export default reducer;