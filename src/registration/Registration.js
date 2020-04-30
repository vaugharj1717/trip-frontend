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
            <div className="registration-label">Username</div>
            <input type="text" className="registration-field" onChange={(e) => setUsername(e.target.value)}></input>
            <div className="registration-label">Password</div>
            <input type="text" className="registration-field" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="registration-label">Email</div>
            <input type="text" className="registration-field" onChange={(e) => setEmail(e.target.value)}></input>
            <button className="registration-submit" onClick={() => onRegister(username, password, email)}>Submit</button>
            <button className="registration-back" onClick={() => onBack()}>Back</button>
        </div>
        
    )
}

export default Registration;