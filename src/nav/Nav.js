import React, {useState} from 'react';
import './Nav.css';
import {useSelector, useDispatch} from 'react-redux';
import {goToRegistration, startLoggingOut, goToLogin, startSelectingTrip, startCreatingTrip, doDropdown, stopDropdown} from '../actions'

function Nav(props){


    const dispatch = useDispatch();
    const user = props.user;
    const trips = useSelector(state => state.trips);
    const isDropped = useSelector(state => state.isDropdown);

    function setDropped(state){
        if(state){
            dispatch(doDropdown());
        }
        else{
            dispatch(stopDropdown());
        }
    }
    function onLogout(){
        dispatch(startLoggingOut());
    }

    function onLogin(){
        dispatch(goToLogin());

    }

    function onSelectTrip(trip){
        dispatch(startSelectingTrip(trip));
    }

    function onCreateTrip(){
        dispatch(startCreatingTrip(user.id));
    }

    function onRegister(){
        dispatch(goToRegistration());
    }

    if(user.isLoggedIn){
        return(
            <div className = "nav">
                <div className = "nav-left">
                    <div className = "nav-logo">
                        Trip Maker
                    </div>
                </div>
                <div className = "nav-right">
                    <div className = "nav-new-trip nav-button" onClick={onCreateTrip}>
                        New Trip
                    </div>
                    <div className = "nav-select-trip nav-button" onClick={(e) =>{setDropped(!isDropped); e.stopPropagation()}}>
                        Select Trip
                        {isDropped &&
                        <div className="nav-dropdown-pane">
                            {trips.map(trip => {return(
                                <div key= {trip.id} className="nav-dropdown-item" onClick={()=> onSelectTrip(trip)}>
                                    {trip.name}
                                </div>
                            )})}  
                        </div>
                        }
                        
                    </div>
                    <div className = "nav-logout nav-button" onClick={onLogout}>
                        Logout
                    </div>
                </div>
            </div>  
        )
    }
    else{
        return(
            <div className = "nav">
                <div className = "nav-left">
                    <div className = "nav-logo">
                        Trip Maker
                    </div>
                </div>
                <div className = "nav-right">
                    <div className = "nav-login nav-button" onClick={onLogin}>
                        Login
                    </div>
                    <div className = "nav-register nav-button" onClick={onRegister}>
                        Register
                    </div>
                </div>
            </div>
        )}
}

export default Nav