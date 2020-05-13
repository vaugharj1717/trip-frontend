import React, {useState} from 'react'
import './Registration.css';
import {useDispatch} from 'react-redux';
import {startRegistering, goToMainPage} from '../actions.js';



function Registration(props){
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    function onRegister(username, password, email){
        dispatch(startRegistering(username, password, email))
    }
    function onBack(){
        dispatch(goToMainPage());
    }



    return(
        <div className="registration">
            <div className="registration-header">Register</div>
            <div className="registration-label username">Username</div>
            <input type="text" className="registration-field field-username" onChange={(e) => setUsername(e.target.value)}></input>
            <div className="registration-label password">Password</div>
            <input type="password" className="registration-field field-password" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="registration-label email">Email</div>
            <input type="text" className="registration-field field-email" onChange={(e) => setEmail(e.target.value)}></input>
            <button className="registration-submit" onClick={() => onRegister(username, password, email)}>Register</button>
        </div>
        
    )
}

export default Registration;